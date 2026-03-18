'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

const cases = [
  {
    id: 1,
    category: "外壁塗装",
    title: "戸建て住宅 外壁・屋根塗装",
    location: "福岡市東区",
    date: "2024年11月",
    description: "経年劣化によるひび割れや色あせが目立っていた外壁と屋根を全面塗装。断熱性の高い塗料を使用し、夏場の室内温度上昇を抑えることに成功しました。",
    tags: ["外壁", "屋根", "断熱塗料"],
    before: "外壁全体にひび割れ・色あせ",
    after: "新築同様の美観を回復",
    beforeImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    category: "内装リフォーム",
    title: "マンション室内 全面リフォーム",
    location: "福岡市博多区",
    date: "2024年10月",
    description: "築20年のマンションを現代的なデザインにリフォーム。壁紙張り替えと床材交換を実施し、明るく開放的な空間を実現しました。",
    tags: ["壁紙", "床材", "内装"],
    before: "古びた壁紙・フローリングの傷み",
    after: "モダンで清潔感のある室内に",
    beforeImg: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    category: "施設塗装",
    title: "商業施設 外装・内装塗装",
    location: "福岡市中央区",
    date: "2024年9月",
    description: "店舗の外観イメージを一新するため、ブランドカラーに合わせたカラーリングを提案・施工。集客効果の向上にもつながりました。",
    tags: ["店舗", "外装", "内装"],
    before: "古くなった外観で集客力が低下",
    after: "ブランドイメージに合った外観に一新",
    beforeImg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    category: "外壁塗装",
    title: "二世帯住宅 外壁塗装",
    location: "福岡市南区",
    date: "2024年8月",
    description: "二世帯住宅の広い外壁面積を効率的に施工。防カビ・防藻効果の高い塗料を採用し、長期にわたる美観維持を実現しました。",
    tags: ["外壁", "防カビ", "二世帯"],
    before: "カビ・コケが発生し見栄えが悪化",
    after: "清潔感のある白い外壁を回復",
    beforeImg: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    category: "車体塗装",
    title: "業務用車両 フルラッピング",
    location: "福岡市早良区",
    date: "2024年7月",
    description: "企業ロゴと宣伝文句をデザインした業務用バンのフルラッピングを実施。走る広告塔として高い宣伝効果を発揮しています。",
    tags: ["車体", "ラッピング", "業務車両"],
    before: "無地の業務用バン",
    after: "企業ブランドを訴求するデザインに",
    beforeImg: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    category: "内装リフォーム",
    title: "戸建て キッチン・浴室リフォーム",
    location: "福岡市西区",
    date: "2024年6月",
    description: "老朽化したキッチンと浴室を最新設備にリフォーム。使いやすさと清潔感を大幅に向上させました。",
    tags: ["キッチン", "浴室", "設備交換"],
    before: "古い設備で使いにくく掃除も困難",
    after: "機能的で清掃しやすい最新設備に",
    beforeImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&h=400&fit=crop",
  },
];

const categories = ["すべて", "外壁塗装", "内装リフォーム", "施設塗装", "車体塗装"];

const categoryColors: { [key: string]: string } = {
  "外壁塗装": "bg-blue-100 text-blue-800",
  "内装リフォーム": "bg-green-100 text-green-800",
  "施設塗装": "bg-purple-100 text-purple-800",
  "車体塗装": "bg-orange-100 text-orange-800",
};

function CaseCard({ c }: { c: typeof cases[0] }) {
  const [showAfter, setShowAfter] = useState(true);
  return (
    <Card key={c.id} className="hover:shadow-lg transition-shadow flex flex-col">
      {/* Before/After image area */}
      <div className="relative h-48 rounded-t-lg overflow-hidden bg-muted">
        <Image
          src={showAfter ? c.afterImg : c.beforeImg}
          alt={`${c.title} ${showAfter ? 'After' : 'Before'}`}
          fill
          className="object-cover transition-opacity duration-300"
        />
        {/* Toggle buttons */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <button
            onClick={() => setShowAfter(false)}
            className={`text-xs px-2 py-1 rounded font-bold transition-colors ${!showAfter ? 'bg-red-600 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
          >
            Before
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`text-xs px-2 py-1 rounded font-bold transition-colors ${showAfter ? 'bg-green-600 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
          >
            After
          </button>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[c.category] || "bg-gray-100 text-gray-800"}`}>
            {c.category}
          </span>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Calendar className="w-3 h-3" />
            {c.date}
          </div>
        </div>
        <CardTitle className="text-base">{c.title}</CardTitle>
        <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
          <MapPin className="w-3 h-3" />
          {c.location}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <CardDescription className="text-sm mb-4 flex-1">
          {c.description}
        </CardDescription>
        {/* Before/After text */}
        <div className="bg-muted/50 rounded-lg p-3 mb-4 text-xs space-y-1">
          <div><span className="font-semibold text-destructive">Before：</span>{c.before}</div>
          <div><span className="font-semibold text-green-600">After：</span>{c.after}</div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {c.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              施工事例
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              福岡市を中心に対応した塗装・リフォームの施工事例をカテゴリ別にご紹介します。
              お客様のご要望に合わせた最適なご提案をいたします。
            </p>
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={cat === "すべて" ? "default" : "outline"}
                className="text-sm px-4 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Cases Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {cases.map((c) => (
              <CaseCard key={c.id} c={c} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center bg-card border rounded-xl p-10">
            <h2 className="text-2xl font-bold mb-3 text-foreground">
              お客様のご自宅・施設はいかがですか？
            </h2>
            <p className="text-muted-foreground mb-6">
              まずは無料の現地調査にお申し込みください。専門スタッフが最適なプランをご提案します。
            </p>
            <Link href="/reserve">
              <Button size="lg" className="text-base px-8">
                <Calendar className="w-5 h-5 mr-2" />
                現地調査を予約する
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
