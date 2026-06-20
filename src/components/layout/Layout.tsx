import { Header } from "./Header";

type LayoutProps = {
  lastUpdated?: string;
  children: React.ReactNode;
};

export function Layout({ lastUpdated, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-zinc-100">
      <Header lastUpdated={lastUpdated} />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
