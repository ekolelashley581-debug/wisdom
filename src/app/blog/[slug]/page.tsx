import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { SocialShare } from "@/components/blog/SocialShare";
import {
  getBlogPostBySlug,
  getBlogPosts,
} from "@/lib/content";
import { formatDate } from "@/lib/format";
import { mainSrc } from "@/lib/media-src";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: [post.og_image || post.featured_image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const [post, all] = await Promise.all([
    getBlogPostBySlug(params.slug),
    getBlogPosts(),
  ]);
  if (!post) notFound();

  const related = all
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wisdomlimbe.com";
  const url = `${siteUrl}/blog/${post.slug}`;

  return (
    <article className="bg-primary pt-24">
      <ReadingProgress />
      <div className="container-wisdom section-pad !pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
        <p className="eyebrow">{post.category}</p>
        <h1 className="heading-display mb-4 max-w-3xl !text-4xl md:!text-5xl">
          {post.title}
        </h1>
        <p className="mb-6 text-sm text-silver-mute">
          {post.author} ·{" "}
          {post.published_at ? formatDate(post.published_at) : "Draft"}
        </p>
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/10">
          <PlaceholderImage
            label={post.title}
            src={mainSrc(post)}
            aspect="wide"
            className="rounded-none min-h-[220px]"
          />
        </div>
        <SocialShare url={url} title={post.title} />

        <div
          className="prose-wisdom mt-10 max-w-3xl space-y-4 text-base leading-relaxed text-silver-light [&_p]:text-silver-mute [&_strong]:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-silver-mute"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-16 border-t border-white/10 pt-10">
            <h2 className="font-display text-2xl text-white">Related posts</h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="text-secondary-glow hover:underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link href="/blog" className="btn-outline mt-10 inline-flex">
          Back to Journal
        </Link>
      </div>
    </article>
  );
}
