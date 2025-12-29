import { getTranslations } from 'next-intl/server';
import { AlertTriangle, Phone, ExternalLink } from 'lucide-react';

export default async function ResponsibleGamblingPage() {
  const t = await getTranslations('compliance.responsible');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-10 w-10 text-amber-600" />
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {t('title')}
        </h1>
      </div>

      <div className="prose prose-lg mt-8 max-w-none">
        <p className="text-lg text-gray-600">{t('intro')}</p>

        <div className="mt-8 rounded-lg bg-red-50 border-l-4 border-red-500 p-6">
          <p className="text-lg font-bold text-red-800">{t('warning')}</p>
          <p className="mt-2 text-red-700">
            If you or someone you know is struggling with gambling addiction, please seek help
            immediately using the resources below.
          </p>
        </div>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('principles.title')}</h2>
        <div className="mt-4 grid gap-4">
          {t.raw('principles.items').map((item: any, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('signs.title')}</h2>
        <ul className="mt-2 space-y-2">
          {t.raw('signs.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('resources.title')}</h2>
        <p className="text-gray-600">{t('resources.description')}</p>

        <div className="mt-4 space-y-3">
          {t.raw('resources.items').map((item: any, index: number) => (
            <a
              key={index}
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.contact}</p>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </a>
          ))}
        </div>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">{t('advice.title')}</h2>
        <ul className="mt-2 space-y-2">
          {t.raw('advice.items').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-6">
          <p className="text-center">
            <span className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-2xl font-bold text-white">
              18+
            </span>
          </p>
          <p className="mt-4 text-center text-gray-700">
            Gambling is illegal for persons under the age of 18. We strictly enforce age verification
            and do not target minors in any marketing activities.
          </p>
        </div>
      </div>
    </div>
  );
}
