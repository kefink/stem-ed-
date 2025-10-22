"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  author_name: string | null;
  author_email: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/v1/public/blog/posts/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
        
        // Update page title dynamically
        document.title = data.seo_title || data.title || "Blog Post";
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            data.seo_description || data.excerpt || "Read more on STEM-ED-ARCHITECTS blog"
          );
        }
      } else if (response.status === 404) {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to load post:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bebas text-navy mb-4">Post Not Found</h1>
          <p className="text-xl text-gray-600 font-lato mb-8">
            Sorry, the blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="btn-primary"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Featured Image */}
      <section className="relative">
        {post.featured_image ? (
          <div className="relative h-[400px] md:h-[500px] w-full">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-24 text-white">
              <div className="max-w-4xl mx-auto">
                {post.category && (
                  <span className="inline-block px-4 py-2 bg-orange rounded-full font-montserrat font-semibold text-sm mb-4">
                    {post.category}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl font-bebas mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  {post.author_name && (
                    <span className="font-montserrat font-semibold">
                      {post.author_name}
                    </span>
                  )}
                  <span className="font-lato">{formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-orange via-orange-dark to-orange text-white py-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
              {post.category && (
                <span className="inline-block px-4 py-2 bg-white/20 rounded-full font-montserrat font-semibold text-sm mb-4">
                  {post.category}
                </span>
              )}
              <h1 className="text-5xl md:text-7xl font-bebas mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-white/90">
                {post.author_name && (
                  <span className="font-montserrat font-semibold text-lg">
                    {post.author_name}
                  </span>
                )}
                <span className="font-lato text-lg">
                  {formatDate(post.created_at)}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Breadcrumb */}
      <section className="py-6 px-6 md:px-12 lg:px-24 border-b">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-lato">
            <Link href="/" className="text-gray-600 hover:text-orange">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-gray-600 hover:text-orange">
              Blog
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-navy font-semibold truncate">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Post Content */}
      <article className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-gray-700 font-lato leading-relaxed mb-8 pb-8 border-b border-gray-200 italic">
              {post.excerpt}
            </div>
          )}

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bebas prose-headings:text-navy
              prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl
              prose-p:font-lato prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-orange prose-a:no-underline hover:prose-a:underline
              prose-strong:text-navy prose-strong:font-semibold
              prose-ul:font-lato prose-ol:font-lato
              prose-blockquote:border-l-4 prose-blockquote:border-orange prose-blockquote:italic
              prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Info */}
          {post.author_name && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-white text-2xl font-bebas">
                  {post.author_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bebas text-2xl text-navy mb-1">
                    {post.author_name}
                  </h3>
                  {post.author_email && (
                    <p className="text-gray-600 font-lato text-sm">
                      {post.author_email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Share & Navigate */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
            <Link
              href="/blog"
              className="text-orange hover:text-orange-dark font-montserrat font-semibold flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.excerpt || "",
                      url: window.location.href,
                    });
                  }
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-montserrat text-sm transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts CTA */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bebas text-navy mb-4">
            More Articles
          </h2>
          <p className="text-xl font-lato text-gray-600 mb-8">
            Explore more insights and stories from our blog
          </p>
          <Link href="/blog" className="btn-primary">
            View All Posts
          </Link>
        </div>
      </section>
    </div>
  );
}
