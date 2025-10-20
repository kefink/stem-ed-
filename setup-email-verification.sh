#!/bin/bash

# Email Verification Setup Script
# This script sets up the email verification feature

echo "=========================================="
echo "  Email Verification Setup"
echo "=========================================="
echo ""

echo "Step 1: Running database migration..."
cd backend
python -m alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Database migration completed successfully!"
else
    echo "⚠️  Migration may have issues. Check the output above."
fi

echo ""
echo "Step 2: Checking email configuration..."

if grep -q "^SMTP_HOST=" ../.env.local 2>/dev/null || grep -q "^SMTP_HOST=" .env 2>/dev/null; then
    echo "✅ SMTP configuration found!"
else
    echo "⚠️  SMTP not configured. Verification links will print to console."
    echo ""
    echo "To configure email, add these to backend/.env:"
    echo ""
    echo "SMTP_HOST=smtp.gmail.com"
    echo "SMTP_PORT=587"
    echo "SMTP_USER=your-email@gmail.com"
    echo "SMTP_PASSWORD=your-app-password"
    echo "SMTP_FROM=noreply@stem-ed-architects.com"
    echo ""
fi

cd ..

echo ""
echo "=========================================="
echo "  ✅ Email Verification Setup Complete!"
echo "=========================================="
echo ""
echo "📖 Read EMAIL_VERIFICATION_FEATURE.md for full documentation"
echo ""
echo "🧪 Quick Test:"
echo "1. Register a new account at http://localhost:3000/register"
echo "2. Check terminal for verification link (if SMTP not configured)"
echo "3. Click the link to verify"
echo "4. Login with your account"
echo ""
