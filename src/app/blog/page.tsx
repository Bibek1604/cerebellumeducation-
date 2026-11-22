import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { PostCard } from "@/components/media/post-card";
import { getPosts } from "@/cms/media";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog: Guides to Studying Medicine Abroad",
  description: "Guides, updates and advice on studying MBBS and medicine abroad from the Cerebellum Education Network counselling team.",
  path: "/blog",
});

/** Posts: Admin → Blog posts. */
export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        title={<span className="text-brand-gradient">Blog</span>}
        description="Guides, updates and advice on studying medicine abroad."
        crumbs={[{ label: "Blog", href: "/blog" }]}
        badge={null}
      />
      <Section>
        <Container>
          {posts.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-ink">New articles are on their way. Please check back soon.</p>
          )}
        </Container>
      </Section>
    </>
  );
}
