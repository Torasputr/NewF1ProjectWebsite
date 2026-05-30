import { Header } from "./Header";

type LayoutProps = {
  year: number;
  lastUpdated?: string;
  children: React.ReactNode;
};

export function Layout({ year, lastUpdated, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-zinc-100">
      <Header year={year} lastUpdated={lastUpdated} />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
