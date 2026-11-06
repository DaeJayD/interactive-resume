# Phase 8 · Owner access and draft import

The dashboard at `/admin` signs in a single provisioned owner and imports the
current résumé into a private draft. The import is safe to retry. A second
import keeps the original draft and revision.

## Setup

1. In a Supabase project dedicated to this résumé, apply
   [the migration](../supabase/migrations/202611060001_resume_drafts.sql).
2. Disable public signups and provision the owner in Supabase Auth. Copy that
   account's user UUID. In the Supabase SQL editor, register the account.

   ```sql
   insert into public.resume_owner (user_id) values ('YOUR_AUTH_USER_UUID');
   ```

3. Set the project URL and publishable key in the app's `.env.local`.

   ```dotenv
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

4. Restart the app. Open `/admin`, sign in, and choose **Import résumé**.
   Verify that the dashboard shows revision 1 with eight projects. Sign out
   and confirm that visiting `/admin` sends you back to login.

The application uses the signed-in user's token for database access. The
publishable key is sufficient. For password recovery, manage the owner account
through Supabase Auth.

The public page still reads the checked-in configuration. Publishing is
scheduled for Phase 10.
