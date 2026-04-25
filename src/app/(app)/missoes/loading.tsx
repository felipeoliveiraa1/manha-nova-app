export default function Loading() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
      <div className="h-8 w-40 animate-pulse rounded-md bg-muted/40" />
      <div className="flex gap-2">
        <div className="h-9 w-24 animate-pulse rounded-full bg-muted/40" />
        <div className="h-9 w-24 animate-pulse rounded-full bg-muted/40" />
        <div className="h-9 w-24 animate-pulse rounded-full bg-muted/40" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/40" />
      ))}
    </div>
  );
}
