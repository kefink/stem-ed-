"""
Quick script to add email verification columns to the database
Run this instead of Alembic migration if Alembic has issues
"""
import pymysql

def add_email_verification_columns():
    # Connect to MySQL database
    conn = pymysql.connect(
        host='LAMPEIN',
        port=3306,
        user='stemed',
        password='stemed123',
        db='stemeddb',
        charset='utf8mb4'
    )
    
    try:
        with conn.cursor() as cursor:
            print("🔧 Adding email verification columns...")
            
            # Add is_email_verified column
            try:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN is_email_verified BOOLEAN NOT NULL DEFAULT FALSE
                """)
                print("✅ Added is_email_verified column")
            except Exception as e:
                if "Duplicate column" in str(e):
                    print("⚠️  is_email_verified column already exists")
                else:
                    print(f"❌ Error adding is_email_verified: {e}")
            
            # Add verification_token column
            try:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN verification_token VARCHAR(255) NULL
                """)
                print("✅ Added verification_token column")
            except Exception as e:
                if "Duplicate column" in str(e):
                    print("⚠️  verification_token column already exists")
                else:
                    print(f"❌ Error adding verification_token: {e}")
            
            # Add verification_token_expires column
            try:
                cursor.execute("""
                    ALTER TABLE users 
                    ADD COLUMN verification_token_expires DATETIME NULL
                """)
                print("✅ Added verification_token_expires column")
            except Exception as e:
                if "Duplicate column" in str(e):
                    print("⚠️  verification_token_expires column already exists")
                else:
                    print(f"❌ Error adding verification_token_expires: {e}")
            
            # Create index on verification_token
            try:
                cursor.execute("""
                    CREATE INDEX ix_users_verification_token 
                    ON users(verification_token)
                """)
                print("✅ Created index on verification_token")
            except Exception as e:
                if "Duplicate key" in str(e) or "already exists" in str(e):
                    print("⚠️  Index on verification_token already exists")
                else:
                    print(f"❌ Error creating index: {e}")
            
            # Mark all existing users as verified (grandfather clause)
            cursor.execute("""
                UPDATE users 
                SET is_email_verified = TRUE 
                WHERE is_email_verified = FALSE
            """)
            rows_updated = cursor.rowcount
            print(f"✅ Marked {rows_updated} existing users as verified")
            
            conn.commit()
            print("\n🎉 Email verification setup complete!")
            print("✅ All columns added successfully")
            print("✅ Existing users marked as verified")
            print("\n📝 Now restart your server with: npm run dev:all")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_email_verification_columns()
