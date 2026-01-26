import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address, content, type, photos } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // OpenAI APIキーが設定されていない場合は簡易計算
      const contentLength = content?.length || 0;
      const basePrice = type === 'onsite' ? 15000 : 10000;
      const complexityMultiplier = contentLength > 500 ? 1.5 : contentLength > 200 ? 1.2 : 1.0;
      const price = Math.round(basePrice * complexityMultiplier);
      const duration = type === 'onsite' ? 120 : 60;

      return NextResponse.json({
        price,
        duration,
        estimated: false,
      });
    }

    // OpenAI APIを使用した見積もり
    try {
      const systemPrompt = `あなたは塗装・リフォーム業者の見積もり専門家です。
以下の情報を基に、適切な見積もり金額（円）と作業時間（分）を返してください。

考慮すべき要素：
- 調査タイプ（訪問調査/Zoom相談）
- 相談内容の複雑さ
- 作業範囲の規模
- 一般的な市場価格

レスポンス形式：
{
  "price": 見積もり金額（整数）,
  "duration": 作業時間（分、整数）,
  "reasoning": "見積もりの理由（日本語）"
}`;

      const userPrompt = `調査タイプ: ${type === 'onsite' ? '訪問調査' : 'Zoom相談'}
住所: ${address || '未指定'}
相談内容: ${content}
写真: ${photos && photos.length > 0 ? `${photos.length}枚の写真あり` : '写真なし'}

上記の情報から、適切な見積もり金額と作業時間を算出してください。`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // または 'gpt-3.5-turbo' でコスト削減
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content_text = data.choices[0]?.message?.content;

      if (!content_text) {
        throw new Error('OpenAI API response is empty');
      }

      const estimate = JSON.parse(content_text);
      
      return NextResponse.json({
        price: parseInt(estimate.price) || 10000,
        duration: parseInt(estimate.duration) || 60,
        reasoning: estimate.reasoning || '',
        estimated: true,
      });
    } catch (aiError: any) {
      console.error('OpenAI API error:', aiError);
      // AI APIが失敗した場合のフォールバック
      const contentLength = content?.length || 0;
      const basePrice = type === 'onsite' ? 15000 : 10000;
      const complexityMultiplier = contentLength > 500 ? 1.5 : contentLength > 200 ? 1.2 : 1.0;
      const price = Math.round(basePrice * complexityMultiplier);
      const duration = type === 'onsite' ? 120 : 60;

      return NextResponse.json({
        price,
        duration,
        estimated: false,
        error: 'AI見積もりに失敗しましたが、簡易計算を実行しました',
      });
    }
  } catch (error) {
    console.error('Error estimating price:', error);
    return NextResponse.json(
      { error: '概算金額の計算に失敗しました' },
      { status: 500 }
    );
  }
}









