import { NextResponse } from "next/server";
import { createClientOrNull } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClientOrNull();
  if (!supabase) {
    return NextResponse.json({ error: "supabase nao configurado" }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "nao autenticado" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { endpoint?: string };
  if (!body.endpoint) {
    return NextResponse.json({ error: "endpoint obrigatorio" }, { status: 400 });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", body.endpoint);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
