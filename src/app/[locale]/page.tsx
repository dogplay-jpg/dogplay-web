'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { Calculator, TrendingUp, Shield, HeadphonesIcon, CheckCircle2, ArrowRight } from 'lucide-react';

const COMMISSION_RATES = [0.25, 0.30, 0.35, 0.40, 0.45];
const AVG_REVENUE_PER_PLAYER_INR = 5000;

export default function HomePage() {
  const t = useTranslations();
  const [players, setPlayers] = useState(50);
  const [commissionRate, setCommissionRate] = useState(0.35);

  const estimatedEarningsINR = Math.round(players * AVG_REVENUE_PER_PLAYER_INR * commissionRate);
  const estimatedEarningsUSD = Math.round(estimatedEarningsINR / 83);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Dogplay Agent',
            url: 'https://dogplay.io',
            description: 'Join the Dogplay Agent program and earn up to 45% RevShare with CPA options.',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://dogplay.io/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
              {t('hero.badge')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              {t('hero.subtitle')}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://www.dogplay.io/?ref=agent"
                rel="sponsored nofollow"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
              >
                {t('hero.cta.primary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="#calculator"
                className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-primary-500 hover:text-primary-600"
              >
                {t('hero.cta.secondary')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('features.title')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title={t('features.items.commission.title')}
              description={t('features.items.commission.description')}
            />
            <FeatureCard
              icon={<Calculator className="h-8 w-8" />}
              title={t('features.items.payment.title')}
              description={t('features.items.payment.description')}
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title={t('features.items.tracking.title')}
              description={t('features.items.tracking.description')}
            />
            <FeatureCard
              icon={<HeadphonesIcon className="h-8 w-8" />}
              title={t('features.items.support.title')}
              description={t('features.items.support.description')}
            />
          </div>
        </div>
      </section>

      <section id="calculator" className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('calculator.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{t('calculator.subtitle')}</p>
          </div>

          <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <div className="space-y-8">
              <div>
                <label htmlFor="players" className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>{t('calculator.players')}</span>
                  <span className="text-2xl font-bold text-primary-600">{players}</span>
                </label>
                <input
                  id="players"
                  type="range"
                  min="1"
                  max="500"
                  value={players}
                  onChange={(e) => setPlayers(Number(e.target.value))}
                  className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>500</span>
                </div>
              </div>

              <div>
                <label htmlFor="commission" className="text-sm font-medium text-gray-700">
                  {t('calculator.commission')}
                </label>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {COMMISSION_RATES.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setCommissionRate(rate)}
                      className={`rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
                        commissionRate === rate
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rate * 100}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-primary-50 p-6 text-center">
                <p className="text-sm font-medium text-gray-600">{t('calculator.estimated')}</p>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-primary-700">
                    ₹{estimatedEarningsINR.toLocaleString('en-IN')}
                  </span>
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-2xl font-semibold text-gray-600">
                    ${estimatedEarningsUSD.toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500">per month</p>
              </div>

              <a
                href="https://www.dogplay.io/?ref=agent"
                rel="sponsored nofollow"
                className="block w-full rounded-lg bg-primary-600 px-8 py-4 text-center text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
              >
                {t('calculator.cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('onboarding.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{t('onboarding.subtitle')}</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { num: '1', title: t('onboarding.steps.1.title'), desc: t('onboarding.steps.1.description') },
              { num: '2', title: t('onboarding.steps.2.title'), desc: t('onboarding.steps.2.description') },
              { num: '3', title: t('onboarding.steps.3.title'), desc: t('onboarding.steps.3.description') },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div className="flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
                    {step.num}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('faq.title')}
          </h2>

          <dl className="mt-12 space-y-6">
            <FAQItem
              question={t('faq.items.payment.question')}
              answer={t('faq.items.payment.answer')}
            />
            <FAQItem
              question={t('faq.items.commission.question')}
              answer={t('faq.items.commission.answer')}
            />
            <FAQItem
              question={t('faq.items.cricket.question')}
              answer={t('faq.items.cricket.answer')}
            />
            <FAQItem
              question={t('faq.items.tracking.question')}
              answer={t('faq.items.tracking.answer')}
            />
            <FAQItem
              question={t('faq.items.negative.question')}
              answer={t('faq.items.negative.answer')}
            />
          </dl>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-primary-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white p-6 shadow-md sm:p-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Affiliate Disclosure
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Some links on this website are affiliate links. We may earn a commission when you register through our links at no additional cost to you.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  18+
                </span>
                <Link
                  href="/responsible-gambling"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Responsible Gambling
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <dt className="flex items-start gap-3">
        <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary-600" />
        <p className="text-lg font-semibold text-gray-900">{question}</p>
      </dt>
      <dd className="mt-3 ml-9 text-gray-600">{answer}</dd>
    </div>
  );
}
