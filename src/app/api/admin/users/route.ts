import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function requireAdmin() {
  const supabase = createClient();
  if (!supabase) return { error: "Supabase not configured", status: 503 as const };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Admin role required", status: 403 as const };
  }

  return { user, profile };
}

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Set SUPABASE_SERVICE_ROLE_KEY to manage users" },
      { status: 503 }
    );
  }

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: profiles || [] });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Set SUPABASE_SERVICE_ROLE_KEY to add users" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const fullName = String(body.full_name || "").trim();
    const role = (["admin", "editor", "viewer"].includes(body.role)
      ? body.role
      : "editor") as "admin" | "editor" | "viewer";
    const password = String(body.password || "");
    const method = body.method === "password" ? "password" : "invite";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://wisdom-ruddy.vercel.app";

    if (method === "password") {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName || undefined },
      });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (data.user) {
        await admin.from("profiles").upsert({
          id: data.user.id,
          email,
          full_name: fullName || null,
          role,
        });
      }
      return NextResponse.json(
        { item: data.user, mode: "password" },
        { status: 201 }
      );
    }

    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/admin`,
      data: { full_name: fullName || undefined },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (data.user) {
      await admin.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName || null,
        role,
      });
    }
    return NextResponse.json({ item: data.user, mode: "invite" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not add user" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Set SUPABASE_SERVICE_ROLE_KEY to manage users" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const id = String(body.id || "");
    const role = body.role as string;
    if (!id || !["admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "id and valid role required" }, { status: 400 });
    }

    const { data, error } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select("id, email, full_name, role, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ item: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const admin = createServiceClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Set SUPABASE_SERVICE_ROLE_KEY to manage users" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  if ("user" in gate && gate.user?.id === id) {
    return NextResponse.json({ error: "You cannot delete yourself" }, { status: 400 });
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
