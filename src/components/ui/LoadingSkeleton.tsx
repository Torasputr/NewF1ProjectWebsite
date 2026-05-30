export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 rounded-lg bg-zinc-800" />
      <div className="h-10 rounded-lg bg-zinc-800 w-2/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-48 rounded-lg bg-zinc-800" />
        <div className="h-48 rounded-lg bg-zinc-800" />
      </div>
    </div>
  );
}
