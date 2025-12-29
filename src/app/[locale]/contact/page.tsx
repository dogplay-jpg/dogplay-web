import { getTranslations } from 'next-intl/server';
import { Mail, MessageCircle, Phone } from 'lucide-react';

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Dogplay Agent',
          }),
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{t('description')}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Send us a message</h2>
            <form className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  {t('form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  {t('form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-700"
              >
                {t('form.submit')}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
              <div className="mt-4 space-y-4">
                <a
                  href="mailto:support@dogplay.io"
                  className="flex items-center gap-3 text-gray-600 transition-colors hover:text-primary-600"
                >
                  <Mail className="h-5 w-5" />
                  <span>support@dogplay.io</span>
                </a>
                <a
                  href="https://t.me/dogplaysupport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 transition-colors hover:text-primary-600"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>@dogplaysupport</span>
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-primary-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Join Our Affiliate Program
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Ready to start earning? Sign up as a Dogplay Agent today.
              </p>
              <a
                href="https://www.dogplay.io/?ref=agent"
                rel="sponsored nofollow"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-700"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
