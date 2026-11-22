import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatPostDate, type Post } from "@/cms/media";

export function PostCard({ post }: { post: Post }) {
  const date = formatPostDate(post.date);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="bg-brand-gradient-soft relative aspect-[16/9] overflow-hidden">
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: post.cover.position || undefined }}
          />
        ) : (
          <Image src="/logos/cerebellum-emblem.png" alt="" width={96} height={96} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {date && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
            <CalendarDays aria-hidden className="size-3.5" />
            <time dateTime={post.date!}>{date}</time>
          </p>
        )}
        <h3 className="mt-2 text-lg leading-snug font-bold">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
          Read more <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
