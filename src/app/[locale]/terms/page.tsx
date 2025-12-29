import { getTranslations } from 'next-intl/server';

export default async function TermsPage() {
  const t = await getTranslations('compliance.terms');
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

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('acceptance.title')}</h2>
        <p>{t('acceptance.content')}</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('eligibility.title')}</h2>
        <p>{t('eligibility.content')}</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('affiliate.title')}</h2>
        <ul className="mt-2 space-y-2">
          {t.raw('affiliate.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('prohibited.title')}</h2>
        <ul className="mt-2 space-y-2">
          {t.raw('prohibited.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('termination.title')}</h2>
        <p>{t('termination.content')}</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('limitation.title')}</h2>
        <p>{t('limitation.content')}</p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('changes.title')}</h2>
        <p>{t('changes.content')}</p>
      </div>
    </div>
  );
}
