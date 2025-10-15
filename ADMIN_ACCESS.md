# Admin Access Guide

## How to Access the Admin Dashboard

The admin dashboard is located at: **`/admin`**

### Prerequisites

1. You must have an account with the `admin` role
2. You must be logged in

### Access URLs

- **Local development**: http://localhost:3000/admin
- **Network access**: http://192.168.88.7:3000/admin

### Creating an Admin User

By default, all users are created with the `student` role. To promote a user to admin:

#### Method 1: Using the make_admin.py script (Recommended)

```bash
cd backend
python make_admin.py user@example.com
```

This will:

- Check if the user exists
- Update their role to `admin`
- Show all available users if the email is not found

#### Method 2: Direct database update

Connect to your MySQL database and run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

Verify the update:

```sql
SELECT id, email, role FROM users WHERE email = 'user@example.com';
```

### How Admin Protection Works

1. **Server-side protection** (`src/app/admin/layout.tsx`):

   - Checks if user is authenticated
   - Verifies role is exactly `"admin"`
   - Redirects to `/login?next=/admin` if not authorized

2. **Client-side check** (`src/app/admin/page.tsx`):
   - Additional useEffect check for role
   - Redirects if role changes or session becomes invalid

### Testing Admin Access

1. Create or promote an admin user:

   ```bash
   cd backend
   python make_admin.py admin@example.com
   ```

2. Login with that account at http://localhost:3000/login

3. After successful login, navigate to http://localhost:3000/admin

4. You should see the admin dashboard with:
   - Contact messages table
   - Newsletter subscribers table
   - Search and pagination

### Troubleshooting

#### "Redirects to login even though I'm logged in"

This means your role is not `admin`. Check your role:

1. Run the make_admin.py script to see all users:

   ```bash
   cd backend
   python make_admin.py test@test.com  # Use any email
   ```

2. Or check directly in MySQL:

   ```sql
   SELECT id, email, role FROM users;
   ```

3. Update the role if needed:
   ```bash
   cd backend
   python make_admin.py your-email@example.com
   ```

#### "Can login with any account to /admin"

This should NOT happen if the code is correct. The layout should block non-admin users.

Check:

1. Make sure you're running the latest code (restart dev servers)
2. Clear your browser cache and cookies
3. Check the terminal logs for the role value during login
4. Verify `src/app/admin/layout.tsx` has the role check

#### Using different URLs (localhost vs IP)

- Both http://localhost:3000 and http://192.168.88.7:3000 work
- Use **localhost** for better performance in development
- The LAN IP (192.168.88.7) is useful for testing from other devices on your network
- Auth cookies and sessions work the same on both

### Admin Dashboard Features

Once you have admin access, you can:

- **View contact messages**: See all messages submitted via the contact form
- **View newsletter subscribers**: See all newsletter signups with interests and roles
- **Search**: Filter by name, email, organization, role, or service
- **Paginate**: Browse large datasets with configurable page sizes (10, 25, 50, 100)
- **Export capability**: Can be added later (CSV/Excel export of tables)

### Security Notes

- Admin role is checked on EVERY page load (server-side)
- Sessions are validated with NextAuth + FastAPI backend
- CSRF protection is enabled for all state-changing operations
- Cookies are httpOnly and secure (in production)
- Never share admin credentials
- In production, use strong passwords and consider 2FA

### Next Steps

Want to add more admin features?

- User management (list, edit, delete users)
- Content moderation (approve/reject submissions)
- Analytics dashboard (user stats, message trends)
- Email blast to newsletter subscribers
- Role-based permissions (super-admin, moderator, etc.)
