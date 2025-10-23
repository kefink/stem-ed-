"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Link from "next/link";

type DashboardStats = {
  users: {
    total: number;
    last_30_days: number;
    last_7_days: number;
    admin_count: number;
    verified_count: number;
    verification_rate: number;
  };
  blog: {
    total: number;
    published: number;
    drafts: number;
    last_30_days: number;
    recent_posts: Array<{
      id: number;
      title: string;
      published: boolean;
      created_at: string;
    }>;
    categories: Array<{
      category: string;
      count: number;
    }>;
  };
  messages: {
    total: number;
    last_30_days: number;
    last_7_days: number;
    recent: Array<{
      id: number;
      name: string;
      email: string;
      service: string;
      created_at: string;
    }>;
    by_service: Array<{
      service: string;
      count: number;
    }>;
  };
  newsletter: {
    total: number;
    last_30_days: number;
    last_7_days: number;
  };
  media: {
    total_files: number;
    total_size_mb: number;
    images: number;
    documents: number;
  };
  growth_trends: {
    users_weekly: number;
    users_monthly: number;
    messages_weekly: number;
    messages_monthly: number;
    subscribers_weekly: number;
    subscribers_monthly: number;
  };
};

export default function AnalyticsDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role;
    if (status === "unauthenticated" || role !== "admin") {
      router.replace("/login?next=/admin/dashboard");
      return;
    }

    if (!(session as any)?.accessToken) {
      return;
    }

    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // Removed 'session' and 'router' from dependencies to prevent infinite loop

  const loadStats = async () => {
    setLoading(true);
    try {
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) {
        setStats(null);
        setLoading(false);
        return;
      }

      const response = await fetchWithAuth(
        "http://localhost:8000/api/v1/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error("Failed to load dashboard stats:", response.status);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-gray-600">
          Failed to load dashboard stats
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bebas text-navy mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 font-lato">
            Overview of your platform's performance and activity
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-semibold text-navy">
                Total Users
              </h3>
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-4xl font-bebas text-orange mb-2">
              {stats.users.total}
            </p>
            <p className="text-sm text-gray-600 font-lato">
              +{stats.users.last_7_days} this week
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {stats.users.verification_rate}% verified
              </p>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-semibold text-navy">
                Blog Posts
              </h3>
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-4xl font-bebas text-orange mb-2">
              {stats.blog.published}
            </p>
            <p className="text-sm text-gray-600 font-lato">
              {stats.blog.drafts} drafts
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                +{stats.blog.last_30_days} this month
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-semibold text-navy">
                Messages
              </h3>
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-4xl font-bebas text-orange mb-2">
              {stats.messages.total}
            </p>
            <p className="text-sm text-gray-600 font-lato">
              +{stats.messages.last_7_days} this week
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                +{stats.messages.last_30_days} this month
              </p>
            </div>
          </div>

          {/* Subscribers */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-semibold text-navy">
                Subscribers
              </h3>
              <span className="text-3xl">📧</span>
            </div>
            <p className="text-4xl font-bebas text-orange mb-2">
              {stats.newsletter.total}
            </p>
            <p className="text-sm text-gray-600 font-lato">
              +{stats.newsletter.last_7_days} this week
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                +{stats.newsletter.last_30_days} this month
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Blog Posts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bebas text-navy mb-4">
              Recent Blog Posts
            </h3>
            <div className="space-y-3">
              {stats.blog.recent_posts.map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="font-montserrat font-semibold text-navy hover:text-orange"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 font-lato">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-montserrat ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/blog"
              className="mt-4 inline-block text-orange hover:text-orange-dark font-montserrat text-sm font-semibold"
            >
              View all posts →
            </Link>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bebas text-navy mb-4">
              Recent Messages
            </h3>
            <div className="space-y-3">
              {stats.messages.recent.map((msg) => (
                <div
                  key={msg.id}
                  className="border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-montserrat font-semibold text-navy">
                        {msg.name}
                      </p>
                      <p className="text-sm text-gray-600 font-lato">
                        {msg.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">
                          {msg.service}
                        </span>
                        <p className="text-xs text-gray-500 font-lato">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin"
              className="mt-4 inline-block text-orange hover:text-orange-dark font-montserrat text-sm font-semibold"
            >
              View all messages →
            </Link>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Blog Categories */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bebas text-navy mb-4">
              Blog by Category
            </h3>
            {stats.blog.categories.length > 0 ? (
              <div className="space-y-3">
                {stats.blog.categories.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between"
                  >
                    <span className="font-montserrat text-navy">
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-orange h-2 rounded-full"
                          style={{
                            width: `${
                              (cat.count / stats.blog.published) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-bebas text-orange text-lg">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No categories yet
              </p>
            )}
          </div>

          {/* Services Requested */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bebas text-navy mb-4">
              Services Requested
            </h3>
            {stats.messages.by_service.length > 0 ? (
              <div className="space-y-3">
                {stats.messages.by_service.map((srv) => (
                  <div
                    key={srv.service}
                    className="flex items-center justify-between"
                  >
                    <span className="font-montserrat text-navy">
                      {srv.service}
                    </span>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (srv.count / stats.messages.total) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-bebas text-cyan-600 text-lg">
                        {srv.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No service requests yet
              </p>
            )}
          </div>
        </div>

        {/* Media Library Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bebas text-navy mb-4">Media Library</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bebas text-orange">
                {stats.media.total_files}
              </p>
              <p className="text-sm text-gray-600 font-montserrat">
                Total Files
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bebas text-orange">
                {stats.media.total_size_mb}
              </p>
              <p className="text-sm text-gray-600 font-montserrat">MB Used</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bebas text-orange">
                {stats.media.images}
              </p>
              <p className="text-sm text-gray-600 font-montserrat">Images</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bebas text-orange">
                {stats.media.documents}
              </p>
              <p className="text-sm text-gray-600 font-montserrat">Documents</p>
            </div>
          </div>
        </div>

        {/* Growth Trends */}
        <div className="bg-gradient-to-r from-orange to-orange-dark rounded-xl shadow-md p-6 text-white">
          <h3 className="text-2xl font-bebas mb-6">Growth Trends</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Users (Weekly)</p>
              <p className="text-3xl font-bebas">
                +{stats.growth_trends.users_weekly}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Users (Monthly)</p>
              <p className="text-3xl font-bebas">
                +{stats.growth_trends.users_monthly}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Messages (Weekly)</p>
              <p className="text-3xl font-bebas">
                +{stats.growth_trends.messages_weekly}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Messages (Monthly)</p>
              <p className="text-3xl font-bebas">
                +{stats.growth_trends.messages_monthly}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Subscribers (Weekly)</p>
              <p className="text-3xl font-bebas">
                +{stats.growth_trends.subscribers_weekly}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Subscribers (Monthly)</p>
              <p className="text-3xl font-bebas">
                +{stats.growth_trends.subscribers_monthly}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
