/**
 * JSON-LD structured data (schema.org), built from the same content the CMS
 * edits so it can never drift from the visible page.
 *
 * Conservative rule: anything still carrying a [[CONFIRM]] marker is left out
 * of structured data until the client confirms it.
 */
import { getImage } from 'astro:assets';
import { getEntry } from 'astro:content';
import { getSettings, getCredentials, getPracticeAreas, type Settings } from './site';
import { hasMarkers, stripMarkers } from './confirm';
import { requireImage } from './images';

const SITE = (import.meta.env.SITE as string).replace(/\/$/, '');
const abs = (path: string) => new URL(path, SITE + '/').href;
const ids = {
  firm: `${SITE}/#firm`,
  person: `${SITE}/#helen-popich-harris`,
  website: `${SITE}/#website`,
};

const e164 = (s: Settings) => s.phone_link.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '+1-$1-$2-$3');
const faxE164 = (s: Settings) => '+1-' + s.fax_display.replace(/\D/g, '').replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');

function postalAddress(s: Settings) {
  const a = s.address;
  return {
    '@type': 'PostalAddress',
    streetAddress: [a.street, a.suite].filter(Boolean).join(', '),
    addressLocality: a.city,
    addressRegion: a.state_abbr,
    postalCode: a.zip,
    addressCountry: 'US',
  };
}

async function headshotUrl() {
  const about = (await getEntry('about', 'about'))!.data;
  const img = await getImage({ src: requireImage(about.hero.image.src, 'schema'), width: 800, format: 'jpg' });
  return abs(img.src);
}

async function legalService() {
  const s = await getSettings();
  const areas = await getPracticeAreas();
  const sameAs = s.profiles.map((p) => p.url).filter(Boolean);
  const hoursConfirmed = !hasMarkers(s.hours_note);
  return {
    '@type': 'LegalService',
    '@id': ids.firm,
    name: s.firm_name,
    url: SITE + '/',
    logo: abs('/icon-512.png'),
    image: abs(s.default_share_image),
    telephone: e164(s),
    faxNumber: faxE164(s),
    email: s.email,
    address: postalAddress(s),
    geo: { '@type': 'GeoCoordinates', latitude: s.geo.lat, longitude: s.geo.lng },
    areaServed: s.area_served.map((name) => ({ '@type': 'Place', name: `${name}, Louisiana` })),
    // Hours are emitted once the "[[CONFIRM]]" note is cleared in Site settings.
    ...(hoursConfirmed && {
      openingHoursSpecification: s.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    founder: { '@id': ids.person },
    employee: { '@id': ids.person },
    knowsAbout: areas.map((a) => a.data.title),
    ...(sameAs.length && { sameAs }),
  };
}

async function person() {
  const s = await getSettings();
  const credentials = await getCredentials();
  const areas = await getPracticeAreas();
  const confirmed = credentials.filter((c) => !hasMarkers(c.data.title) && !hasMarkers(c.data.statement));
  const memberOf = confirmed
    .filter((c) => /fellow|member/i.test(c.data.statement))
    .map((c) => ({ '@type': 'Organization', name: c.data.issuer, ...(c.data.link && { url: new URL(c.data.link).origin }) }));
  const hasCredential = confirmed
    .filter((c) => /certif/i.test(c.data.statement))
    .map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.data.title,
      credentialCategory: 'certification',
      recognizedBy: { '@type': 'Organization', name: c.data.issuer },
    }));
  const award = confirmed
    .filter((c) => !/fellow|member|certif/i.test(c.data.statement))
    .map((c) => stripMarkers(c.data.statement));
  const sameAs = s.profiles.map((p) => p.url).filter(Boolean);

  return {
    '@type': 'Person',
    '@id': ids.person,
    name: s.attorney_name,
    jobTitle: s.attorney_title,
    description: `${s.header_tagline}, ${s.address.city}, ${s.address.state}`,
    url: abs('/about/'),
    image: await headshotUrl(),
    telephone: e164(s),
    email: s.email,
    address: postalAddress(s),
    worksFor: { '@id': ids.firm },
    alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Loyola University New Orleans' }],
    knowsAbout: areas.map((a) => a.data.title),
    ...(memberOf.length && { memberOf }),
    ...(hasCredential.length && { hasCredential }),
    ...(award.length && { award }),
    ...(sameAs.length && { sameAs }),
  };
}

async function website() {
  const s = await getSettings();
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: s.firm_name,
    url: SITE + '/',
    inLanguage: 'en-US',
    publisher: { '@id': ids.firm },
  };
}

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

export async function homeSchema() {
  return [graph(await legalService(), await person(), await website())];
}

export async function aboutSchema() {
  const p = await person();
  return [
    graph({ '@type': 'ProfilePage', url: abs('/about/'), mainEntity: { '@id': ids.person } }, p, await legalService()),
    breadcrumbs([{ name: 'About', path: '/about/' }]),
  ];
}

export async function contactSchema() {
  return [
    graph({ '@type': 'ContactPage', url: abs('/contact/'), about: { '@id': ids.firm } }, await legalService()),
    breadcrumbs([{ name: 'Contact', path: '/contact/' }]),
  ];
}

export async function practiceOverviewSchema() {
  const areas = await getPracticeAreas();
  const faqs = areas.flatMap((a) => a.data.faqs).filter((f) => !hasMarkers(f.question) && !hasMarkers(f.answer));
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    breadcrumbs([{ name: 'Practice Areas', path: '/practice-areas/' }]),
  ];
}

export async function practiceAreaSchema(slug: string) {
  const s = await getSettings();
  const area = (await getPracticeAreas()).find((a) => a.id === slug)!;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: area.data.title,
      serviceType: area.data.title,
      description: stripMarkers(area.data.summary),
      url: abs(`/practice-areas/${slug}/`),
      provider: { '@id': ids.firm, '@type': 'LegalService', name: s.firm_name },
      areaServed: s.area_served.map((name) => ({ '@type': 'Place', name: `${name}, Louisiana` })),
    },
    breadcrumbs([
      { name: 'Practice Areas', path: '/practice-areas/' },
      { name: area.data.title, path: `/practice-areas/${slug}/` },
    ]),
  ];
}

export async function simpleBreadcrumb(name: string, path: string) {
  return [breadcrumbs([{ name, path }])];
}
