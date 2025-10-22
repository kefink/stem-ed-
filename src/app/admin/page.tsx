"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [limit, setLimit] = useState(10);
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bebas text-navy mb-4">
            Admin Dashboard
          </h1>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bebas text-navy mb-4">
            Admin Dashboard
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 font-montserrat">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bebas text-navy mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 font-lato">
            Welcome back, {session?.user?.name || "Admin"}! Manage your website
            content here.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-montserrat">
                  Contact Messages
                </p>
                <p className="text-3xl font-bebas text-navy">{msgTotal}</p>
              </div>
              <div className="text-4xl">📧</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-navy">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-montserrat">
                  Subscribers
                </p>
                <p className="text-3xl font-bebas text-navy">{subTotal}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-montserrat">
                  Blog Posts
                </p>
                <p className="text-3xl font-bebas text-navy">6</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-montserrat">
                  Products
                </p>
                <p className="text-3xl font-bebas text-navy">3</p>
              </div>
              <div className="text-4xl">🛍️</div>
            </div>
          </div>
        </div>

        {/* Content Management Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bebas text-navy mb-4">
            Content Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blog Management */}
            <Link href="/admin/blog" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-orange">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                  Manage Blog Posts
                </h3>
                <p className="text-gray-600 font-lato text-sm mb-4">
                  Create, edit, and delete blog articles
                </p>
                <span className="text-orange font-montserrat text-sm font-semibold inline-flex items-center">
                  Manage Posts
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Homepage Content */}
            <Link href="/admin/homepage" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-navy">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                  Homepage Content
                </h3>
                <p className="text-gray-600 font-lato text-sm mb-4">
                  Edit statistics, testimonials, and featured content
                </p>
                <span className="text-orange font-montserrat text-sm font-semibold inline-flex items-center">
                  Edit Content
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Media Library */}
            <Link href="/admin/media" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-cyan-500">
                <div className="text-5xl mb-4">🖼️</div>
                <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                  Media Library
                </h3>
                <p className="text-gray-600 font-lato text-sm mb-4">
                  Upload and manage images, logos, and files
                </p>
                <span className="text-orange font-montserrat text-sm font-semibold inline-flex items-center">
                  Manage Media
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Products Management */}
            <Link href="/admin/products" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-green-500">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                  Products & Services
                </h3>
                <p className="text-gray-600 font-lato text-sm mb-4">
                  Manage product listings and descriptions
                </p>
                <span className="text-orange font-montserrat text-sm font-semibold inline-flex items-center">
                  Manage Products
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Settings */}
            <Link href="/admin/settings" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-purple-500">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                  Site Settings
                </h3>
                <p className="text-gray-600 font-lato text-sm mb-4">
                  Update contact info, social media, and site settings
                </p>
                <span className="text-orange font-montserrat text-sm font-semibold inline-flex items-center">
                  View Settings
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Users Management */}
            <Link href="/admin/users" className="group">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border-2 border-transparent hover:border-red-500">
                <div className="text-5xl mb-4">👤</div>
                <h3 className="text-xl font-bebas text-navy mb-2 group-hover:text-orange transition-colors">
                  User Management
                </h3>
                <p className="text-gray-600 font-lato text-sm mb-4">
                  Manage users, roles, and permissions
                </p>
                <span className="text-orange font-montserrat text-sm font-semibold inline-flex items-center">
                  Manage Users
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setMsgOffset(0);
              setSubOffset(0);
            }}
            placeholder="Search messages and subscribers..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
          />
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setMsgOffset(0);
              setSubOffset(0);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>

        {/* Recent Contact Messages */}
        <section className="mb-10">
          <h2 className="text-2xl font-bebas text-navy mb-4">
            Recent Contact Messages
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Date
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Name
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Email
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Organization
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Service
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="font-lato">
                  {messages.map((m, idx) => (
                    <tr
                      key={m.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-4 whitespace-nowrap text-sm">
                        {m.created_at?.slice(0, 10)}
                      </td>
                      <td className="p-4 whitespace-nowrap">{m.name || "-"}</td>
                      <td className="p-4 whitespace-nowrap">
                        <a
                          href={`mailto:${m.email}`}
                          className="text-orange hover:underline"
                        >
                          {m.email}
                        </a>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {m.organization || "-"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-orange/10 text-orange rounded-full text-xs">
                          {m.service || "-"}
                        </span>
                      </td>
                      <td
                        className="p-4 max-w-md truncate"
                        title={m.message || undefined}
                      >
                        {m.message || "-"}
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-gray-500" colSpan={6}>
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
              <span className="text-sm text-gray-600 font-lato">
                Showing {messages.length} of {msgTotal} messages
              </span>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat text-sm"
                  onClick={() => setMsgOffset(Math.max(0, msgOffset - limit))}
                  disabled={msgOffset === 0}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat text-sm"
                  onClick={() => setMsgOffset(msgOffset + limit)}
                  disabled={msgOffset + limit >= msgTotal}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscribers */}
        <section>
          <h2 className="text-2xl font-bebas text-navy mb-4">
            Newsletter Subscribers
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Date
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Email
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Name
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Organization
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Role
                    </th>
                    <th className="text-left p-4 font-montserrat font-semibold">
                      Interests
                    </th>
                  </tr>
                </thead>
                <tbody className="font-lato">
                  {subs.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-4 whitespace-nowrap text-sm">
                        {s.created_at?.slice(0, 10)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <a
                          href={`mailto:${s.email}`}
                          className="text-orange hover:underline"
                        >
                          {s.email}
                        </a>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {[s.first_name, s.last_name]
                          .filter(Boolean)
                          .join(" ") || "-"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {s.organization || "-"}
                      </td>
                      <td className="p-4 whitespace-nowrap">{s.role || "-"}</td>
                      <td className="p-4">
                        {(s.interests || []).length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {s.interests?.map((interest, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                  {subs.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-gray-500" colSpan={6}>
                        No subscribers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
              <span className="text-sm text-gray-600 font-lato">
                Showing {subs.length} of {subTotal} subscribers
              </span>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat text-sm"
                  onClick={() => setSubOffset(Math.max(0, subOffset - limit))}
                  disabled={subOffset === 0}
                >
                  Previous
                </button>
                <button
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat text-sm"
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
    </div>
  );
}
