export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Future of STEM Education in Africa",
      excerpt:
        "Exploring how AI and robotics are transforming education across the continent...",
      author: "Dr. James Mwangi",
      date: "October 10, 2025",
      category: "Education",
      readTime: "5 min read",
      image: "📖",
    },
    {
      id: 2,
      title: "Building a Successful Robotics Program",
      excerpt:
        "A step-by-step guide for schools starting their first robotics program...",
      author: "Sarah Kimani",
      date: "October 8, 2025",
      category: "Robotics",
      readTime: "7 min read",
      image: "🤖",
    },
    {
      id: 3,
      title: "AI Integration in the Classroom",
      excerpt:
        "Practical strategies for incorporating AI tools into daily teaching...",
      author: "Prof. Alice Omondi",
      date: "October 5, 2025",
      category: "Technology",
      readTime: "6 min read",
      image: "🧠",
    },
    {
      id: 4,
      title: "Teacher Training Best Practices",
      excerpt:
        "What makes effective professional development in STEM education...",
      author: "Michael Njoroge",
      date: "October 1, 2025",
      category: "Training",
      readTime: "8 min read",
      image: "👨‍🏫",
    },
    {
      id: 5,
      title: "Student Success Stories from Kenya",
      excerpt:
        "How our programs are changing lives and creating opportunities...",
      author: "Grace Wanjiru",
      date: "September 28, 2025",
      category: "Impact",
      readTime: "4 min read",
      image: "🌟",
    },
    {
      id: 6,
      title: "Preparing for STEM Competitions",
      excerpt:
        "Tips and strategies for FLL, WRO, and other robotics competitions...",
      author: "David Kibet",
      date: "September 25, 2025",
      category: "Competitions",
      readTime: "6 min read",
      image: "🏆",
    },
  ];

  const categories = [
    "All",
    "Education",
    "Robotics",
    "Technology",
    "Training",
    "Impact",
    "Competitions",
  ];

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
                className="px-6 py-2 rounded-full font-montserrat font-semibold bg-white hover:bg-orange hover:text-white transition-all duration-300 shadow-sm"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="bg-gradient-to-br from-navy to-navy-light text-white h-48 flex items-center justify-center">
                  <span className="text-8xl">{post.image}</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-montserrat font-semibold bg-orange/10 text-orange px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs font-lato text-gray-500">
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bebas text-navy mb-3">
                    {post.title}
                  </h3>

                  <p className="font-lato text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="font-montserrat font-semibold text-sm text-navy">
                        {post.author}
                      </p>
                      <p className="font-lato text-xs text-gray-500">
                        {post.date}
                      </p>
                    </div>
                    <button className="text-orange hover:text-orange-dark font-montserrat font-semibold text-sm">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="btn-primary">Load More Articles</button>
          </div>
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
