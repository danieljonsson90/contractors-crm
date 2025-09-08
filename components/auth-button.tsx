import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './logout-button';

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center justify-end w-full gap-4 mt-2 mb-4 mr-2">
      <span className="hidden lg:block">Hey, {user.email}!</span>
      <LogoutButton />
    </div>
  ) : undefined;
}
