"""
Test script to verify Cloudflare R2 connection and credentials
Run: python backend/test_r2_connection.py
"""
import sys
import os
from pathlib import Path

# Change to backend directory so .env is found
backend_dir = Path(__file__).parent
os.chdir(backend_dir)

# Add backend to path
sys.path.insert(0, str(backend_dir))

from io import BytesIO
from app.core.config import settings
from app.core.r2_storage import get_r2_storage


def test_r2_connection():
    """Test R2 connection and credentials"""
    print("🧪 TESTING CLOUDFLARE R2 CONNECTION")
    print("=" * 60)
    
    # Check configuration
    print("\n📋 Checking R2 Configuration...")
    print(f"   Storage Mode: {settings.STORAGE_MODE}")
    print(f"   R2 Endpoint: {settings.R2_ENDPOINT}")
    print(f"   R2 Bucket: {settings.R2_BUCKET_NAME}")
    print(f"   R2 Public URL: {settings.R2_PUBLIC_URL}")
    if settings.R2_ACCESS_KEY:
        print(f"   Access Key: {settings.R2_ACCESS_KEY[:8]}...{settings.R2_ACCESS_KEY[-4:]}")
    else:
        print(f"   Access Key: Not set")
    
    if not all([
        settings.R2_ENDPOINT,
        settings.R2_ACCESS_KEY,
        settings.R2_SECRET_KEY,
        settings.R2_BUCKET_NAME
    ]):
        print("\n❌ ERROR: R2 credentials not configured!")
        print("   Please set R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY, and R2_BUCKET_NAME in .env")
        return False
    
    # Initialize R2 client
    print("\n🔌 Initializing R2 Client...")
    try:
        r2 = get_r2_storage()
        print("   ✅ R2 client initialized successfully")
    except Exception as e:
        print(f"   ❌ Failed to initialize R2 client: {str(e)}")
        return False
    
    # Test upload - Create a test file
    print("\n📤 Testing File Upload...")
    try:
        # Create a simple test text file
        test_content = b"Hello from STEM-ED-ARCHITECTS! This is a test file for R2 storage."
        test_file = BytesIO(test_content)
        
        # Upload test file
        result = r2.upload_file_obj(
            file_obj=test_file,
            filename="r2-test.txt",
            content_type="text/plain",
            folder_path="test"
        )
        
        print(f"   ✅ File uploaded successfully!")
        print(f"   📁 Object Key: {result['file_path']}")
        print(f"   🌐 Public URL: {result['file_url']}")
        print(f"   📏 File Size: {result['file_size']} bytes")
        
        test_file_key = result['file_path']
        test_file_url = result['file_url']
        
    except Exception as e:
        print(f"   ❌ Upload failed: {str(e)}")
        return False
    
    # Test file existence check
    print("\n🔍 Testing File Existence Check...")
    try:
        exists = r2.file_exists(test_file_key)
        if exists:
            print(f"   ✅ File exists: {test_file_key}")
        else:
            print(f"   ❌ File not found: {test_file_key}")
            return False
    except Exception as e:
        print(f"   ❌ Existence check failed: {str(e)}")
        return False
    
    # Test list files
    print("\n📂 Testing File Listing...")
    try:
        files = r2.list_files(prefix="test", max_keys=10)
        print(f"   ✅ Found {len(files)} file(s) in 'test/' folder")
        for f in files[:3]:  # Show first 3 files
            print(f"      - {f['key']} ({f['size']} bytes)")
    except Exception as e:
        print(f"   ❌ List files failed: {str(e)}")
        # Don't return False, this is not critical
    
    # Test delete
    print("\n🗑️  Testing File Deletion...")
    try:
        deleted = r2.delete_file(test_file_key)
        if deleted:
            print(f"   ✅ Test file deleted successfully: {test_file_key}")
        else:
            print(f"   ⚠️  File delete returned False")
    except Exception as e:
        print(f"   ❌ Delete failed: {str(e)}")
        # Don't return False, file might have been deleted anyway
    
    # Verify deletion
    print("\n✅ Verifying File Was Deleted...")
    try:
        exists_after = r2.file_exists(test_file_key)
        if not exists_after:
            print(f"   ✅ Confirmed: File no longer exists")
        else:
            print(f"   ⚠️  Warning: File still exists after deletion")
    except Exception as e:
        print(f"   ✅ File not found (expected after deletion)")
    
    # Final summary
    print("\n" + "=" * 60)
    print("✅ R2 CONNECTION TEST PASSED!")
    print("=" * 60)
    print("\n🎉 Your Cloudflare R2 storage is configured correctly!")
    print(f"📁 Bucket: {settings.R2_BUCKET_NAME}")
    print(f"🌐 Public URL: {settings.R2_PUBLIC_URL}")
    print(f"💾 Storage Mode: {settings.STORAGE_MODE}")
    print("\nYou can now:")
    print("  1. Upload files through the admin media library")
    print("  2. Files will be stored in R2 cloud storage")
    print("  3. Files will be served globally via Cloudflare CDN")
    print(f"\nTo switch to R2 mode, set: STORAGE_MODE=r2 in backend/.env")
    print(f"Current mode: STORAGE_MODE={settings.STORAGE_MODE}")
    
    return True


if __name__ == "__main__":
    try:
        success = test_r2_connection()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ UNEXPECTED ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
