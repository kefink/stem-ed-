"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import RichTextEditor dynamically to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="border border-gray-300 rounded-lg p-4 min-h-[400px] flex items-center justify-center">Loading editor...</div>
});

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export default function EditBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [published, setPublished] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role as string | undefined;
    if (status === "unauthenticated" || role !== "admin") {
      router.replace(`/login?next=/admin/blog/${postId}/edit`);
      return;
    }

    loadPost();
  }, [status, session, router, postId]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/v1/admin/blog/posts/${postId}`);
      if (response.ok) {
        const post: BlogPost = await response.json();
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setCategory(post.category || "");
        setFeaturedImage(post.featured_image || "");
        setPublished(post.published);
        setSeoTitle(post.seo_title || "");
        setSeoDescription(post.seo_description || "");
      } else {
        setMessage({ type: 'error', text: 'Failed to load blog post' });
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      setMessage({ type: 'error', text: 'Failed to load blog post' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      setMessage({ type: 'error', text: 'Title and content are required' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/v1/admin/blog/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          category: category || null,
          featured_image: featuredImage || null,
          published,
          seo_title: seoTitle || null,
          seo_description: seoDescription || null,
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Blog post updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update post');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update blog post' });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/blog" className="text-orange hover:text-orange-dark font-montserrat text-sm mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog List
          </Link>
          <h1 className="text-4xl font-bebas text-navy mb-2">Edit Blog Post</h1>
          <p className="text-gray-600 font-lato">
            Update your blog post content and settings
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            <p className="font-montserrat">{message.text}</p>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bebas text-navy mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato font-mono text-sm"
                  placeholder="post-url-slug"
                />
                <p className="text-xs text-gray-500 mt-1 font-lato">
                  This will be the URL: /blog/{slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                  Excerpt (Short Description)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                  placeholder="Brief summary of the post (optional)..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                  >
                    <option value="">Select a category...</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Robotics">Robotics</option>
                    <option value="AI">AI</option>
                    <option value="News">News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bebas text-navy mb-4">Content *</h2>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your blog post..."
            />
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bebas text-navy mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                  placeholder="Custom title for search engines (optional)"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1 font-lato">
                  {seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                  SEO Description
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                  placeholder="Description for search engine results (optional)"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1 font-lato">
                  {seoDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bebas text-navy mb-4">Publish Settings</h2>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 text-orange focus:ring-orange border-gray-300 rounded"
              />
              <span className="ml-3 font-montserrat text-navy">
                {published ? 'Post is published' : 'Publish this post'}
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-2 ml-8 font-lato">
              {published ? 'Uncheck to unpublish and save as draft' : 'Check to make this post visible to the public'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/blog"
              className="px-6 py-3 border border-gray-300 rounded-lg font-montserrat font-semibold text-navy hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-orange hover:bg-orange-dark text-white rounded-lg font-montserrat font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
