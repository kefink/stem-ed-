"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  author_name: string | null;
  created_at: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    "All",
    "Education",
    "Robotics",
    "Technology",
    "AI",
    "News",
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, page]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: "9",
      });
      
      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(`/api/v1/public/blog/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (page === 1) {
          setPosts(data);
        } else {
          setPosts(prev => [...prev, ...data]);
        }
        setHasMore(data.length === 9);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setPosts([]);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (excerpt: string | null) => {
    // Rough estimate: 200 words per minute, ~50 words per excerpt
    return "5 min read";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange via-orange-dark to-orange text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bebas mb-6">Blog</h1>
          <p className="text-xl md:text-2xl font-lato max-w-4xl mx-auto text-white/90">
            Insights, stories, and resources for STEM education excellence
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-full font-montserrat font-semibold transition-all duration-300 shadow-sm ${
                  selectedCategory === cat
                    ? "bg-orange text-white"
                    : "bg-white hover:bg-orange hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading && posts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 font-lato">
                No blog posts found. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden block"
                  >
                    {/* Image */}
                    {post.featured_image ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-navy to-navy-light text-white h-48 flex items-center justify-center">
                        <span className="text-8xl">
                          {post.category === "Robotics"
                            ? "🤖"
                            : post.category === "AI"
                            ? "🧠"
                            : post.category === "Education"
                            ? "📖"
                            : post.category === "Technology"
                            ? "💻"
                            : "📰"}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        {post.category && (
                          <span className="text-xs font-montserrat font-semibold bg-orange/10 text-orange px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                        )}
                        <span className="text-xs font-lato text-gray-500">
                          {estimateReadTime(post.excerpt)}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bebas text-navy mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="font-lato text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          {post.author_name && (
                            <p className="font-montserrat font-semibold text-sm text-navy">
                              {post.author_name}
                            </p>
                          )}
                          <p className="font-lato text-xs text-gray-500">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                        <span className="text-orange hover:text-orange-dark font-montserrat font-semibold text-sm">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load More Articles"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bebas mb-6">
            Never Miss an Update
          </h2>
          <p className="text-xl font-lato mb-8 text-white/90">
            Subscribe to our newsletter for the latest STEM education insights
          </p>
          <a
            href="/newsletter"
            className="btn-primary bg-orange hover:bg-orange-dark"
          >
            Subscribe Now
          </a>
        </div>
      </section>
    </div>
  );
}
