import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'Dogplay Agent' }],
    creator: 'Dogplay Agent',
    publisher: 'Dogplay Agent',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://dogplay.io'),
    openGraph: {
      type: 'website',
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
      alternateLocale: locale === 'hi' ? 'en_IN' : 'hi_IN',
      title: t('title'),
      description: t('description'),
      siteName: 'Dogplay Agent',
      url: 'https://dogplay.io',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale === 'hi' ? 'hi-IN' : 'en-IN'} className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={`https://dogplay.io${locale === 'en' ? '' : `/${locale}`}`} />
        {locales.map((loc) => (
          <link
            key={loc}
            rel="alternate"
            hrefLang={loc === 'hi' ? 'hi-IN' : 'en-IN'}
            href={`https://dogplay.io${loc === 'en' ? '' : `/${loc}`}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://dogplay.io" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function Header({ locale }: { locale: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href={locale === 'en' ? '/' : `/${locale}`}
          className="flex items-center space-x-2"
        >
          <span className="text-xl font-bold text-primary-700">Dogplay Agent</span>
        </a>

        <div className="hidden items-center space-x-8 md:flex">
          <a
            href={locale === 'en' ? '/' : `/${locale}`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Home
          </a>
          <a
            href={locale === 'en' ? '/blog' : `/${locale}/blog`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Blog
          </a>
          <a
            href={locale === 'en' ? '/about' : `/${locale}/about`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            About
          </a>
          <a
            href={locale === 'en' ? '/contact' : `/${locale}/contact`}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href={locale === 'en' ? '/hi' : '/'}
            className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
          >
            {locale === 'en' ? 'हिन्दी' : 'English'}
          </a>
          <a
            href="https://www.dogplay.io/?ref=agent"
            rel="sponsored nofollow"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Join Now
          </a>
        </div>
      </nav>
    </header>
  );
}

function Footer({ locale }: { locale: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900">Dogplay Agent</h3>
            <p className="mt-2 text-sm text-gray-600">
              India&apos;s fastest-growing betting affiliate program. Start earning today.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={locale === 'en' ? '/about' : `/${locale}/about`}
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href={locale === 'en' ? '/contact' : `/${locale}/contact`}
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href={locale === 'en' ? '/blog' : `/${locale}/blog`}
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={locale === 'en' ? '/privacy' : `/${locale}/privacy`}
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href={locale === 'en' ? '/terms' : `/${locale}/terms`}
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href={locale === 'en' ? '/affiliate-disclosure' : `/${locale}/affiliate-disclosure`}
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a
                  href={locale === 'en' ? '/responsible-gambling' : `/${locale}/responsible-gambling`}
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  Responsible Gambling
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Connect</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="mailto:support@dogplay.io"
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  support@dogplay.io
                </a>
              </li>
              <li>
                <a
                  href="https://www.dogplay.io/?ref=agent"
                  rel="sponsored nofollow"
                  className="text-sm text-gray-600 transition-colors hover:text-primary-600"
                >
                  Join Dogplay
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} Dogplay Agent. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            18+ Only. Gambling involves risk. Please play responsibly.
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            Licensed and regulated for fair gaming practices.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Dogplay Agent',
            url: 'https://dogplay.io',
            logo: 'https://dogplay.io/logo.png',
            description: 'India\'s leading betting affiliate program with competitive commissions and reliable payouts.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'IN',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer support',
              email: 'support@dogplay.io',
              availableLanguage: ['English', 'Hindi'],
            },
            sameAs: [
              'https://www.dogplay.io/',
            ],
          }),
        }}
      />
    </footer>
  );
}
