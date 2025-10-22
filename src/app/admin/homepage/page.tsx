"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type Statistic = {
  id: number;
  label: string;
  value: string;
  icon: string;
  order_index: number;
  is_active: boolean;
};

type Testimonial = {
  id: number;
  name: string;
  role: string;
  organization: string;
  quote: string;
  rating: number;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
};

type FeaturedProduct = {
  id: number;
  title: string;
  description: string;
  icon: string;
  link_url: string;
  order_index: number;
  is_active: boolean;
};

type HeroSlide = {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  order_index: number;
  is_active: boolean;
};

type MissionVision = {
  id: number;
  section_type: "mission" | "vision" | "identity";
  title: string;
  content: string;
  icon: string | null;
};

export default function HomepageManagement() {
  const [activeTab, setActiveTab] = useState<
    "statistics" | "testimonials" | "products" | "hero" | "mission"
  >("statistics");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [missionVision, setMissionVision] = useState<MissionVision[]>([]);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const endpoints: Record<typeof activeTab, string> = {
        statistics: "/api/v1/admin/homepage/statistics",
        testimonials: "/api/v1/admin/homepage/testimonials",
        products: "/api/v1/admin/homepage/featured-products",
        hero: "/api/v1/admin/homepage/hero-slides",
        mission: "/api/v1/admin/homepage/mission-vision",
      };

      const response = await fetchWithAuth(`${endpoints[activeTab]}`);
      if (!response.ok) throw new Error("Failed to load data");

      const data = await response.json();

      switch (activeTab) {
        case "statistics":
          setStatistics(data);
          break;
        case "testimonials":
          setTestimonials(data);
          break;
        case "products":
          setProducts(data);
          break;
        case "hero":
          setHeroSlides(data);
          break;
        case "mission":
          setMissionVision(data);
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setSaving(true);
    try {
      const endpoints: Record<typeof activeTab, string> = {
        statistics: `/api/v1/admin/homepage/statistics/${id}`,
        testimonials: `/api/v1/admin/homepage/testimonials/${id}`,
        products: `/api/v1/admin/homepage/featured-products/${id}`,
        hero: `/api/v1/admin/homepage/hero-slides/${id}`,
        mission: "", // Mission/vision can't be deleted
      };

      if (!endpoints[activeTab]) return;

      const response = await fetchWithAuth(`${endpoints[activeTab]}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      await loadData();
      alert("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete item");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: number, currentState: boolean) => {
    setSaving(true);
    try {
      const endpoints: Record<typeof activeTab, string> = {
        statistics: `/api/v1/admin/homepage/statistics/${id}`,
        testimonials: `/api/v1/admin/homepage/testimonials/${id}`,
        products: `/api/v1/admin/homepage/featured-products/${id}`,
        hero: `/api/v1/admin/homepage/hero-slides/${id}`,
        mission: "",
      };

      if (!endpoints[activeTab]) return;

      const response = await fetchWithAuth(`${endpoints[activeTab]}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentState }),
      });

      if (!response.ok) throw new Error("Failed to update");

      await loadData();
    } catch (error) {
      console.error("Error toggling active state:", error);
      alert("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "statistics" as const, label: "Statistics", icon: "📊" },
    { id: "testimonials" as const, label: "Testimonials", icon: "💬" },
    { id: "products" as const, label: "Featured Products", icon: "🎯" },
    { id: "hero" as const, label: "Hero Slides", icon: "🖼️" },
    { id: "mission" as const, label: "Mission/Vision", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-navy mb-8">
          Homepage Content Management
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-orange text-orange"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {/* Statistics Tab */}
                {activeTab === "statistics" && (
                  <StatisticsManager
                    statistics={statistics}
                    onDelete={handleDelete}
                    onToggleActive={toggleActive}
                    onReload={loadData}
                    saving={saving}
                  />
                )}

                {/* Testimonials Tab */}
                {activeTab === "testimonials" && (
                  <TestimonialsManager
                    testimonials={testimonials}
                    onDelete={handleDelete}
                    onToggleActive={toggleActive}
                    onReload={loadData}
                    saving={saving}
                  />
                )}

                {/* Products Tab */}
                {activeTab === "products" && (
                  <ProductsManager
                    products={products}
                    onDelete={handleDelete}
                    onToggleActive={toggleActive}
                    onReload={loadData}
                    saving={saving}
                  />
                )}

                {/* Hero Slides Tab */}
                {activeTab === "hero" && (
                  <HeroSlidesManager
                    slides={heroSlides}
                    onDelete={handleDelete}
                    onToggleActive={toggleActive}
                    onReload={loadData}
                    saving={saving}
                  />
                )}

                {/* Mission/Vision Tab */}
                {activeTab === "mission" && (
                  <MissionVisionManager
                    sections={missionVision}
                    onReload={loadData}
                    saving={saving}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component stubs - will create full implementations
function StatisticsManager({
  statistics,
  onDelete,
  onToggleActive,
  onReload,
  saving,
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    icon: "",
    order_index: 0,
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/v1/admin/homepage/statistics/${editingId}`
        : "/api/v1/admin/homepage/statistics";

      const response = await fetchWithAuth(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      setShowForm(false);
      setEditingId(null);
      setFormData({
        label: "",
        value: "",
        icon: "",
        order_index: 0,
        is_active: true,
      });
      await onReload();
      alert("Saved successfully!");
    } catch (error) {
      alert("Failed to save statistic");
    }
  };

  const handleEdit = (stat: Statistic) => {
    setFormData(stat);
    setEditingId(stat.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Statistics</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              label: "",
              value: "",
              icon: "",
              order_index: statistics.length,
              is_active: true,
            });
          }}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/90"
        >
          {showForm ? "Cancel" : "+ Add Statistic"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon (emoji or class)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm">Active (visible on homepage)</span>
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 bg-navy text-white px-6 py-2 rounded hover:bg-navy/90"
          >
            {editingId ? "Update" : "Create"} Statistic
          </button>
        </form>
      )}

      <div className="space-y-4">
        {statistics.map((stat: Statistic) => (
          <div
            key={stat.id}
            className="border rounded-lg p-4 flex items-center justify-between bg-white"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="font-semibold">{stat.label}</p>
                <p className="text-2xl text-orange">{stat.value}</p>
                <p className="text-sm text-gray-500">
                  Order: {stat.order_index}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleActive(stat.id, stat.is_active)}
                disabled={saving}
                className={`px-3 py-1 rounded text-sm ${
                  stat.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {stat.is_active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => handleEdit(stat)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(stat.id)}
                disabled={saving}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Testimonials Manager
function TestimonialsManager({
  testimonials,
  onDelete,
  onToggleActive,
  onReload,
  saving,
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    organization: "",
    quote: "",
    rating: 5,
    image_url: "",
    order_index: 0,
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/v1/admin/homepage/testimonials/${editingId}`
        : "/api/v1/admin/homepage/testimonials";

      const response = await fetchWithAuth(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image_url: formData.image_url || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: "",
        role: "",
        organization: "",
        quote: "",
        rating: 5,
        image_url: "",
        order_index: 0,
        is_active: true,
      });
      await onReload();
      alert("Saved successfully!");
    } catch (error) {
      alert("Failed to save testimonial");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      ...testimonial,
      image_url: testimonial.image_url || "",
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Testimonials</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: "",
              role: "",
              organization: "",
              quote: "",
              rating: 5,
              image_url: "",
              order_index: testimonials.length,
              is_active: true,
            });
          }}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/90"
        >
          {showForm ? "Cancel" : "+ Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role *</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Organization *
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating (1-5) *
              </label>
              <select
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
                required
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Quote *</label>
              <textarea
                value={formData.quote}
                onChange={(e) =>
                  setFormData({ ...formData, quote: e.target.value })
                }
                className="w-full border rounded px-3 py-2 h-24"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm">Active (visible on homepage)</span>
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 bg-navy text-white px-6 py-2 rounded hover:bg-navy/90"
          >
            {editingId ? "Update" : "Create"} Testimonial
          </button>
        </form>
      )}

      <div className="space-y-4">
        {testimonials.map((testimonial: Testimonial) => (
          <div key={testimonial.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                {testimonial.image_url ? (
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-orange/20 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.organization}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    onToggleActive(testimonial.id, testimonial.is_active)
                  }
                  disabled={saving}
                  className={`px-3 py-1 rounded text-sm ${
                    testimonial.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {testimonial.is_active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(testimonial.id)}
                  disabled={saving}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-700 italic border-l-4 border-orange pl-4">
              "{testimonial.quote}"
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Order: {testimonial.order_index}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Products Manager
function ProductsManager({
  products,
  onDelete,
  onToggleActive,
  onReload,
  saving,
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    link_url: "",
    order_index: 0,
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/v1/admin/homepage/featured-products/${editingId}`
        : "/api/v1/admin/homepage/featured-products";

      const response = await fetchWithAuth(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save");

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        icon: "",
        link_url: "",
        order_index: 0,
        is_active: true,
      });
      await onReload();
      alert("Saved successfully!");
    } catch (error) {
      alert("Failed to save product");
    }
  };

  const handleEdit = (product: FeaturedProduct) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Featured Products</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: "",
              description: "",
              icon: "",
              link_url: "",
              order_index: products.length,
              is_active: true,
            });
          }}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/90"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon (emoji or class) *
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="🤖 or fa-robot"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 h-20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Link URL *
              </label>
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) =>
                  setFormData({ ...formData, link_url: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm">Active (visible on homepage)</span>
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 bg-navy text-white px-6 py-2 rounded hover:bg-navy/90"
          >
            {editingId ? "Update" : "Create"} Product
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: FeaturedProduct) => (
          <div key={product.id} className="border rounded-lg p-6 bg-white">
            <div className="flex justify-between items-start mb-4">
              <span className="text-4xl">{product.icon}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleActive(product.id, product.is_active)}
                  disabled={saving}
                  className={`px-2 py-1 rounded text-xs ${
                    product.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {product.is_active ? "✓" : "✗"}
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <a
              href={product.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline block mb-3 truncate"
            >
              {product.link_url}
            </a>
            <p className="text-xs text-gray-500 mb-3">
              Order: {product.order_index}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                disabled={saving}
                className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hero Slides Manager
function HeroSlidesManager({
  slides,
  onDelete,
  onToggleActive,
  onReload,
  saving,
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    cta_text: "",
    cta_link: "",
    order_index: 0,
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/v1/admin/homepage/hero-slides/${editingId}`
        : "/api/v1/admin/homepage/hero-slides";

      const response = await fetchWithAuth(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          image_url: formData.image_url || null,
          cta_text: formData.cta_text || null,
          cta_link: formData.cta_link || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        image_url: "",
        cta_text: "",
        cta_link: "",
        order_index: 0,
        is_active: true,
      });
      await onReload();
      alert("Saved successfully!");
    } catch (error) {
      alert("Failed to save hero slide");
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setFormData({
      ...slide,
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      image_url: slide.image_url || "",
      cta_text: slide.cta_text || "",
      cta_link: slide.cta_link || "",
    });
    setEditingId(slide.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Hero Slides</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: "",
              subtitle: "",
              description: "",
              image_url: "",
              cta_text: "",
              cta_link: "",
              order_index: slides.length,
              is_active: true,
            });
          }}
          className="bg-orange text-white px-4 py-2 rounded hover:bg-orange/90"
        >
          {showForm ? "Cancel" : "+ Add Slide"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com/hero.jpg"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 h-20"
                placeholder="Additional description text for the slide"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.cta_text}
                onChange={(e) =>
                  setFormData({ ...formData, cta_text: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Learn More"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                CTA Button Link
              </label>
              <input
                type="url"
                value={formData.cta_link}
                onChange={(e) =>
                  setFormData({ ...formData, cta_link: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm">Active (visible on homepage)</span>
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 bg-navy text-white px-6 py-2 rounded hover:bg-navy/90"
          >
            {editingId ? "Update" : "Create"} Slide
          </button>
        </form>
      )}

      <div className="space-y-4">
        {slides.map((slide: HeroSlide) => (
          <div
            key={slide.id}
            className="border rounded-lg overflow-hidden bg-white"
          >
            {slide.image_url && (
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-xl">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-gray-600 text-sm">{slide.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleActive(slide.id, slide.is_active)}
                    disabled={saving}
                    className={`px-3 py-1 rounded text-sm ${
                      slide.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {slide.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(slide.id)}
                    disabled={saving}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {slide.description && (
                <p className="text-gray-700 mb-3">{slide.description}</p>
              )}
              {slide.cta_text && slide.cta_link && (
                <a
                  href={slide.cta_link}
                  className="inline-block bg-orange text-white px-4 py-2 rounded text-sm"
                >
                  {slide.cta_text} →
                </a>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Order: {slide.order_index}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mission/Vision Manager
function MissionVisionManager({ sections, onReload, saving }: any) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    icon: "",
  });

  const handleEdit = (section: MissionVision) => {
    setFormData({
      title: section.title,
      content: section.content,
      icon: section.icon || "",
    });
    setEditingSection(section.section_type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      const response = await fetchWithAuth(
        `/api/v1/admin/homepage/mission-vision/${editingSection}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            icon: formData.icon || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save");

      setEditingSection(null);
      setFormData({ title: "", content: "", icon: "" });
      await onReload();
      alert("Saved successfully!");
    } catch (error) {
      alert("Failed to save section");
    }
  };

  const sectionTypes = [
    { type: "mission", emoji: "🎯", color: "blue" },
    { type: "vision", emoji: "🔭", color: "green" },
    { type: "identity", emoji: "🏆", color: "purple" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Mission, Vision & Identity
        </h2>
        <p className="text-gray-600 text-sm">
          Edit the three core sections that define your organization.
        </p>
      </div>

      {editingSection && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg mb-6"
        >
          <h3 className="text-lg font-semibold mb-4 capitalize">
            Edit {editingSection}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon (emoji or class)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="🎯"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full border rounded px-3 py-2 h-32"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-navy text-white px-6 py-2 rounded hover:bg-navy/90"
            >
              Update {editingSection}
            </button>
            <button
              type="button"
              onClick={() => setEditingSection(null)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sectionTypes.map((sectionType) => {
          const section = sections.find(
            (s: MissionVision) => s.section_type === sectionType.type
          );
          return (
            <div
              key={sectionType.type}
              className={`border-2 border-${sectionType.color}-200 rounded-lg p-6 bg-white`}
            >
              <div className="text-center mb-4">
                <span className="text-5xl">
                  {section?.icon || sectionType.emoji}
                </span>
              </div>
              <h3 className="font-bold text-xl text-center mb-4 capitalize">
                {section?.title || sectionType.type}
              </h3>
              {section ? (
                <>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                    {section.content}
                  </p>
                  <button
                    onClick={() => handleEdit(section)}
                    className={`w-full bg-${sectionType.color}-50 text-${sectionType.color}-600 px-4 py-2 rounded hover:bg-${sectionType.color}-100 transition`}
                  >
                    Edit {sectionType.type}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-400 text-sm mb-4 italic">
                    No content yet
                  </p>
                  <button
                    onClick={() => {
                      setFormData({
                        title:
                          sectionType.type.charAt(0).toUpperCase() +
                          sectionType.type.slice(1),
                        content: "",
                        icon: sectionType.emoji,
                      });
                      setEditingSection(sectionType.type);
                    }}
                    className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Create {sectionType.type}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
