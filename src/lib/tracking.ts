// Loads Google Analytics, Google Ads and the Meta Pixel, only after a yes for that
// purpose and only when an ID is set. Nothing goes to these parties before that:
// consent mode starts on denied and the script itself only loads after the choice.
import type { Consent } from './consent';

const GA_ID = import.meta.env.PUBLIC_GA_ID as string | undefined;
const ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID as string | undefined;
const META_ID = import.meta.env.PUBLIC_META_PIXEL_ID as string | undefined;
// Thirteen months, in seconds.
const COOKIE_EXPIRES = 34128000;

interface Fbq {
  (...args: unknown[]): void;
  queue?: unknown[];
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
  push?: unknown;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: Fbq;
    _fbq?: unknown;
  }
}

const addScript = (src: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.append(script);
};

const startGoogle = (choices: Consent) => {
  const useGa = Boolean(GA_ID && choices.statistics);
  const useAds = Boolean(ADS_ID && choices.marketing);
  if (!useGa && !useAds) return false;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  const state = (allowed: boolean) => (allowed ? 'granted' : 'denied');
  window.gtag('consent', 'default', {
    analytics_storage: state(useGa),
    ad_storage: state(useAds),
    ad_user_data: state(useAds),
    ad_personalization: state(useAds),
  });
  window.gtag('js', new Date());
  if (useGa) window.gtag('config', GA_ID, { cookie_expires: COOKIE_EXPIRES });
  if (useAds) window.gtag('config', ADS_ID);
  addScript(`https://www.googletagmanager.com/gtag/js?id=${useGa ? GA_ID : ADS_ID}`);
  return true;
};

const startMeta = (choices: Consent) => {
  if (!META_ID || !choices.marketing) return false;
  // The standard Meta queue: calls wait here until the script has loaded.
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  }) as Fbq;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = fbq;
  fbq('init', META_ID);
  fbq('track', 'PageView');
  addScript('https://connect.facebook.net/en_US/fbevents.js');
  return true;
};

let started = { statistics: false, marketing: false };

/** Starts what is allowed. Returns true when something that ran is no longer allowed. */
export const applyTracking = (choices: Consent) => {
  const withdrawn = (started.statistics && !choices.statistics) || (started.marketing && !choices.marketing);
  if (withdrawn) return true;
  const fresh = { statistics: choices.statistics && !started.statistics, marketing: choices.marketing && !started.marketing };
  if (window.gtag) {
    // Google already runs for the other purpose: only pass on the extra yes.
    if (fresh.statistics && GA_ID) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      window.gtag('config', GA_ID, { cookie_expires: COOKIE_EXPIRES });
    }
    if (fresh.marketing && ADS_ID) {
      window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
      window.gtag('config', ADS_ID);
    }
  } else {
    startGoogle(choices);
  }
  if (fresh.marketing) startMeta(choices);
  started = { statistics: choices.statistics, marketing: choices.marketing };
  return false;
};

/** Removes what these services placed, once a yes is taken back. */
export const clearTrackingCookies = (choices: Consent) => {
  const names = document.cookie.split(';').map((cookie) => cookie.split('=')[0].trim());
  const gone = (name: string) => (!choices.statistics && /^(_ga|_gid)/.test(name)) || (!choices.marketing && /^(_gcl|_fbp|_fbc)/.test(name));
  const parts = window.location.hostname.split('.');
  const domains = ['', ...parts.map((_, index) => `.${parts.slice(index).join('.')}`)];
  names.filter(gone).forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain && `; domain=${domain}`}`;
    });
  });
};
