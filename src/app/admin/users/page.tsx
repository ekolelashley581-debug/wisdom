"use client";

import { useCallback, useEffect, useState } from "react";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "editor" | "viewer";
  created_at: string;
};

export default function AdminUsersPage() {
  const [items, setItems] = useState<Profile[]>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [method, setMethod] = useState<"invite" | "password">("password");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load users");
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          full_name: fullName,
          role,
          method,
          password: method === "password" ? password : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add user");
      setInfo(
        method === "invite"
          ? `Invite sent to ${email}`
          : `User ${email} created — they can sign in now`
      );
      setEmail("");
      setFullName("");
      setPassword("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add user");
    } finally {
      setSaving(false);
    }
  }

  async function changeRole(id: string, nextRole: Profile["role"]) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: nextRole }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Update failed");
      return;
    }
    await load();
  }

  async function removeUser(id: string, userEmail: string | null) {
    if (!confirm(`Remove ${userEmail || id}?`)) return;
    const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Delete failed");
      return;
    }
    await load();
  }

  return (
    <div className="text-silver-light">
      <h1 className="font-display text-3xl text-white">Users</h1>
      <p className="mt-1 text-sm text-silver">
        Register staff in Supabase — only these accounts can sign in to admin
      </p>

      <form
        onSubmit={addUser}
        className="mt-8 max-w-xl space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <h2 className="font-display text-xl text-white">Add user</h2>
        <div className="flex gap-2">
          {(
            [
              ["invite", "Email invite"],
              ["password", "Create with password"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                method === id
                  ? "border-secondary-glow text-secondary-glow"
                  : "border-white/15 text-silver-mute"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="Full name (optional)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          required
          className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {method === "password" && (
          <input
            type="password"
            required
            minLength={8}
            className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
            placeholder="Temporary password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <select
          className="w-full rounded-xl border border-white/15 bg-primary px-3 py-2 text-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as Profile["role"])}
        >
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-secondary-glow">{info}</p>}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Adding…" : method === "invite" ? "Send invite" : "Create user"}
        </button>
      </form>

      <div className="mt-10 space-y-3">
        <h2 className="font-display text-xl text-white">Team</h2>
        {loading && <p className="text-sm text-silver-mute">Loading…</p>}
        {!loading && !items.length && (
          <p className="text-sm text-silver-mute">No profiles found.</p>
        )}
        {items.map((u) => (
          <div
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3"
          >
            <div>
              <p className="font-medium text-white">
                {u.full_name || u.email || "User"}
              </p>
              <p className="text-xs text-silver-mute">{u.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="rounded-lg border border-white/15 bg-primary px-2 py-1 text-xs"
                value={u.role}
                onChange={(e) =>
                  void changeRole(u.id, e.target.value as Profile["role"])
                }
              >
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>
              <button
                type="button"
                className="text-xs text-red-400 hover:underline"
                onClick={() => void removeUser(u.id, u.email)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-silver-mute">
        <p className="font-medium text-silver">Notes</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>There is no public sign-up — create accounts here or in Supabase Auth.</li>
          <li>
            Vercel needs{" "}
            <code className="text-secondary-glow">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            for adding users and uploading media.
          </li>
          <li>
            In Supabase → Authentication → Providers → Email, turn off “Enable sign
            ups” so only registered users can sign in.
          </li>
        </ul>
      </div>
    </div>
  );
}
