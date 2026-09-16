import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4 sm:gap-6">
            <img src="/qr-menu/godz-logo.png" alt="GODZ Cafe" className="h-8 w-auto sm:h-9" />
            <nav className="flex gap-3 text-sm sm:gap-4">
              <Link
                href="/admin/urunler"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Ürünler
              </Link>
              <Link
                href="/admin/kategoriler"
                className="text-neutral-600 hover:text-neutral-900"
              >
                Kategoriler
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/qr-menu"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Menü ↗
            </a>
            <span className="hidden text-sm text-neutral-500 md:inline">
              {session?.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
