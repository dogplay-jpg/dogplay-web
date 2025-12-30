const fs = require('fs');

const content = `import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getPostBySlug, markdownToHtml, getAllPostSlugs } from '@/lib/content';

// Generate static params for all blog posts
export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  const locales = ['en', 'hi'];

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              '@type': 'Organization',
              name: 'Dogplay Team',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Dogplay Agent',
              logo: {
                '@type': 'ImageObject',
                url: 'https://dogplay.io/logo.png',
              },
            },
            description: post.excerpt,
            url: \`https://dogplay.io\${locale === 'en' ? '' : \`/\${locale}\`}/blog/\${slug}\`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': \`https://dogplay.io\${locale === 'en' ? '' : \`/\${locale}\`}/blog/\${slug}\`,
            },
          }),
        }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <Link
          href={\`/\${locale === 'en' ? '' : locale}/blog\`}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>By Dogplay Team</span>
          </div>
        </div>

        <div
          className="prose prose-lg mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />

        <div className="mt-12 rounded-lg bg-primary-50 p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Start Earning with Dogplay Agent
          </h3>
          <p className="mt-2 text-gray-600">
            Join India&apos;s leading betting affiliate program and earn up to 45% RevShare.
          </p>
          <a
            href="https://www.dogplay.io/?ref=agent"
            rel="sponsored nofollow"
            className="mt-4 inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-700"
          >
            Join Now
          </a>
        </div>
      </article>
    </>
  );
}
`;

fs.writeFileSync('E:/dpy1/src/app/[locale]/blog/[slug]/page.tsx', content);
console.log('Fixed blog/[slug]/page.tsx');
