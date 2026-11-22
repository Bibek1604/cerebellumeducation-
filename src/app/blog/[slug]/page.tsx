import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { PostCard } from "@/components/media/post-card";
import { formatPostDate, getPostBySlug, getPosts } from "@/cms/media";
import { absoluteUrl } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/** With Cache Components at least one param is required; the placeholder renders notFound(). */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "__none__" }];
}

/** Same approach as /programs/[slug]: params are read at the top on purpose. */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.excerpt || p.title, path: `/blog/${p.slug}` });
}

/** Content: Admin → Blog posts. */
export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const more = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const date = formatPostDate(post.date);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || undefined,
          datePublished: post.date || undefined,
          author: post.author ? { "@type": "Person", name: post.author } : undefined,
          image: post.cover ? absoluteUrl(post.cover.src) : undefined,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }}
      />
      <PageHero
        title={post.title}
        description={post.excerpt || undefined}
        crumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
        badge={null}
      >
        {(date || post.author) && (
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink-soft">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden className="size-4" /> <time dateTime={post.date!}>{date}</time>
              </span>
            )}
            {post.author && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound aria-hidden className="size-4" /> {post.author}
              </span>
            )}
          </p>
        )}
      </PageHero>

      <Section>
        <Container className="max-w-3xl 2xl:max-w-3xl">
          {post.cover && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl shadow-soft">
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                fill
                priority
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
                style={{ objectPosition: post.cover.position || undefined }}
              />
            </div>
          )}
          <div className="prose-brand space-y-5 text-lg leading-relaxed text-ink">
            {post.blocks.map((b, i) => (
              <div key={i}>
                {b.heading && <h2 className="mt-4 mb-3 text-2xl font-extrabold">{b.heading}</h2>}
                {b.text.split(/\n{2,}/).map((para, j) => (
                  <p key={j} className="mt-3 whitespace-pre-line first:mt-0">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <ButtonLink href="/blog" variant="ghost" className="mt-10">
            <ArrowLeft aria-hidden className="size-4" /> All articles
          </ButtonLink>
        </Container>
      </Section>

      {more.length > 0 && (
        <Section tone="muted">
          <Container>
            <h2 className="text-2xl font-extrabold sm:text-3xl">More from our blog</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
