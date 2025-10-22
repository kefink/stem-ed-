import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Fetch the blog post data for metadata
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/public/blog/posts/${params.slug}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        title: "Blog Post Not Found | STEM-ED-ARCHITECTS",
        description: "The requested blog post could not be found.",
      };
    }

    const post = await response.json();

    return {
      title: post.seo_title || `${post.title} | STEM-ED-ARCHITECTS Blog`,
      description:
        post.seo_description ||
        post.excerpt ||
        "Read more on STEM-ED-ARCHITECTS blog",
      keywords: post.category
        ? [post.category, "STEM Education", "Africa", "Technology", "Robotics"]
        : ["STEM Education", "Africa", "Technology", "Robotics"],
      authors: post.author_name ? [{ name: post.author_name }] : [],
      openGraph: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt || "",
        type: "article",
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        images: post.featured_image ? [post.featured_image] : [],
        authors: post.author_name ? [post.author_name] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt || "",
        images: post.featured_image ? [post.featured_image] : [],
      },
    };
  } catch (error) {
    return {
      title: "Blog Post | STEM-ED-ARCHITECTS",
      description: "Read our latest blog post on STEM education",
    };
  }
}

export { default } from "./client-page";
