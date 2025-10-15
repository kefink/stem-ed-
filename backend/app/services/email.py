from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, Optional, Dict, Any
from app.core.config import settings

import smtplib
from email.message import EmailMessage


class EmailProvider(Protocol):
    async def send(self, *, subject: str, body: str, to: str, from_addr: Optional[str] = None) -> None: ...


@dataclass
class SMTPProvider:
    host: str
    port: int = 587
    user: Optional[str] = None
    password: Optional[str] = None
    use_tls: bool = True

    async def send(self, *, subject: str, body: str, to: str, from_addr: Optional[str] = None) -> None:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = from_addr or (getattr(settings, "SMTP_FROM", None) or "no-reply@localhost")
        msg["To"] = to
        msg.set_content(body)

        if self.use_tls:
            with smtplib.SMTP(self.host, self.port) as s:
                s.starttls()
                if self.user and self.password:
                    s.login(self.user, self.password)
                s.send_message(msg)
        else:
            with smtplib.SMTP(self.host, self.port) as s:
                if self.user and self.password:
                    s.login(self.user, self.password)
                s.send_message(msg)


@dataclass
class SendGridProvider:
    api_key: str

    async def send(self, *, subject: str, body: str, to: str, from_addr: Optional[str] = None) -> None:
        # Placeholder: Implement with official SendGrid client or HTTP call.
        raise NotImplementedError("SendGrid provider not implemented")


@dataclass
class MailgunProvider:
    api_key: str
    domain: str

    async def send(self, *, subject: str, body: str, to: str, from_addr: Optional[str] = None) -> None:
        # Placeholder: Implement with HTTP API to Mailgun.
        raise NotImplementedError("Mailgun provider not implemented")


@dataclass
class SESProvider:
    region: str

    async def send(self, *, subject: str, body: str, to: str, from_addr: Optional[str] = None) -> None:
        # Placeholder: Implement with boto3 SES client.
        raise NotImplementedError("SES provider not implemented")


def get_email_provider() -> Optional[EmailProvider]:
    # Choose provider by settings; currently supports SMTP only unless API keys present.
    if getattr(settings, "SMTP_HOST", None):
        return SMTPProvider(
            host=settings.SMTP_HOST,
            port=int(getattr(settings, "SMTP_PORT", 587)),
            user=getattr(settings, "SMTP_USER", None),
            password=getattr(settings, "SMTP_PASSWORD", None),
            use_tls=bool(getattr(settings, "SMTP_TLS", True)),
        )
    # Extend here: if SENDGRID_API_KEY configured, return SendGridProvider(...)
    # if MAILGUN_API_KEY & MAILGUN_DOMAIN configured, return MailgunProvider(...)
    # if AWS creds/region configured, return SESProvider(...)
    return None
