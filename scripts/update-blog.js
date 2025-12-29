const fs = require('fs');

const content = `import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getAllPosts } from '@/lib/content';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const posts = getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Dogplay Agent Blog',
            description: 'Latest insights on iGaming and cricket betting in India',
            url: \`https://dogplay.io\${locale === 'en' ? '' : \`/\${locale}\`}/blog\`,
          }),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {t('description')}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">
            <p>No articles yet. Check back soon!</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-video w-full bg-gradient-to-br from-primary-100 to-accent-100" />

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                      {post.category}
                    </span>
                    <time className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  <h2 className="mt-3 text-xl font-semibold text-gray-900 line-clamp-2 hover:text-primary-600">
                    <Link
                      href={\`/\${locale === 'en' ? '' : locale}/blog/\${post.slug}\`}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-2 flex-1 text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <Link
                    href={\`/\${locale === 'en' ? '' : locale}/blog/\${post.slug}\`}
                    className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {t('readMore')} →
                  </Link>
                </div>

                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'BlogPosting',
                      headline: post.title,
                      datePublished: post.date,
                      url: \`https://dogplay.io\${locale === 'en' ? '' : \`/\${locale}\`}/blog/\${post.slug}\`,
                    }),
                  }}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
`;

fs.writeFileSync('E:/dpy1/src/app/[locale]/blog/page.tsx', content);
console.log('Updated blog/page.tsx');
