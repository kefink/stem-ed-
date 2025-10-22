"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author: {
    full_name: string | null;
    email: string;
  };
};

export default function BlogManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role as string | undefined;
    if (status === "unauthenticated" || role !== "admin") {
      router.replace("/login?next=/admin/blog");
      return;
    }

    loadPosts();
  }, [status, session, router, page, search, categoryFilter, publishedFilter]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });

      if (search) params.append("search", search);
      if (categoryFilter) params.append("category", categoryFilter);
      if (publishedFilter !== undefined)
        params.append("published", publishedFilter.toString());

      const response = await fetch(`/api/v1/admin/blog/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setDeleting(postId);
    try {
      const response = await fetch(`/api/v1/admin/blog/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadPosts(); // Reload the list
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-orange hover:text-orange-dark font-montserrat text-sm mb-4 inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bebas text-navy mb-2">
                Blog Management
              </h1>
              <p className="text-gray-600 font-lato">
                Create, edit, and manage your blog posts
              </p>
            </div>
            <Link
              href="/admin/blog/new"
              className="px-6 py-3 bg-orange hover:bg-orange-dark text-white rounded-lg font-montserrat font-semibold transition-all duration-300"
            >
              + Create New Post
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search posts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
              >
                <option value="">All Categories</option>
                <option value="Education">Education</option>
                <option value="Technology">Technology</option>
                <option value="Robotics">Robotics</option>
                <option value="AI">AI</option>
                <option value="News">News</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Status
              </label>
              <select
                value={
                  publishedFilter === undefined
                    ? "all"
                    : publishedFilter
                    ? "published"
                    : "draft"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setPublishedFilter(
                    value === "all" ? undefined : value === "published"
                  );
                  setPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-semibold text-navy">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-semibold text-navy">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-semibold text-navy">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-semibold text-navy">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-montserrat font-semibold text-navy">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-montserrat font-semibold text-navy">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 font-lato"
                    >
                      No blog posts found. Create your first post to get
                      started!
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-montserrat font-semibold text-navy">
                            {post.title}
                          </p>
                          {post.excerpt && (
                            <p className="text-sm text-gray-600 font-lato line-clamp-1 mt-1">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {post.category ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-lato">
                            {post.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-lato text-gray-700">
                        {post.author.full_name || post.author.email}
                      </td>
                      <td className="px-6 py-4">
                        {post.published ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-lato">
                            Published
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-lato">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-lato text-gray-600">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-montserrat transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting === post.id}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-montserrat transition-colors disabled:opacity-50"
                          >
                            {deleting === post.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-600 font-lato">
                Showing {(page - 1) * pageSize + 1} -{" "}
                {Math.min(page * pageSize, total)} of {total} posts
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-montserrat text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-montserrat text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
