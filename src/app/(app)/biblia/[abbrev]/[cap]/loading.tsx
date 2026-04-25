export default function Loading() {
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-8">
      <div className="h-6 w-24 animate-pulse rounded bg-muted/40" />
      <div className="h-9 w-56 animate-pulse rounded bg-muted/40" />
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-md bg-muted/30" />
        ))}
      </div>
    </div>
  );
}
