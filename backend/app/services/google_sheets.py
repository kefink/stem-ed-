"""
Google Sheets integration service for saving contact messages and newsletter subscribers
"""
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
from typing import Optional
import os
from pathlib import Path

from app.core.config import settings


class GoogleSheetsService:
    """Service for writing data to Google Sheets"""
    
    def __init__(self):
        self.credentials_file = settings.GOOGLE_SHEETS_CREDENTIALS_FILE
        self.contact_sheet_id = settings.GOOGLE_SHEETS_CONTACT_SHEET_ID
        self.newsletter_sheet_id = settings.GOOGLE_SHEETS_NEWSLETTER_SHEET_ID
        self.enabled = all([self.credentials_file, self.contact_sheet_id, self.newsletter_sheet_id])
        
        if self.enabled:
            self._init_client()
        else:
            print("⚠️  Google Sheets integration disabled (missing credentials or sheet IDs)")
    
    def _init_client(self):
        """Initialize the Google Sheets client"""
        try:
            scopes = [
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive"
            ]
            # Resolve path relative to backend directory
            backend_dir = Path(__file__).parent.parent.parent
            credentials_path = backend_dir / self.credentials_file
            
            creds = Credentials.from_service_account_file(
                str(credentials_path),
                scopes=scopes
            )
            self.client = gspread.authorize(creds)
            print("✅ Google Sheets client initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize Google Sheets client: {e}")
            self.enabled = False
    
    def add_contact_message(
        self,
        name: Optional[str],
        email: str,
        organization: Optional[str],
        phone: Optional[str],
        service: Optional[str],
        message: Optional[str],
        created_at: datetime
    ) -> bool:
        """
        Add a contact message to Google Sheets
        
        Returns True if successful, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            sheet = self.client.open_by_key(self.contact_sheet_id).sheet1
            
            # Check if headers exist, if not create them
            if sheet.row_count == 0 or not sheet.row_values(1):
                headers = ["Date", "Name", "Email", "Organization", "Phone", "Service", "Message"]
                sheet.append_row(headers)
            
            # Format the row data
            row = [
                created_at.strftime("%Y-%m-%d %H:%M:%S"),
                name or "",
                email,
                organization or "",
                phone or "",
                service or "",
                message or ""
            ]
            
            sheet.append_row(row)
            print(f"✅ Contact message saved to Google Sheets: {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to save contact message to Google Sheets: {e}")
            return False
    
    def add_newsletter_subscriber(
        self,
        email: str,
        first_name: Optional[str],
        last_name: Optional[str],
        organization: Optional[str],
        role: Optional[str],
        interests: Optional[list],
        created_at: datetime
    ) -> bool:
        """
        Add a newsletter subscriber to Google Sheets
        
        Returns True if successful, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            sheet = self.client.open_by_key(self.newsletter_sheet_id).sheet1
            
            # Check if headers exist, if not create them
            if sheet.row_count == 0 or not sheet.row_values(1):
                headers = ["Date", "Email", "First Name", "Last Name", "Organization", "Role", "Interests"]
                sheet.append_row(headers)
            
            # Format the row data
            row = [
                created_at.strftime("%Y-%m-%d %H:%M:%S"),
                email,
                first_name or "",
                last_name or "",
                organization or "",
                role or "",
                ", ".join(interests) if interests else ""
            ]
            
            sheet.append_row(row)
            print(f"✅ Newsletter subscriber saved to Google Sheets: {email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to save newsletter subscriber to Google Sheets: {e}")
            return False


# Singleton instance
_sheets_service: Optional[GoogleSheetsService] = None


def get_sheets_service() -> GoogleSheetsService:
    """Get or create the Google Sheets service singleton"""
    global _sheets_service
    if _sheets_service is None:
        _sheets_service = GoogleSheetsService()
    return _sheets_service
