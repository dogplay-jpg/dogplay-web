import { getTranslations } from 'next-intl/server';

export default async function PrivacyPage() {
  const t = await getTranslations('compliance.privacy');
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {t('title')}
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        {t('lastUpdated', { date: currentDate })}
      </p>

      <div className="prose prose-lg mt-8 max-w-none">
        <p className="text-lg text-gray-600">{t('intro')}</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('collection.title')}</h2>
        <ul className="mt-2 space-y-2">
          <li>
            <strong>Personal Information:</strong> {t('collection.personal')}
          </li>
          <li>
            <strong>Technical Information:</strong> {t('collection.technical')}
          </li>
          <li>
            <strong>Usage Information:</strong> {t('collection.usage')}
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('usage.title')}</h2>
        <ul className="mt-2 space-y-2">
          {t.raw('usage.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('sharing.title')}</h2>
        <p>{t('sharing.content')}</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('cookies.title')}</h2>
        <p>{t('cookies.content')}</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('rights.title')}</h2>
        <ul className="mt-2 space-y-2">
          {t.raw('rights.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <p className="mt-8 text-gray-600">{t('contact')}</p>
      </div>
    </div>
  );
}
