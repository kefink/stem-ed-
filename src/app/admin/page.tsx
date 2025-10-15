"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";

type ContactMessage = {
  id: number;
  name?: string | null;
  email: string;
  organization?: string | null;
  phone?: string | null;
  service?: string | null;
  message?: string | null;
  created_at?: string | null;
};

type Subscriber = {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  organization?: string | null;
  role?: string | null;
  interests?: string[];
  created_at?: string | null;
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [msgTotal, setMsgTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [limit, setLimit] = useState(25);
  const [msgOffset, setMsgOffset] = useState(0);
  const [subOffset, setSubOffset] = useState(0);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role as string | undefined;
    if (status === "unauthenticated" || role !== "admin") {
      router.replace("/login?next=/admin");
      return;
    }
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        query.set("limit", String(limit));
        if (q) query.set("q", q);
        const [msgsRes, subsRes] = await Promise.all([
          apiFetch<{
            items: ContactMessage[];
            total: number;
            limit: number;
            offset: number;
          }>(
            `/api/v1/admin/contact-messages?${query.toString()}&offset=${msgOffset}`
          ),
          apiFetch<{
            items: Subscriber[];
            total: number;
            limit: number;
            offset: number;
          }>(
            `/api/v1/admin/newsletter-subscribers?${query.toString()}&offset=${subOffset}`
          ),
        ]);
        setMessages(msgsRes.items);
        setSubs(subsRes.items);
        setMsgTotal(msgsRes.total);
        setSubTotal(subsRes.total);
      } catch (e: any) {
        setError(e?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, limit, msgOffset, subOffset, q]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <p>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setMsgOffset(0);
            setSubOffset(0);
          }}
          placeholder="Search (name, email, org, role, service)"
          className="w-full sm:w-80 px-3 py-2 border rounded"
        />
        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setMsgOffset(0);
            setSubOffset(0);
          }}
          className="px-3 py-2 border rounded"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Recent Contact Messages</h2>
        <div className="overflow-x-auto rounded-lg border border-cyan-500/30">
          <table className="min-w-full text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Organization</th>
                <th className="text-left p-2">Service</th>
                <th className="text-left p-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="odd:bg-white even:bg-slate-50">
                  <td className="p-2 whitespace-nowrap">
                    {m.created_at?.slice(0, 19).replace("T", " ")}
                  </td>
                  <td className="p-2 whitespace-nowrap">{m.name || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{m.email}</td>
                  <td className="p-2 whitespace-nowrap">
                    {m.organization || "-"}
                  </td>
                  <td className="p-2 whitespace-nowrap">{m.service || "-"}</td>
                  <td
                    className="p-2 max-w-[400px] truncate"
                    title={m.message || undefined}
                  >
                    {m.message || "-"}
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td className="p-2" colSpan={6}>
                    No messages.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-2 text-sm text-gray-600">
            <span>
              Showing {messages.length} of {msgTotal} (offset {msgOffset})
            </span>
            <div className="space-x-2">
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setMsgOffset(Math.max(0, msgOffset - limit))}
                disabled={msgOffset === 0}
              >
                Prev
              </button>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setMsgOffset(msgOffset + limit)}
                disabled={msgOffset + limit >= msgTotal}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Newsletter Subscribers</h2>
        <div className="overflow-x-auto rounded-lg border border-cyan-500/30">
          <table className="min-w-full text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Organization</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Interests</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="odd:bg-white even:bg-slate-50">
                  <td className="p-2 whitespace-nowrap">
                    {s.created_at?.slice(0, 19).replace("T", " ")}
                  </td>
                  <td className="p-2 whitespace-nowrap">{s.email}</td>
                  <td className="p-2 whitespace-nowrap">
                    {[s.first_name, s.last_name].filter(Boolean).join(" ") ||
                      "-"}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {s.organization || "-"}
                  </td>
                  <td className="p-2 whitespace-nowrap">{s.role || "-"}</td>
                  <td className="p-2 whitespace-nowrap">
                    {(s.interests || []).join(", ") || "-"}
                  </td>
                </tr>
              ))}
              {subs.length === 0 && (
                <tr>
                  <td className="p-2" colSpan={6}>
                    No subscribers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-2 text-sm text-gray-600">
            <span>
              Showing {subs.length} of {subTotal} (offset {subOffset})
            </span>
            <div className="space-x-2">
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setSubOffset(Math.max(0, subOffset - limit))}
                disabled={subOffset === 0}
              >
                Prev
              </button>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setSubOffset(subOffset + limit)}
                disabled={subOffset + limit >= subTotal}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
