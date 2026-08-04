import type { Metadata } from "next";
import { BlogList } from "@/components/blog/BlogList";
import { BlogSubscribe } from "@/components/blog/BlogSubscribe";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getBlogCategories, getBlogPosts, getPageCopy, getSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageCopy();
  return {
    title: copy.blog.seo.meta_title,
    description: copy.blog.seo.meta_description,
  };
}

export default async function BlogPage() {
  const [posts, categories, copy, settings] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getPageCopy(),
    getSettings(),
  ]);

  return (
    <div className="bg-primary bg-marble-subtle pt-24">
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
        />
        <p className="eyebrow">{copy.blog.eyebrow}</p>
        <h1 className="heading-display mb-3">{copy.blog.title}</h1>
        <p className="mb-10 max-w-2xl text-muted">{copy.blog.body}</p>
        <div className="mb-10">
          <BlogSubscribe enabled={settings.blog_alerts_enabled !== false} />
        </div>
        <BlogList posts={posts} categories={categories} />
      </div>
    </div>
  );
}
