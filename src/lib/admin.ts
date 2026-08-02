import { createClient } from "@/lib/supabase/server";

export function isDemoAuthAllowed() {
  return (
    Boolean(process.env.ADMIN_DEMO_PASSWORD) ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  );
}

export async function getAdminSession(): Promise<{
  email: string;
  role: string;
  demo: boolean;
} | null> {
  const supabase = createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", user.id)
        .single();
      return {
        email: profile?.email ?? user.email ?? "",
        role: profile?.role ?? "viewer",
        demo: false,
      };
    }
  }
  return null;
}
