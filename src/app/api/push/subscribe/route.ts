import { NextResponse } from "next/server";
import { createClientOrNull } from "@/lib/supabase/server";

type SubBody = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function POST(req: Request) {
  const supabase = await createClientOrNull();
  if (!supabase) {
    return NextResponse.json({ error: "supabase nao configurado" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "nao autenticado" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as SubBody | null;
  if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: "payload invalido" }, { status: 400 });
  }

  const ua = req.headers.get("user-agent") ?? null;

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        user_id: user.id,
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
        ua,
      },
      { onConflict: "endpoint" },
    );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
