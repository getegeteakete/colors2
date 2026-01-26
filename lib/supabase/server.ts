import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();
  
  // ビルド時に環境変数が設定されていない場合でもビルドが通るようにダミー値を使用
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key';

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: {
        getItem: (key: string) => {
          return cookieStore.get(key)?.value ?? null;
        },
        setItem: (key: string, value: string) => {
          // Server-side: cookies are set via Set-Cookie header
          // This is a no-op on the server
        },
        removeItem: (key: string) => {
          // Server-side: cookies are removed via Set-Cookie header
          // This is a no-op on the server
        },
      },
    },
  });
}









