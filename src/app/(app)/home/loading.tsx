export default function Loading() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
      <div className="h-14 rounded-md bg-muted/40" />
      <div className="h-44 animate-pulse rounded-xl bg-muted/40" />
      <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
      <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
      <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
      <div className="h-28 animate-pulse rounded-xl bg-muted/40" />
      <div className="h-24 animate-pulse rounded-xl bg-muted/40" />
    </div>
  );
}
