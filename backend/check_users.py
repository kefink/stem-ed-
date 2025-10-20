"""Check users in database to see verification status"""
import pymysql

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
        cursor.execute("""
            SELECT id, email, full_name, is_email_verified, verification_token
            FROM users
            ORDER BY id DESC
        """)
        users = cursor.fetchall()
        
        print("\n📊 USERS IN DATABASE:\n")
        print(f"{'ID':<5} {'Email':<40} {'Name':<20} {'Verified':<10} {'Token':<10}")
        print("="*90)
        
        for user in users:
            user_id, email, name, verified, token = user
            verified_str = "✅ YES" if verified else "❌ NO"
            token_str = "Has Token" if token else "-"
            print(f"{user_id:<5} {email:<40} {(name or ''):<20} {verified_str:<10} {token_str:<10}")
        
        print(f"\n📈 Total users: {len(users)}")
        print(f"✅ Verified: {sum(1 for u in users if u[3])}")
        print(f"❌ Unverified: {sum(1 for u in users if not u[3])}")
        
finally:
    conn.close()
