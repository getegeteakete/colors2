import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  Home, 
  ArrowRight,
  Clock,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FlowPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              利用方法
            </h1>
            <p className="text-lg text-muted-foreground">
              リフォーム・塗装の現地調査予約から作業完了までの流れをご説明します
            </p>
          </div>

          {/* Main Flow */}
          <div className="space-y-8 mb-16">
            {[
              {
                step: 1,
                icon: Calendar,
                title: "STEP 1: 予約",
                description: "カレンダーから希望の日時を選択して予約します",
                details: [
                  "予約カレンダーページで空き枠を確認",
                  "希望する日時を選択",
                  "訪問調査またはZoom相談を選択",
                  "お客様情報と相談内容を入力",
                  "必要に応じて写真をアップロード"
                ],
                note: "予約は24時間いつでも可能です。Zoom相談も選択できます。"
              },
              {
                step: 2,
                icon: Home,
                title: "STEP 2: 現地調査",
                description: "専門スタッフが現地に訪問して調査・ヒアリングを行います",
                details: [
                  "予約日時にスタッフが現地に訪問",
                  "現状の確認とお客様のご要望をヒアリング",
                  "必要な箇所の寸法測定",
                  "写真撮影（必要な場合）",
                  "お見積もりの作成準備"
                ],
                note: "調査時間は通常30分〜1時間程度です。Zoom相談の場合はオンラインで対応します。"
              },
              {
                step: 3,
                icon: CreditCard,
                title: "STEP 3: 予約決済",
                description: "調査後、正式な見積もりを提示し、作業の予約金を決済します",
                details: [
                  "現地調査の結果を基に正式見積もりを作成",
                  "お見積もり内容をご確認いただく",
                  "ご了承いただいた場合、予約金（作業費の一部）を決済",
                  "クレジットカードで安全に決済可能",
                  "決済完了後、作業日程を調整"
                ],
                note: "予約金の金額は工事内容により異なります。詳細は見積もりでご確認ください。"
              },
              {
                step: 4,
                icon: CheckCircle2,
                title: "STEP 4: 作業終了",
                description: "専門スタッフがお客様のご要望通りに作業を実施します",
                details: [
                  "事前に調整した日程で作業を実施",
                  "作業工程のご報告（必要な場合）",
                  "作業完了後、最終チェック",
                  "お客様にご確認いただく",
                  "作業完了証明書の発行"
                ],
                note: "作業中はお客様のご都合に合わせて対応させていただきます。"
              },
              {
                step: 5,
                icon: FileText,
                title: "STEP 5: 残金決済",
                description: "作業完了後、残りの金額を決済して完了です",
                details: [
                  "作業完了確認後、残金の請求書を発行",
                  "マイページから残金を確認",
                  "クレジットカードで残金を決済",
                  "領収書をダウンロード（必要な場合）",
                  "作業完了"
                ],
                note: "決済完了後、領収書はマイページからいつでもダウンロードできます。"
              }
            ].map((item, idx) => (
              <Card key={idx} className="overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="default">{item.step}</Badge>
                        <CardTitle className="text-2xl mb-0">{item.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        このステップの流れ
                      </h4>
                      <ul className="space-y-2 ml-7">
                        {item.details.map((detail, detailIdx) => (
                          <li key={detailIdx} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div className="flex items-start gap-2 p-4 bg-muted rounded-lg">
                      <Clock className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">ポイント</p>
                        <p className="text-sm text-muted-foreground">{item.note}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">よくある質問</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>予約のキャンセルはできますか？</AccordionTrigger>
                  <AccordionContent>
                    はい、マイページから予約のキャンセルが可能です。キャンセルポリシーについては予約時にご確認いただけます。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>決済方法は何がありますか？</AccordionTrigger>
                  <AccordionContent>
                    クレジットカード決済に対応しています。Visa、Mastercard、JCB、American Expressなどの主要カードブランドがご利用いただけます。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>予約金と残金の割合は？</AccordionTrigger>
                  <AccordionContent>
                    予約金と残金の割合は工事内容により異なります。正式見積もり時に詳細をご説明いたします。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Zoom相談の場合も同じ流れですか？</AccordionTrigger>
                  <AccordionContent>
                    はい、基本的な流れは同じです。STEP 2の現地調査の代わりにZoomでのオンライン相談となります。その後の予約決済から作業、残金決済までの流れは同じです。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>領収書は発行されますか？</AccordionTrigger>
                  <AccordionContent>
                    はい、決済完了後、マイページから領収書をダウンロードできます。PDF形式で発行され、いつでも再ダウンロードが可能です。
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">準備ができましたか？</h3>
                <p className="mb-6 opacity-90">
                  今すぐ予約を開始して、リフォーム・塗装の現地調査を予約しましょう
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/reserve">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      <Calendar className="w-5 h-5 mr-2" />
                      予約カレンダーを見る
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                      トップページに戻る
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
