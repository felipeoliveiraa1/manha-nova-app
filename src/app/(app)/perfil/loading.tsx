export default function Loading() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 animate-pulse rounded-full bg-muted/40" />
        <div className="flex-1">
          <div className="h-5 w-40 animate-pulse rounded bg-muted/40" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-muted/30" />
        </div>
      </div>
      <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
      <div className="h-40 animate-pulse rounded-xl bg-muted/40" />
      <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
    </div>
  );
}
