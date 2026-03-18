import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, current_password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'メールアドレスとパスワードは必須です' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'パスワードは8文字以上で設定してください' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, password_hash')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // パスワード変更の場合は現在のパスワードを確認
    if (current_password && user.password_hash) {
      const valid = await bcrypt.compare(current_password, user.password_hash);
      if (!valid) {
        return NextResponse.json({ error: '現在のパスワードが正しくありません' }, { status: 401 });
      }
    }

    const hash = await bcrypt.hash(password, 10);
    await supabase.from('users').update({ password_hash: hash }).eq('id', user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('set-password error:', error);
    return NextResponse.json({ error: 'パスワードの設定に失敗しました' }, { status: 500 });
  }
}
