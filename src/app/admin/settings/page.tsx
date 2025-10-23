"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SiteSettings = {
  contact: {
    phone: string;
    email: string;
    location: string;
    address: string;
  };
  socialMedia: {
    youtube: string;
    facebook: string;
    tiktok: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  seo: {
    siteTitle: string;
    siteDescription: string;
    keywords: string;
  };
  company: {
    name: string;
    tagline: string;
    foundedYear: string;
  };
};

export default function SiteSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    contact: {
      phone: "",
      email: "",
      location: "",
      address: "",
    },
    socialMedia: {
      youtube: "",
      facebook: "",
      tiktok: "",
      instagram: "",
      linkedin: "",
      twitter: "",
    },
    businessHours: {
      weekdays: "",
      saturday: "",
      sunday: "",
    },
    seo: {
      siteTitle: "",
      siteDescription: "",
      keywords: "",
    },
    company: {
      name: "",
      tagline: "",
      foundedYear: "",
    },
  });

  useEffect(() => {
    if (status === "loading") return;
    const role = (session?.user as any)?.role as string | undefined;
    if (status === "unauthenticated" || role !== "admin") {
      router.replace("/login?next=/admin/settings");
      return;
    }

    // Load settings
    const loadSettings = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/admin/settings",
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Map backend response to frontend format
          setSettings({
            contact: {
              phone: data.contact.phone || "",
              email: data.contact.email || "",
              location: data.contact.location || "",
              address: data.contact.address || "",
            },
            socialMedia: {
              youtube: data.social.youtube || "",
              facebook: data.social.facebook || "",
              tiktok: data.social.tiktok || "",
              instagram: data.social.instagram || "",
              linkedin: data.social.linkedin || "",
              twitter: data.social.twitter || "",
            },
            businessHours: {
              weekdays: data.hours.weekdays || "",
              saturday: data.hours.saturday || "",
              sunday: data.hours.sunday || "",
            },
            seo: {
              siteTitle: data.seo.site_title || "",
              siteDescription: data.seo.site_description || "",
              keywords: data.seo.keywords || "",
            },
            company: {
              name: data.company.name || "",
              tagline: data.company.tagline || "",
              foundedYear: data.company.founded_year || "",
            },
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [status, session, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Map frontend format to backend format
      const backendSettings = {
        contact: {
          phone: settings.contact.phone,
          email: settings.contact.email,
          location: settings.contact.location,
          address: settings.contact.address,
        },
        social: {
          youtube: settings.socialMedia.youtube,
          facebook: settings.socialMedia.facebook,
          tiktok: settings.socialMedia.tiktok,
          instagram: settings.socialMedia.instagram,
          linkedin: settings.socialMedia.linkedin,
          twitter: settings.socialMedia.twitter,
        },
        hours: {
          weekdays: settings.businessHours.weekdays,
          saturday: settings.businessHours.saturday,
          sunday: settings.businessHours.sunday,
        },
        seo: {
          site_title: settings.seo.siteTitle,
          site_description: settings.seo.siteDescription,
          keywords: settings.seo.keywords,
        },
        company: {
          name: settings.company.name,
          tagline: settings.company.tagline,
          founded_year: settings.company.foundedYear,
        },
      };

      const response = await fetch(
        "http://localhost:8000/api/v1/admin/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any)?.accessToken}`,
          },
          body: JSON.stringify(backendSettings),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        throw new Error(error.detail || "Failed to save settings");
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
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
          <h1 className="text-4xl font-bebas text-navy mb-2">Site Settings</h1>
          <p className="text-gray-600 font-lato">
            Update your website contact information, social media links, and
            other settings
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <p className="font-montserrat">{message.text}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bebas text-navy mb-4">
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.contact.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="0705204870"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.contact.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="info@stem-ed-architects.com"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Location (City, Country)
              </label>
              <input
                type="text"
                value={settings.contact.location}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, location: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="Nairobi, Kenya"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Full Address
              </label>
              <input
                type="text"
                value={settings.contact.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, address: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="Nairobi, Kenya - Serving East Africa & Beyond"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bebas text-navy mb-4">
            Social Media Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                🎥 YouTube URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.youtube}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      youtube: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="https://www.youtube.com/@yourchannel"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                📘 Facebook URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      facebook: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="https://www.facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                🎵 TikTok URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.tiktok}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      tiktok: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="https://www.tiktok.com/@youraccount"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                📸 Instagram URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      instagram: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="https://www.instagram.com/youraccount"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                💼 LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.linkedin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      linkedin: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="https://www.linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                🐦 Twitter/X URL
              </label>
              <input
                type="url"
                value={settings.socialMedia.twitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialMedia: {
                      ...settings.socialMedia,
                      twitter: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="https://twitter.com/youraccount"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bebas text-navy mb-4">Business Hours</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Weekdays (Monday - Friday)
              </label>
              <input
                type="text"
                value={settings.businessHours.weekdays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessHours: {
                      ...settings.businessHours,
                      weekdays: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="Monday - Friday: 8:00 AM - 6:00 PM (EAT)"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Saturday
              </label>
              <input
                type="text"
                value={settings.businessHours.saturday}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessHours: {
                      ...settings.businessHours,
                      saturday: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="Saturday: 9:00 AM - 1:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Sunday
              </label>
              <input
                type="text"
                value={settings.businessHours.sunday}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessHours: {
                      ...settings.businessHours,
                      sunday: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="Sunday: Closed"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bebas text-navy mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Site Title
              </label>
              <input
                type="text"
                value={settings.seo.siteTitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, siteTitle: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="STEM-ED-ARCHITECTS | Engineering Learning Solutions"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Site Description
              </label>
              <textarea
                value={settings.seo.siteDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, siteDescription: e.target.value },
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="A brief description of your website for search engines..."
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={settings.seo.keywords}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, keywords: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="STEM Education, Robotics, AI Integration, Teacher Training"
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bebas text-navy mb-4">
            Company Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.company.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, name: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="STEM-ED-ARCHITECTS"
              />
            </div>
            <div>
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Founded Year
              </label>
              <input
                type="text"
                value={settings.company.foundedYear}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: {
                      ...settings.company,
                      foundedYear: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="2014"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-montserrat font-semibold text-navy mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.company.tagline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, tagline: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange font-lato"
                placeholder="Engineering Learning Solutions for Africa's Future"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin"
            className="px-6 py-3 border border-gray-300 rounded-lg font-montserrat font-semibold text-navy hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange hover:bg-orange-dark text-white rounded-lg font-montserrat font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
