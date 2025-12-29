import { getTranslations } from 'next-intl/server';

export default async function AffiliateDisclosurePage() {
  const t = await getTranslations('compliance.disclosure');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {t('title')}
      </h1>

      <div className="prose prose-lg mt-8 max-w-none">
        <p className="text-lg text-gray-600">{t('content')}</p>

        <div className="mt-8 rounded-lg bg-yellow-50 border border-yellow-200 p-6">
          <p className="text-sm font-semibold text-yellow-800">
            This disclosure is provided in accordance with the Federal Trade Commission&apos;s
            guidelines concerning the use of endorsements and testimonials in advertising.
          </p>
        </div>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">What This Means for You</h2>
        <ul className="mt-4 space-y-2">
          <li>We only recommend products and services we genuinely believe provide value</li>
          <li>Our opinions are our own and not influenced by affiliate partnerships</li>
          <li>Using our affiliate links helps support our website at no extra cost to you</li>
          <li>We do not accept payment for positive reviews or recommendations</li>
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Affiliate Links on This Site</h2>
        <p>
          Links to <a href="https://www.dogplay.io/?ref=agent" rel="sponsored nofollow">Dogplay</a> and
          other betting platforms are affiliate links. When you click these links and register an
          account or make a deposit, we may receive a commission from the operator.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Contact Us</h2>
        <p>
          If you have questions about our affiliate relationships or this disclosure, please contact
          us at{' '}
          <a href="mailto:support@dogplay.io" className="text-primary-600 hover:text-primary-700">
            support@dogplay.io
          </a>
          .
        </p>
      </div>
    </div>
  );
}
