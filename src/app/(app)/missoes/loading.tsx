import { BibleLoader } from "@/components/ui/bible-loader";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <BibleLoader />
    </div>
  );
}
