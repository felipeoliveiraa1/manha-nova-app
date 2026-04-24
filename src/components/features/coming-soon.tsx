import { Card, CardContent } from "@/components/ui/card";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-4 pt-8">
      <h1 className="mb-4 font-serif text-2xl font-semibold">{title}</h1>
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          {description}
        </CardContent>
      </Card>
    </div>
  );
}
