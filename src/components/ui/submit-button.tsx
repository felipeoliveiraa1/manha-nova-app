"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({
  children,
  pendingLabel,
  ...rest
}: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button {...rest} type="submit" disabled={pending || rest.disabled}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel ?? "Carregando..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
