// Structured data shared by the pages of the new site.
import type { Faq } from '../data/nieuw';

export const faqSchema = (items: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.vraag,
    acceptedAnswer: { '@type': 'Answer', text: item.antwoord },
  })),
});

export const serviceSchema = (name: string, description: string, area: string[] = ['Drenthe', 'Groningen', 'Friesland']) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: name,
  name,
  description,
  provider: { '@id': 'https://jachtbusfoodtruck.nl/#business' },
  areaServed: area.map((place) => ({ '@type': 'State', name: place })),
});
