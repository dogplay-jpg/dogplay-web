import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Dogplay Agent',
            description: 'Your trusted partner in iGaming affiliate marketing',
          }),
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {t('title')}
        </h1>

        <p className="mt-4 text-lg text-gray-600">{t('description')}</p>

        <div className="prose prose-lg mt-12 max-w-none">
          <h2 className="text-xl font-semibold text-gray-900">{t('mission')}</h2>
          <p>{t('missionText')}</p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('editorial')}</h2>
          <p>{t('editorialText')}</p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('team')}</h2>
          <p>{t('teamText')}</p>
        </div>

        <div className="mt-12 rounded-lg bg-primary-50 p-8">
          <h3 className="text-lg font-semibold text-gray-900">
            Ready to Start Earning?
          </h3>
          <p className="mt-2 text-gray-600">
            Join India&apos;s leading betting affiliate program today.
          </p>
          <a
            href="https://www.dogplay.io/?ref=agent"
            rel="sponsored nofollow"
            className="mt-4 inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-700"
          >
            Join Dogplay Agent
          </a>
        </div>
      </div>
    </>
  );
}
