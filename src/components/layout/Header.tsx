import { Link, useLocation } from "react-router-dom";

type HeaderProps = {
  year: number;
  lastUpdated?: string;
};

const navLinkClass = (active: boolean) =>
  active
    ? "text-white font-medium"
    : "text-zinc-400 hover:text-zinc-200 transition-colors";

export function Header({ year, lastUpdated }: HeaderProps) {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-zinc-800 bg-[#15151e]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <h1 className="text-xl font-semibold tracking-tight">F1 Data Hub</h1>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className={navLinkClass(pathname === "/")}>
              Schedule
            </Link>
            <Link
              to="/drivers"
              className={navLinkClass(pathname === "/drivers")}
            >
              Drivers
            </Link>
          </nav>
        </div>
        <div className="text-sm text-zinc-400">
          Season {year}
          {lastUpdated && (
            <span className="ml-3">
              Updated {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
