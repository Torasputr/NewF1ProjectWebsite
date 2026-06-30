import { Link, useLocation } from "react-router-dom";
import { useSeason } from "../../context/SeasonContext";

type HeaderProps = {
  lastUpdated?: string;
};

const navLinkClass = (active: boolean) =>
  active
    ? "text-white font-medium"
    : "text-zinc-400 hover:text-zinc-200 transition-colors";

export function Header({ lastUpdated }: HeaderProps) {
  const { pathname } = useLocation();
  const { year, setYear, availableSeasons } = useSeason();

  return (
    <header className="border-b border-zinc-800 bg-[#15151e]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <h1 className="text-xl font-semibold tracking-tight">F1 Pulse</h1>
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
            <Link to="/teams" className={navLinkClass(pathname === "/teams")}>
              Teams
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <label className="flex items-center gap-2">
            <span className="sr-only">Season</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 px-3 py-1.5 text-sm font-medium cursor-pointer hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#e10600]/40"
            >
              {availableSeasons.map((season) => (
                <option key={season} value={season}>
                  {season} season
                </option>
              ))}
            </select>
          </label>
          {lastUpdated && (
            <span className="text-zinc-500">
              Updated {new Date(lastUpdated).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
