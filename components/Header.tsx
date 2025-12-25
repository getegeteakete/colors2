import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="COLORS"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-xl font-bold text-foreground">COLORS調査予約</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/flow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            利用方法
          </Link>
          <Link href="/reserve" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            予約する
          </Link>
          <Link href="/mypage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            マイページ
          </Link>
        </nav>
      </div>
    </header>
  );
}
