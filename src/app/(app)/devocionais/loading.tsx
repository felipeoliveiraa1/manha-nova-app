export default function Loading() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted/40" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
