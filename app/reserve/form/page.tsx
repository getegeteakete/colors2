'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { getReservedTimeSlots } from '@/lib/schedule';

const formSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().optional(),
  address: z.string().optional(),
  content: z.string().min(10, '相談内容を10文字以上入力してください'),
  type: z.enum(['onsite', 'zoom']),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReserveFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const [type, setType] = useState<'onsite' | 'zoom'>('onsite');
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [aiEstimate, setAiEstimate] = useState<{ price: number; duration: number } | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      content: '',
      type: 'onsite',
    },
  });

  useEffect(() => {
    form.setValue('type', type);
  }, [type, form]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!supabase) {
      toast.error('Supabaseが設定されていません');
      return;
    }

    const client = supabase; // 型ガードのためローカル変数に代入
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await client.storage
          .from('photos')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = client.storage
          .from('photos')
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setPhotos((prev) => [...prev, ...urls]);
      toast.success('写真をアップロードしました');
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('写真のアップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEstimate = async () => {
    const address = form.watch('address');
    const content = form.watch('content');

    if (!address || !content) {
      toast.error('住所と相談内容を入力してください');
      return;
    }

    setLoadingEstimate(true);
    try {
      const response = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, content, type, photos }),
      });

      if (!response.ok) throw new Error('概算取得に失敗しました');

      const data = await response.json();
      setAiEstimate(data);
      toast.success('概算金額を取得しました');
    } catch (error) {
      console.error('Error getting estimate:', error);
      toast.error('概算金額の取得に失敗しました');
    } finally {
      setLoadingEstimate(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!date || !time) {
      toast.error('日時が選択されていません');
      return;
    }

    if (!supabase) {
      toast.error('Supabaseが設定されていません');
      return;
    }

    const client = supabase; // 型ガードのためローカル変数に代入
    try {
      // Create or get user
      let { data: userData } = await client
        .from('users')
        .select('id')
        .eq('email', values.email)
        .single();

      if (!userData) {
        const { data: newUser, error: userError } = await client
          .from('users')
          .insert({
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
          })
          .select()
          .single();

        if (userError) throw userError;
        if (!newUser) throw new Error('ユーザーの作成に失敗しました');
        userData = newUser;
      } else {
        // Update user info
        await client
          .from('users')
          .update({
            name: values.name,
            phone: values.phone,
            address: values.address,
          })
          .eq('id', userData.id);
      }

      if (!userData) {
        throw new Error('ユーザー情報が取得できませんでした');
      }

      // Create reservation
      const { data: reservation, error: reservationError } = await client
        .from('reservations')
        .insert({
          user_id: userData.id,
          type: values.type,
          date,
          time,
          address: values.type === 'onsite' ? values.address : null,
          content: values.content,
          photos,
          ai_price: aiEstimate?.price || null,
          status: 'reserved',
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

      // 予約した時間と前後1時間を予約不可にする（移動時間のため）
      const reservedTimeSlots = getReservedTimeSlots(time);
      const staffId = 'staff-001'; // デフォルトスタッフID

      try {
        // 各時間枠を予約不可に更新
        for (const slotTime of reservedTimeSlots) {
          await client
            .from('schedules')
            .update({ available: false })
            .eq('staff_id', staffId)
            .eq('date', date)
            .eq('time', slotTime);
        }
      } catch (scheduleError) {
        console.error('スケジュール更新エラー（続行）:', scheduleError);
        // スケジュール更新のエラーは予約処理を続行
      }

      // メール送信（非同期、エラーは無視）
      try {
        await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            date,
            time,
            type: values.type,
            address: values.type === 'onsite' ? values.address : undefined,
            content: values.content,
          }),
        });
      } catch (emailError) {
        console.error('メール送信エラー（続行）:', emailError);
        // メール送信のエラーは予約処理を続行
      }

      toast.success('予約が完了しました');
      router.push(`/reserve/checkout?reservation_id=${reservation.id}`);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('予約の作成に失敗しました');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>予約フォーム</CardTitle>
            <CardDescription>
              {date && time && `${date} ${time}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 業務内容の説明 */}
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-3">現地調査で対応可能な業務内容</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">塗装サービス</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>住宅の外壁や内装の塗装</li>
                    <li>施設の外装・内装塗装（商業施設・オフィスビルなど）</li>
                    <li>車体塗装</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">リフォームサービス</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>キッチンやバスルームのリフォーム</li>
                    <li>間取りの変更</li>
                    <li>収納の増設</li>
                    <li>その他住宅リフォーム全般</li>
                  </ul>
                </div>
                <p className="text-muted-foreground text-xs mt-3">
                  お客様のニーズに合わせた柔軟なプランニングを行います。まずは現地調査でお気軽にご相談ください。
                </p>
              </div>
            </div>

            <Tabs value={type} onValueChange={(v) => setType(v as 'onsite' | 'zoom')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="onsite">訪問調査</TabsTrigger>
                <TabsTrigger value="zoom">Zoom相談</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>お名前 *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メールアドレス *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>電話番号</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {type === 'onsite' && (
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>調査先住所 *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="東京都..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>相談内容 *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} placeholder="調査の目的や内容を詳しく記入してください" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>写真（任意）</Label>
                    <div className="mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                      />
                      {photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          {photos.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => removePhoto(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEstimate}
                      disabled={loadingEstimate}
                    >
                      {loadingEstimate ? '計算中...' : 'AI概算金額を取得'}
                    </Button>
                    {aiEstimate && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <p className="font-semibold">概算金額: ¥{aiEstimate.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          作業時間の目安: 約{aiEstimate.duration}分
                        </p>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    決済へ進む
                  </Button>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}








