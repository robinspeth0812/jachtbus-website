// Content of the site. Everything that the portal
// will manage later has a default here, so the site also builds without it.
import type { ImageMetadata } from 'astro';
import busImg from '../assets/jachtbus-bus.jpg';
import luikImg from '../assets/jachtbus-regio.jpg';
import wijnImg from '../assets/drinken-wijn.jpg';
import veldImg from '../assets/bruiloft-veld.jpg';
import grillImg from '../assets/dienst-bedrijfsfeest.jpg';
import festivalImg from '../assets/dienst-evenement.jpg';
import plankImg from '../assets/eten-serveerplank.jpg';
import bedieningImg from '../assets/bediening-serveert.jpg';
import smokerImg from '../assets/eten-smoker.jpg';

export const BASE = '';
/** Internal link, so the whole site can move under a prefix in one change. */
export const url = (path = '') => `${BASE}/${path.replace(/^\/|\/$/g, '')}${path ? '/' : ''}`.replace('//', '/');
export const aanvraagUrl = (gelegenheid?: string) => `${url('aanvraag')}${gelegenheid ? `?gelegenheid=${gelegenheid}` : ''}`;

export const contact = {
  telefoon: '0592 656363',
  telefoonHref: 'tel:+31592656363',
  whatsappHref: 'https://wa.me/31592656363',
  email: 'info@jachtbusfoodtruck.nl',
  instagram: 'https://www.instagram.com/jachtbusfoodtruck/',
  // Fill in the page of the Jachtbus itself: the icon in the topbar shows once this is set.
  facebook: '',
  bedrijf: 'Jachtbus Foodtruck & Catering B.V.',
  kvk: '96772174',
  btw: 'NL867758624B01',
  adres: 'Julianalaan 54',
  postcode: '9462 PH',
  plaats: 'Gasselte',
};

export type Shape = 'arch' | 'circle' | 'corner' | 'bowl';
export interface Photo {
  src: ImageMetadata;
  alt: string;
}

export const photos = {
  bus: { src: busImg, alt: 'De Jachtbus in het gras: een felgroene cabine, gele dakstreep en een zwart zijpaneel met gele lijnen' },
  luik: { src: luikImg, alt: 'Peer en een collega lachend in het open luik van de Jachtbus, met de gele lijnen van de bus eromheen' },
  wijn: { src: wijnImg, alt: 'Peer schenkt in de bus een glas rode wijn in' },
  veld: { src: veldImg, alt: 'De Jachtbus bij een bruiloft buiten, met gasten tussen de stoelen in het veld' },
  grill: { src: grillImg, alt: 'Peer aan de grill in de Jachtbus' },
  festival: { src: festivalImg, alt: 'Een festivalterrein in de avond, met verlichte tenten' },
  plank: { src: plankImg, alt: 'Een houten plank met kleine broodjes tussen de gasten met een glas wijn' },
  bediening: { src: bedieningImg, alt: 'Een serveerster deelt taart uit voor het zijpaneel van de bus' },
  smoker: { src: smokerImg, alt: 'Zes stukken gekruid vlees op de grill, boven gloeiende kolen' },
} satisfies Record<string, Photo>;

export interface Item {
  title: string;
  text: string;
  /** Link on the title, when this has its own page. */
  href?: string;
}
export interface Faq {
  vraag: string;
  antwoord: string;
}

export const faqAlgemeen: Faq[] = [
  { vraag: 'Wat kost de Jachtbus?', antwoord: 'Dat hangt af van het aantal gasten, het menu en de vorm van je feest. We werken niet met een vaste kaart, dus je krijgt altijd een voorstel op maat. Doe je aanvraag, dan hoor je wat het voor jouw feest kost.' },
  { vraag: 'Vanaf hoeveel personen komen jullie?', antwoord: 'We komen vanaf 40 personen. Is je groep net wat kleiner? Vraag het gerust, dan kijken we wat er kan.' },
  { vraag: 'Hoe ver van tevoren moet ik boeken?', antwoord: 'Hoe eerder, hoe beter. Zomerse zaterdagen zijn het eerst weg. Check je datum via de aanvraag, dan hoor je of de bus nog vrij is.' },
  { vraag: 'Waar komen jullie allemaal?', antwoord: 'In Drenthe, Groningen en Friesland. Ligt jouw plek er net buiten? Vraag het gerust, in overleg kan er vaak meer.' },
  { vraag: 'Wat als het regent?', antwoord: 'Dan draaien we gewoon door, in overleg met een tent of overkapping erbij.' },
  { vraag: 'Regelen jullie ook de drankjes?', antwoord: 'Dat kan, van de borrel tot een compleet drankenpakket. Zet het in je aanvraag, dan nemen we het mee in het voorstel.' },
  { vraag: 'Nemen jullie zelf bediening mee?', antwoord: 'Ja. We komen met eigen bediening, dus niemand van je gasten hoeft achter de bar.' },
  { vraag: 'Kunnen jullie rekening houden met allergieën?', antwoord: 'Ja. Geef allergieën en dieetwensen uiterlijk 14 dagen vooraf door, dan zorgen wij dat iedereen mee-eet.' },
  { vraag: 'Wat heeft de bus nodig op de locatie?', antwoord: 'Een plek van minimaal 6,5 bij 2,5 meter, een stevige en vlakke ondergrond (gras of grind kan ook), een toegang waar 3,5 ton doorheen kan en 230V of 16A binnen 25 meter.' },
  { vraag: 'Wat als er geen stroom is?', antwoord: 'Meestal is daar een oplossing voor, bijvoorbeeld een aggregaat. Zet het in je aanvraag, dan denken we mee.' },
];

export const faqReferenties: Faq[] = [
  { vraag: 'Zijn dit echte feesten?', antwoord: 'Ja. Hier staan alleen feesten waar we echt stonden, en alleen als de klant het goedvindt.' },
  { vraag: 'Zijn de reacties echt?', antwoord: 'Ja. We nemen ze letterlijk over en zetten de bron erbij. Verzinnen doen we niet.' },
  { vraag: 'Mijn plaats staat er niet tussen. Komen jullie wel?', antwoord: 'Vast wel. Heel Drenthe, Groningen en Friesland horen bij ons werkgebied, en in overleg kan er vaak meer.' },
  { vraag: 'Kan ik zien wat er op het menu stond?', antwoord: 'We werken niet met een vaste kaart, dus elk feest is anders. Vertel wat je zoekt, dan laten we zien wat er kan.' },
  { vraag: 'Kan mijn feest hier ook komen te staan?', antwoord: 'Graag, maar alleen als jij het goedvindt. Dat vragen we je na afloop.' },
  { vraag: 'Vanaf hoeveel personen komen jullie?', antwoord: 'We komen vanaf 40 personen. Is je groep net wat kleiner? Vraag het gerust, dan kijken we wat er kan.' },
];

export const arrangementen: Item[] = [
  { title: 'Walking dinner', text: 'Zeven seizoensgerechten die we rondbrengen door je feest. Niemand zit vast aan een tafel.' },
  { title: 'Streetfood', text: 'Direct uit de bus, lekker informeel. Gasten halen het zelf aan het luik.' },
  { title: 'BBQ van de smoker', text: 'Langzaam gegaard vlees, salades en huisgemaakte sauzen.' },
  { title: 'Buffet', text: 'Gasten pakken zelf, wij vullen aan en houden alles vers.' },
  { title: 'Aan tafel', text: 'Wij serveren uit, jij blijft zitten. Netjes, zonder poespas.' },
];

export interface Service {
  slug: string;
  /** An occasion is what you celebrate (a wedding), an option is what we bring (a BBQ smoker). */
  soort: 'gelegenheid' | 'mogelijkheid';
  gelegenheid: string;
  nav: string;
  rowText: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  schemaName: string;
  intro: string;
  cta: string;
  photo: Photo;
  shape: Shape;
  momentsTitle: string;
  moments: Item[];
  /** What we can bring to this occasion. Left out when the moments already say so. */
  optiesTitle?: string;
  opties?: Item[];
  storyTitle: string;
  story: string[];
  storyPhoto: Photo;
  worriesTitle: string;
  worries: Item[];
  faq: Faq[];
}

/** The date question in the first step on a page about one occasion. */
export const datumVraag: Record<string, string> = {
  bruiloft: 'Wanneer is jullie bruiloft?',
  bedrijfsfeest: 'Wanneer is het bedrijfsfeest?',
  tuinfeest: 'Wanneer is je tuinfeest?',
  evenement: 'Wanneer is je evenement?',
};

export const services: Service[] = [
  {
    slug: 'bruiloft',
    soort: 'gelegenheid',
    gelegenheid: 'bruiloft',
    nav: 'Bruiloft',
    rowText: 'Van de borrel na de ceremonie tot de snack op de dansvloer.',
    title: 'Trouwen met de bus voor de deur',
    metaTitle: 'Foodtruck op je bruiloft',
    metaDescription: 'Bruiloftscatering van de Jachtbus: borrel, diner en avondsnack, ter plekke bereid. Met eigen bediening, in Drenthe, Groningen en Friesland.',
    schemaName: 'Bruiloftscatering',
    intro: 'Van de borrel na de ceremonie tot de snack op de dansvloer: wij koken ter plekke en stemmen alles af op jullie dag.',
    cta: 'Is onze datum nog vrij?',
    photo: photos.veld,
    shape: 'arch',
    momentsTitle: 'Op welk moment van de dag?',
    moments: [
      { title: 'De borrel na de ceremonie', text: 'Hapjes uit het vuistje, terwijl de foto’s worden gemaakt.' },
      { title: 'Het diner', text: 'Walking dinner, buffet of aan tafel. Wat bij jullie dag past.' },
      { title: 'De avondsnack', text: 'Rond een uur of elf, als de dansvloer vol staat.' },
    ],
    optiesTitle: 'Wat kunnen we serveren?',
    opties: [
      { title: 'Walking dinner', text: 'Zeven seizoensgerechten die we rondbrengen, zonder tafelschikking.', href: url('catering/walking-dinner') },
      { title: 'Aan tafel', text: 'Wij serveren uit, jullie gasten blijven zitten.' },
      { title: 'Streetfood', text: 'Direct uit de bus, lekker informeel. Ook goed als avondsnack.' },
      { title: 'BBQ-smoker', text: 'Langzaam gegaard vlees, salades en huisgemaakte sauzen.', href: url('catering/bbq-smoker') },
    ],
    storyTitle: 'Geen pakket, gewoon jullie dag',
    story: [
      'We gaan eerst samen zitten, gewoon met een kop koffie. Wat voor dag wordt het, en wat past daarbij? Er is geen vaste kaart: we kijken naar het seizoen, jullie smaak en de vorm van de dag.',
      'Op de dag zelf bouwen we op buiten beeld, serveren op afspraak en laten alles netjes achter. In de tuin thuis, op het erf bij de schuur, in een weiland of bij een trouwlocatie zonder eigen keuken.',
    ],
    storyPhoto: photos.bediening,
    worriesTitle: 'En als het regent?',
    worries: [
      { title: 'Als het regent', text: 'Wij draaien gewoon door, in overleg met tent of overkapping.' },
      { title: 'Als er meer gasten komen', text: 'Laat het weten, we rekenen op een marge.' },
      { title: 'Als de dag uitloopt', text: 'Gebeurt bij elke bruiloft. We schuiven mee.' },
      { title: 'Als jullie moeten verplaatsen', text: 'In goed overleg kijken we samen naar een nieuwe datum.' },
    ],
    faq: [
      { vraag: 'Hoe ver van tevoren moeten we boeken?', antwoord: 'Zaterdagen in het hoogseizoen gaan ver vooruit. Trouwen jullie tussen mei en september, check je datum dan vroeg. Voor andere dagen is er vaak meer ruimte.' },
      { vraag: 'Kunnen jullie meerdere momenten op de dag verzorgen?', antwoord: 'Ja. Borrel, diner en avondsnack kunnen los of in combinatie. Veel stellen kiezen voor het hele traject, dan staat er de hele dag een vast gezicht.' },
      { vraag: 'Nemen jullie zelf bediening mee?', antwoord: 'Ja, we komen met eigen bediening. Jullie gasten hoeven nergens voor te zorgen, jullie ook niet.' },
      { vraag: 'Wat als onze locatie geen stroom heeft?', antwoord: 'Meestal is daar een oplossing voor, bijvoorbeeld een aggregaat. Zet het in de aanvraag, dan denken we mee.' },
    ],
  },
  {
    slug: 'bedrijfsfeest',
    soort: 'gelegenheid',
    gelegenheid: 'bedrijfsfeest',
    nav: 'Bedrijfsfeest',
    rowText: 'Personeelsfeest, jubileum of borrel. Wij regelen het eten.',
    title: 'Het eten is al geregeld',
    metaTitle: 'Foodtruck op je bedrijfsfeest',
    metaDescription: 'De Jachtbus op je personeelsfeest, jubileum of bedrijfsborrel. Ter plekke gekookt, met eigen bediening, in Drenthe, Groningen en Friesland.',
    schemaName: 'Bedrijfscatering',
    intro: 'Personeelsfeest, jubileum, opening of vrijdagmiddagborrel. Wij zetten de bus op je terrein en koken ter plekke, jij hebt er geen omkijken naar.',
    cta: 'Check onze datum',
    photo: photos.grill,
    shape: 'corner',
    momentsTitle: 'Waar komen we voor?',
    moments: [
      { title: 'Personeelsfeest', text: 'Iedereen eet wanneer die wil, en niemand hoeft achter de bar.' },
      { title: 'Jubileum of opening', text: 'Een bus op je terrein trekt vanzelf de aandacht van je gasten.' },
      { title: 'Borrel of relatie-event', text: 'Hapjes uit het vuistje en drankjes erbij, zo groot als je wilt.' },
    ],
    optiesTitle: 'Welke vorm past bij je team?',
    opties: [
      { title: 'Streetfood', text: 'Iedereen haalt het zelf aan het luik, wanneer die wil.' },
      { title: 'BBQ-smoker', text: 'Langzaam gegaard vlees, salades en huisgemaakte sauzen.', href: url('catering/bbq-smoker') },
      { title: 'Walking dinner', text: 'Zeven seizoensgerechten die we rondbrengen, en iedereen blijft in gesprek.', href: url('catering/walking-dinner') },
      { title: 'Buffet', text: 'Je collega’s pakken zelf, wij vullen aan en houden alles vers.' },
    ],
    storyTitle: 'Eén aanspreekpunt, geen gedoe',
    story: [
      'Je hebt wel wat anders te doen dan cateringlijstjes bijhouden. Je belt met ons, wij denken mee over menu en opstelling, en je krijgt een voorstel met alles erin. Wil je drankjes erbij? Dan nemen we die mee.',
      'We rijden voor op je eigen terrein, of op de plek die je hebt gehuurd. Als de laatste gast weg is, is de bus ook weg en ligt er niets meer.',
    ],
    storyPhoto: photos.plank,
    worriesTitle: 'Waar je over twijfelt',
    worries: [
      { title: 'Als het aantal nog schuift', text: 'Het definitieve aantal geef je uiterlijk 14 dagen vooraf door.' },
      { title: 'Als collega’s dieetwensen hebben', text: 'Geef ze op tijd door, dan eet iedereen mee.' },
      { title: 'Als het buiten slecht weer is', text: 'We draaien door, in overleg met tent of overkapping.' },
      { title: 'Als je een factuur op naam nodig hebt', text: 'Dat is geregeld. Je krijgt een nette factuur van onze B.V.' },
    ],
    faq: [
      { vraag: 'Kan de bus op ons bedrijfsterrein staan?', antwoord: 'Meestal wel. We hebben een plek nodig van 6,5 bij 2,5 meter op een stevige ondergrond, een toegang voor 3,5 ton en 230V of 16A binnen 25 meter.' },
      { vraag: 'Komen jullie ook doordeweeks?', antwoord: 'Ja. Doordeweeks is er vaak zelfs meer ruimte in de agenda dan op zaterdag.' },
      { vraag: 'Is de prijs inclusief of exclusief btw?', antwoord: 'Voor bedrijven zijn onze prijzen exclusief btw, tenzij anders vermeld. Dat staat ook in je voorstel.' },
    ],
  },
  {
    slug: 'tuinfeest',
    soort: 'gelegenheid',
    gelegenheid: 'tuinfeest',
    nav: 'Tuinfeest',
    rowText: 'Verjaardag, jubileum of gewoon omdat het kan. Jij blijft bij je gasten.',
    title: 'Jij bent gast op je eigen feest',
    metaTitle: 'Foodtruck op je tuinfeest',
    metaDescription: 'Een tuinfeest vanaf 40 personen zonder zelf achter de barbecue te staan. De Jachtbus kookt bij jou in de tuin, in Drenthe, Groningen en Friesland.',
    schemaName: 'Catering voor tuinfeesten',
    intro: 'Verjaardag, jubileum of gewoon omdat het kan. Wij koken bij jou in de tuin, jij staat niet achter de barbecue maar bij je gasten.',
    cta: 'Past de bus bij ons?',
    photo: photos.plank,
    shape: 'circle',
    momentsTitle: 'Wat past bij je feest?',
    moments: [
      { title: 'Streetfood uit het luik', text: 'Gasten halen het zelf. Lekker informeel, en iedereen raakt aan de praat.' },
      { title: 'Walking dinner', text: 'Zeven seizoensgerechten die we rondbrengen door je tuin.' },
      { title: 'BBQ van de smoker', text: 'Langzaam gegaard vlees, salades en huisgemaakte sauzen.' },
    ],
    storyTitle: 'De bus in je tuin, past dat?',
    story: [
      'Vaker dan je denkt. We hebben 6,5 bij 2,5 meter nodig, een stevige ondergrond (gras of grind kan ook) en een doorgang waar 3,5 ton langs kan. Twijfel je? Stuur een foto van de plek, dan kijken we mee.',
      'We komen vanaf 40 personen. Na afloop ruimen we alles op, dus de volgende ochtend hoef je alleen je tuinstoelen terug te zetten.',
    ],
    storyPhoto: photos.bus,
    worriesTitle: 'Wat je vast wilt weten',
    worries: [
      { title: 'Als de buren ook komen', text: 'Laat het weten als er gasten bijkomen, dan rekenen we mee.' },
      { title: 'Als de doorgang smal is', text: 'Stuur een foto. Soms kan de bus op de oprit of de straat ernaast.' },
      { title: 'Als het regent', text: 'We draaien door. Een tent erbij en het feest gaat door.' },
      { title: 'Als je ook drankjes wilt', text: 'Kan. Zet het in je aanvraag, dan nemen we het mee.' },
    ],
    faq: [
      { vraag: 'Vanaf hoeveel personen komen jullie in de tuin?', antwoord: 'Vanaf 40 personen. Is je groep net wat kleiner? Vraag het gerust, dan kijken we wat er kan.' },
      { vraag: 'Maakt de bus mijn gras kapot?', antwoord: 'Gras kan prima zolang de ondergrond stevig is. Is het erg nat geweest? Dan overleggen we vooraf over de beste plek.' },
      { vraag: 'Heb ik een vergunning nodig?', antwoord: 'Voor een feest op je eigen grond meestal niet, maar regels verschillen per gemeente. Vergunningen en toestemming regel je zelf. Twijfel je? Dan denken we mee.' },
    ],
  },
  {
    slug: 'evenement',
    soort: 'gelegenheid',
    gelegenheid: 'evenement',
    nav: 'Evenement',
    rowText: 'Festival, markt of open dag. De bus draait door.',
    title: 'Het luik open, de rij eromheen',
    metaTitle: 'Foodtruck voor je evenement of festival',
    metaDescription: 'De Jachtbus op je festival, markt of open dag. Streetfood uit het luik, ter plekke gekookt, in Drenthe, Groningen en Friesland.',
    schemaName: 'Evenementencatering',
    intro: 'Festival, markt, open dag of sportevenement. We zetten de bus neer, doen het luik open en draaien door tot het klaar is.',
    cta: 'Boek de bus voor je evenement',
    photo: photos.festival,
    shape: 'bowl',
    momentsTitle: 'Hoe werkt dat bij een evenement?',
    moments: [
      { title: 'Vaste kaart voor de dag', text: 'Een korte kaart die snel gaat, afgestemd op je publiek.' },
      { title: 'Eigen verkoop of afkoop', text: 'Gasten betalen zelf, of jij koopt het eten vooraf af. We overleggen wat past.' },
      { title: 'Eigen ploeg', text: 'We komen met onze eigen keuken en bediening, jij hoeft niets te regelen.' },
    ],
    optiesTitle: 'Wat kunnen we serveren?',
    opties: [
      { title: 'Streetfood', text: 'Een korte kaart uit het luik, zodat de rij doorloopt.' },
      { title: 'BBQ-smoker', text: 'Langzaam gegaard vlees, salades en huisgemaakte sauzen.', href: url('catering/bbq-smoker') },
    ],
    storyTitle: 'Een bus die je niet over het hoofd ziet',
    story: [
      'Felgroen met signaalgeel: de Jachtbus valt op tussen de witte tenten, en dat is ook de bedoeling. Bezoekers weten meteen waar het eten is.',
      'We hebben een plek van 6,5 bij 2,5 meter nodig, stroom binnen 25 meter en een toegang voor 3,5 ton. De rest neem je met ons door, van opbouwtijden tot terreinregels.',
    ],
    storyPhoto: photos.bus,
    worriesTitle: 'Wat organisatoren vragen',
    worries: [
      { title: 'Als het drukker wordt dan verwacht', text: 'Geef een verwachting door, dan rekenen we op een marge.' },
      { title: 'Als de terreinregels streng zijn', text: 'Stuur ze mee, dan plannen we op- en afbouw daarop.' },
      { title: 'Als het weer omslaat', text: 'De bus draait door. We kijken samen naar een tent of overkapping.' },
      { title: 'Als je meerdere dagen draait', text: 'Dat kan in overleg. Zet het in je aanvraag.' },
    ],
    faq: [
      { vraag: 'Wat heeft de bus nodig op een terrein?', antwoord: 'Een plek van 6,5 bij 2,5 meter, een stevige ondergrond, een toegang voor 3,5 ton en 230V of 16A binnen 25 meter.' },
      { vraag: 'Kan er zonder vaste stroom gedraaid worden?', antwoord: 'Meestal wel, bijvoorbeeld met een aggregaat. Zet het in je aanvraag, dan denken we mee.' },
    ],
  },
  {
    slug: 'walking-dinner',
    soort: 'mogelijkheid',
    gelegenheid: 'overige',
    nav: 'Walking dinner',
    rowText: 'Zeven seizoensgerechten, rondgebracht door je feest.',
    title: 'Zeven gangen, geen vaste stoel',
    metaTitle: 'Walking dinner op locatie',
    metaDescription: 'Een walking dinner van de Jachtbus: zeven seizoensgerechten, ter plekke bereid en rondgebracht. Op jouw locatie in Noord-Nederland, vanaf 40 personen.',
    schemaName: 'Walking dinner',
    intro: 'Zeven seizoensgerechten, ter plekke bereid en rondgebracht door je feest. Iedereen eet goed, en niemand zit de hele avond naast dezelfde oom.',
    cta: 'Vraag een walking dinner aan',
    photo: photos.bediening,
    shape: 'arch',
    momentsTitle: 'Hoe gaat een walking dinner?',
    moments: [
      { title: 'We koken ter plekke', text: 'Alles komt vers uit de bus, gerecht na gerecht.' },
      { title: 'We brengen het rond', text: 'Onze bediening loopt tussen je gasten door, jij hoeft nergens op te letten.' },
      { title: 'Je gasten blijven in beweging', text: 'Geen tafelschikking, dus iedereen spreekt iedereen.' },
    ],
    storyTitle: 'Wat er op de borden komt',
    story: [
      'Er is geen vaste kaart. Het seizoen bepaalt veel, en wij stemmen het af op jouw feest en je gasten. Veel van onze feesten zijn inmiddels walking dinners, dus we weten hoe het tempo moet.',
      'Allergieën of dieetwensen? Geef ze uiterlijk 14 dagen vooraf door, dan zorgen we dat iedereen mee-eet.',
    ],
    storyPhoto: photos.plank,
    worriesTitle: 'Wat je vast wilt weten',
    worries: [
      { title: 'Als gasten willen zitten', text: 'Zet wat statafels en stoelen neer. Dat werkt prima door elkaar.' },
      { title: 'Als het regent', text: 'Met een tent erbij lopen we gewoon door.' },
      { title: 'Als je kinderen meeneemt', text: 'Zet het in je aanvraag, dan denken we mee over het menu.' },
      { title: 'Als het later wordt', text: 'We schuiven mee. Het tempo bepalen we samen op de dag zelf.' },
    ],
    faq: [
      { vraag: 'Is een walking dinner genoeg om van te eten?', antwoord: 'Ja. Zeven gerechten na elkaar is een volledige maaltijd, en iedereen eet in zijn eigen tempo.' },
      { vraag: 'Vanaf hoeveel personen kan een walking dinner?', antwoord: 'Vanaf 40 personen. Is je groep net wat kleiner? Vraag het gerust, dan kijken we wat er kan.' },
    ],
  },
  {
    slug: 'bbq-smoker',
    soort: 'mogelijkheid',
    gelegenheid: 'bbq',
    nav: 'BBQ-smoker',
    rowText: 'Langzaam gegaard vlees, salades en huisgemaakte sauzen.',
    title: 'Laag vuur, lange adem',
    metaTitle: 'BBQ-smoker catering op locatie',
    metaDescription: 'BBQ van de smoker op jouw locatie: langzaam gegaard vlees, salades en huisgemaakte sauzen. De Jachtbus in Drenthe, Groningen en Friesland.',
    schemaName: 'BBQ-smoker catering',
    intro: 'Vlees dat uren de tijd krijgt, salades en sauzen die we zelf maken. De geur doet de rest, je gasten staan er vanzelf omheen.',
    cta: 'Vraag de smoker aan',
    photo: photos.smoker,
    shape: 'circle',
    momentsTitle: 'Wat komt er van de smoker?',
    moments: [
      { title: 'Langzaam gegaard vlees', text: 'Op laag vuur, met de tijd die het nodig heeft.' },
      { title: 'Salades erbij', text: 'Fris en vers, zodat het niet alleen om het vlees draait.' },
      { title: 'Huisgemaakte sauzen', text: 'Zelf gemaakt, dus niet uit een fles van de groothandel.' },
    ],
    storyTitle: 'Dit is geen worstje op de barbecue',
    story: [
      'Bij low and slow begint het werk al uren voor je gasten komen. Wij staan vroeg, zodat het vlees op tijd klaar is en jij er niet naar om hoeft te kijken.',
      'Het menu stellen we samen op. Eet niet iedereen vlees? Dan zorgen we dat er ook voor hen genoeg op tafel staat.',
    ],
    storyPhoto: photos.grill,
    worriesTitle: 'Wat je vast wilt weten',
    worries: [
      { title: 'Als niet iedereen vlees eet', text: 'Geef het door, dan zorgen we dat iedereen mee-eet.' },
      { title: 'Als het regent', text: 'De smoker trekt zich er weinig van aan. Wij ook niet.' },
      { title: 'Als het feest later begint', text: 'Geef het op tijd door, dan plannen we het vuur daarop.' },
      { title: 'Als je ook drankjes wilt', text: 'Kan. Zet het in je aanvraag, dan nemen we het mee.' },
    ],
    faq: [
      { vraag: 'Kan de smoker bij mij in de tuin?', antwoord: 'Vaak wel. Zet in je aanvraag waar het feest is, dan kijken we samen naar de beste plek.' },
      { vraag: 'Kan de smoker samen met ander eten?', antwoord: 'Ja. Bijvoorbeeld hapjes uit de bus bij de borrel en de smoker voor het diner. We stellen het samen op.' },
    ],
  },
];

export interface Region {
  slug: string;
  naam: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Title above the local story, next to the map. */
  lokaalTitel: string;
  verhaal: string[];
  plaatsen: string[];
  photo: Photo;
  /** Local things worth knowing. */
  extraTitel: string;
  extra: Item[];
  faq: Faq[];
  /** Province for the map and the references, on a page for a town or a service. Defaults to the name. */
  provincie?: 'Drenthe' | 'Groningen' | 'Friesland';
  /** Slug of the service this page is about, linked from the page. Empty for a plain area page. */
  dienst?: string;
  /** Kind of area in the structured data. */
  gebied?: 'State' | 'City';
  /** Breadcrumb label. Defaults to "Foodtruck {naam}". */
  kruimel?: string;
  /** Service name in the structured data. Defaults to "Foodtruckcatering in {naam}". */
  schemaNaam?: string;
  /** Title and kind of the row of services. Defaults to occasions, "Wat vieren we in {naam}?". */
  rijenTitel?: string;
  rijenSoort?: 'gelegenheid' | 'mogelijkheid';
  /** Titles of the review and FAQ sections. */
  reviewsTitel?: string;
  faqTitel?: string;
}

export const regions: Region[] = [
  {
    slug: 'foodtruck-drenthe',
    naam: 'Drenthe',
    title: 'Een foodtruck huren in Drenthe',
    metaTitle: 'Foodtruck huren in Drenthe',
    metaDescription: 'Foodtruck huren in Drenthe? De Jachtbus komt uit Gasselte en kookt ter plekke op bruiloften, tuinfeesten en bedrijfsfeesten, vanaf 40 personen.',
    intro: 'Hier komen we vandaan. De Jachtbus staat in Gasselte, dus van Assen tot de Hondsrug zijn we zo bij je.',
    lokaalTitel: 'De bus komt hier vandaan',
    verhaal: [
      'De Jachtbus staat in Gasselte, op de Hondsrug. Drenthe is dus thuis, en dat zie je aan de lijst hieronder: we stonden al in Assen, Rolde, Gieten, Roden en een hoop dorpen eromheen.',
      'Op een Drents erf, in een tuin of midden in het veld is vaak geen zaal of keuken. Daar komt de bus juist goed uit: wij nemen de keuken mee, jij zorgt voor een plek en 230V.',
    ],
    plaatsen: ['Assen', 'Gasselte', 'Rolde', 'Gieten', 'Roden', 'Gasselternijveen', 'Drouwen', 'Eeserveen', 'Een', 'Oudemolen', 'Nooitgedacht'],
    photo: photos.bus,
    extraTitel: 'Goed om te weten in Drenthe',
    extra: [
      { title: 'Heel Drenthe binnen bereik', text: 'We rijden vanuit Gasselte, dus de hele provincie ligt binnen bereik. Ook voor een feest doordeweeks.' },
      { title: 'Feest in het veld', text: 'Weiland, heide of erf? Gras kan, zolang de grond stevig genoeg is voor 3,5 ton. Na een natte week kijken we samen waar de bus het beste staat.' },
      { title: 'Natuur en vergunning', text: 'Vier je het bij een natuurgebied of op een openbare plek? Vraag bij je gemeente of je een vergunning nodig hebt. Wij denken mee over de opzet.' },
    ],
    faq: [
      { vraag: 'Waar in Drenthe komen jullie?', antwoord: 'Overal in de provincie. We rijden vanuit Gasselte, dus ook de hoeken van Drenthe zijn goed te doen.' },
      { vraag: 'Kan de bus op een plek zonder zaal of keuken?', antwoord: 'Dat is juist waar we voor gemaakt zijn. We hebben een plek van 6,5 bij 2,5 meter nodig, een stevige ondergrond en 230V of 16A binnen 25 meter.' },
      { vraag: 'Kunnen jullie op een erf of in een weiland staan in Drenthe?', antwoord: 'Ja, gras en grind zijn prima, als de grond 3,5 ton kan dragen. Twijfel je? Zet het in je aanvraag, dan kijken we mee.' },
      { vraag: 'Vanaf hoeveel personen komen jullie in Drenthe?', antwoord: 'Vanaf 40 personen, net als overal. Is je groep net wat kleiner? Vraag het gerust.' },
      { vraag: 'Hoe ver van tevoren moet ik boeken voor een feest in Drenthe?', antwoord: 'Hoe eerder, hoe beter. Zomerse zaterdagen zijn het eerst weg. Check je datum, dan hoor je of de bus nog vrij is.' },
    ],
  },
  {
    slug: 'foodtruck-groningen',
    naam: 'Groningen',
    title: 'Een foodtruck huren in Groningen',
    metaTitle: 'Foodtruck huren in Groningen',
    metaDescription: 'Foodtruck huren in Groningen? De Jachtbus kookt ter plekke op je bruiloft, bedrijfsfeest of evenement in Stad en Ommeland, vanaf 40 personen.',
    intro: 'Van Stad tot Westerwolde. We zetten de bus neer waar het feest is en koken ter plekke.',
    lokaalTitel: 'Van Stad tot Westerwolde',
    verhaal: [
      'We stonden al in Stadskanaal, Wedde, Leek en De Wilp, en vanuit Gasselte zijn we zo de provinciegrens over.',
      'Bedrijfsterrein in de stad of boerenerf in het Ommeland: als de bus er kan komen, kunnen wij koken. Zit je in de stad met een smalle toegang? Vertel het ons vooraf, dan kijken we samen waar de bus het beste past.',
    ],
    plaatsen: ['Stadskanaal', 'Wedde', 'Leek', 'De Wilp'],
    photo: photos.grill,
    extraTitel: 'Goed om te weten in Groningen',
    extra: [
      { title: 'In de stad', text: 'De binnenstad heeft eigen regels voor wie er met een voertuig in mag, en niet elke poort is breed genoeg. Plan je daar iets? Vertel het vroeg, dan zoeken we het samen uit.' },
      { title: 'In het Ommeland', text: 'Op een boerenerf heb je vaak alles wat we nodig hebben: ruimte, een stevige ondergrond en stroom in de buurt.' },
      { title: 'Op je bedrijfsterrein', text: 'Personeelsfeest of jubileum op je eigen terrein? Geef door waar de bus kan staan en hoe laat je wilt eten, de rest regelen wij.' },
    ],
    faq: [
      { vraag: 'Komen jullie ook in de stad Groningen?', antwoord: 'Ja, als de bus er kan staan. Hij is 6,5 meter lang en 3,5 ton, dus kijk even naar de toegang en vraag het gerust.' },
      { vraag: 'Hoe ver reizen jullie in de provincie?', antwoord: 'De hele provincie valt in ons werkgebied. Ligt je locatie ver weg? Dat bespreken we in het voorstel.' },
      { vraag: 'Kunnen jullie op ons bedrijfsterrein in Groningen staan?', antwoord: 'Ja, als er 6,5 bij 2,5 meter vrij is met een stevige ondergrond en 230V of 16A binnen 25 meter. Wij nemen de rest mee.' },
      { vraag: 'Vanaf hoeveel personen komen jullie in Groningen?', antwoord: 'Vanaf 40 personen, net als overal. Is je groep net wat kleiner? Vraag het gerust.' },
      { vraag: 'Hoe ver van tevoren moet ik boeken voor een feest in Groningen?', antwoord: 'Hoe eerder, hoe beter. Zomerse zaterdagen zijn het eerst weg. Check je datum, dan hoor je of de bus nog vrij is.' },
    ],
  },
  {
    slug: 'foodtruck-friesland',
    naam: 'Friesland',
    title: 'Een foodtruck huren in Friesland',
    metaTitle: 'Foodtruck huren in Friesland',
    metaDescription: 'Foodtruck huren in Friesland? De Jachtbus kookte al in Leeuwarden, Stiens en Drachten. Voor je bruiloft, bedrijfsfeest of tuinfeest, vanaf 40 personen.',
    intro: 'Ook over de provinciegrens staan we graag. Van Drachten tot Stiens, met de keuken achterin.',
    lokaalTitel: 'Een Drentse bus op een Fries feest',
    verhaal: [
      'We kookten al in Leeuwarden, Stiens en Drachten. Een Drentse bus op een Fries feest: dat gaat prima samen, zolang het eten goed is.',
      'Omdat de bus uit Drenthe komt, plannen we in Friesland de reis en de opbouw iets ruimer in. Dat regelen wij, daar merk jij niets van.',
    ],
    plaatsen: ['Leeuwarden', 'Stiens', 'Drachten'],
    photo: photos.plank,
    extraTitel: 'Goed om te weten in Friesland',
    extra: [
      { title: 'Reis en opbouw', text: 'De bus komt uit Drenthe, dus we vertrekken wat eerder. Geef door hoe laat je wilt eten, dan rekenen wij terug.' },
      { title: 'Feest aan het water', text: 'Een plek aan een meer of vaart is mooi, een zachte oever minder. Geef door hoe de grond erbij ligt, dan kijken we waar de bus stevig staat.' },
      { title: 'Op een eiland', text: 'Een feest op een Waddeneiland vraagt om een andere planning. Vraag het gerust, dan kijken we wat er kan.' },
    ],
    faq: [
      { vraag: 'Komen jullie door heel Friesland?', antwoord: 'Friesland hoort bij ons werkgebied. Ligt je locatie ver weg of op een lastige plek? Vraag het gerust, dan kijken we wat er kan.' },
      { vraag: 'Is er een minimum aantal gasten voor Friesland?', antwoord: 'We komen overal vanaf 40 personen. Is je groep net wat kleiner? Vraag het gerust.' },
      { vraag: 'Kan de bus aan het water staan in Friesland?', antwoord: 'Als de grond 3,5 ton kan dragen wel. Een zachte oever is lastig, dus zet het in je aanvraag, dan kijken we mee.' },
      { vraag: 'Komen jullie ook op de Friese Waddeneilanden?', antwoord: 'Dat vraagt om een andere planning, dus dat bekijken we per feest. Vraag het gerust.' },
      { vraag: 'Hoe ver van tevoren moet ik boeken voor een feest in Friesland?', antwoord: 'Hoe eerder, hoe beter. Zomerse zaterdagen zijn het eerst weg. Check je datum, dan hoor je of de bus nog vrij is.' },
    ],
  },
];

// Location pages that combine a service or a town with an area. Same template as
// the provinces, each with its own text, examples and keywords.
export const locaties: Region[] = [
  {
    slug: 'foodtruck-huren-assen',
    naam: 'Assen',
    provincie: 'Drenthe',
    gebied: 'City',
    kruimel: 'Foodtruck huren in Assen',
    title: 'Een foodtruck huren in Assen',
    metaTitle: 'Foodtruck huren in Assen',
    metaDescription: 'Foodtruck huren in Assen? De Jachtbus komt uit Gasselte en kookt ter plekke op je bruiloft, bedrijfsfeest of tuinfeest. Vanaf 40 personen.',
    intro: 'Vanuit Gasselte zijn we zo in Assen. We zetten de bus neer bij je huis, je bedrijf of je feestlocatie en koken ter plekke.',
    lokaalTitel: 'Assen, en de dorpen eromheen',
    verhaal: [
      'We stonden al in Assen, en ook in Rolde, Gieten en Roden. Vanuit Gasselte is het een kort ritje, dus Assen voelt voor ons gewoon als thuis.',
      'In een woonwijk is de ruimte vaak krapper dan op een erf. De bus is 6,5 meter lang, 2,5 meter breed en weegt 3,5 ton. Past hij niet in je tuin? Soms kan hij op de oprit. Stuur een foto van de plek, dan kijken we mee.',
    ],
    plaatsen: ['Assen', 'Rolde', 'Gieten', 'Roden', 'Gasselte'],
    photo: photos.luik,
    rijenTitel: 'Wat vieren we in Assen?',
    reviewsTitel: 'Echte reacties uit Drenthe',
    extraTitel: 'Goed om te weten in Assen',
    extra: [
      { title: 'In de wijk', text: 'Tuin of oprit in een woonwijk? Kijk of er 6,5 bij 2,5 meter vrij is en of de bus de straat in kan. Twijfel je? Stuur een foto.' },
      { title: 'Op je bedrijfsterrein', text: 'Personeelsfeest of jubileum bij je bedrijf in Assen? Een stuk parkeerplaats is vaak al genoeg, met stroom binnen 25 meter. Wij nemen de rest mee.' },
      { title: 'Op een openbare plek', text: 'Een feest in het park of op een plein vraagt vaak om toestemming van de gemeente. Die regel je zelf, wij denken mee over de opzet.' },
    ],
    faqTitel: 'Veelgestelde vragen over een foodtruck in Assen',
    faq: [
      { vraag: 'Komen jullie in heel Assen?', antwoord: 'Ja, in de stad en in de dorpen eromheen. We rijden vanuit Gasselte, dus Assen is voor ons dichtbij.' },
      { vraag: 'Past de bus in een tuin in een woonwijk?', antwoord: 'Vaak wel. We hebben 6,5 bij 2,5 meter nodig op een stevige ondergrond, en een doorgang waar 3,5 ton langs kan. Stuur een foto, dan kijken we mee.' },
      { vraag: 'Wat eet je bij de foodtruck?', antwoord: 'Streetfood uit het luik, een walking dinner met zeven seizoensgerechten of BBQ van de smoker. Er is geen vaste kaart: we stemmen het af op je feest.' },
      { vraag: 'Moet ik zelf stroom regelen?', antwoord: 'We hebben 230V of 16A nodig binnen 25 meter. Is dat er niet, dan is er meestal een oplossing, bijvoorbeeld een aggregaat. Zet het in je aanvraag.' },
      { vraag: 'Vanaf hoeveel personen komen jullie in Assen?', antwoord: 'Vanaf 40 personen, net als overal. Is je groep net wat kleiner? Vraag het gerust.' },
    ],
  },
  {
    slug: 'bruiloftscatering-drenthe',
    naam: 'Drenthe',
    provincie: 'Drenthe',
    dienst: 'bruiloft',
    kruimel: 'Bruiloftscatering in Drenthe',
    schemaNaam: 'Bruiloftscatering in Drenthe',
    title: 'Bruiloftscatering in Drenthe',
    metaTitle: 'Bruiloftscatering in Drenthe',
    metaDescription: 'Trouwen in Drenthe? De Jachtbus kookt op jullie bruiloft ter plekke: borrel, diner en avondsnack, met eigen bediening. Op het erf, in de tuin of in het veld.',
    intro: 'Trouwen op een Drents erf, in het weiland of gewoon thuis? Wij rijden de keuken voor en koken ter plekke, van de borrel tot de avondsnack.',
    lokaalTitel: 'Trouwen waar geen keuken is',
    verhaal: [
      'Veel mooie trouwplekken in Drenthe hebben geen keuken: het erf bij de schuur, een weiland aan de rand van het dorp, de tuin van je ouders. Daar is de bus voor gemaakt. Wij nemen de keuken mee, jullie zorgen voor een plek en stroom.',
      'De bus staat in Gasselte, dus Drenthe is thuis. We komen met eigen bediening en stemmen het eten af op het seizoen en op jullie dag. Een vast pakket is er niet.',
    ],
    plaatsen: ['Assen', 'Gasselte', 'Rolde', 'Gieten', 'Roden', 'Gasselternijveen', 'Drouwen', 'Eeserveen', 'Een', 'Oudemolen', 'Nooitgedacht'],
    photo: photos.veld,
    rijenTitel: 'Wat kunnen we op jullie bruiloft serveren?',
    rijenSoort: 'mogelijkheid',
    reviewsTitel: 'Echte reacties uit Drenthe',
    extraTitel: 'Goed om te weten bij een bruiloft in Drenthe',
    extra: [
      { title: 'Op het erf of in het weiland', text: 'Gras kan, als de grond 3,5 ton draagt. Na een natte week kijken we samen waar de bus het beste staat, zodat de dag niet in de modder eindigt.' },
      { title: 'De hele dag één gezicht', text: 'Borrel, diner en avondsnack kunnen los of samen. Kiezen jullie het hele traject, dan staat er de hele dag een vast gezicht.' },
      { title: 'Trouwen in de natuur', text: 'Een ceremonie bij de heide of in het bos? Vraag bij de gemeente of de terreinbeheerder wat er mag. Wij denken mee over de opzet.' },
    ],
    faqTitel: 'Veelgestelde vragen over bruiloftscatering in Drenthe',
    faq: [
      { vraag: 'Waar in Drenthe verzorgen jullie bruiloften?', antwoord: 'In de hele provincie. We rijden vanuit Gasselte, dus ook trouwlocaties in de hoeken van Drenthe zijn goed te doen.' },
      { vraag: 'Kan de bus op een trouwlocatie zonder keuken?', antwoord: 'Ja, daar is hij juist voor. We hebben een plek van 6,5 bij 2,5 meter nodig, een stevige ondergrond, een toegang voor 3,5 ton en 230V of 16A binnen 25 meter.' },
      { vraag: 'Welke momenten van de dag kunnen jullie verzorgen?', antwoord: 'De borrel na de ceremonie, het diner en de avondsnack. Los of in combinatie, wat bij jullie dag past.' },
      { vraag: 'Nemen jullie zelf bediening mee?', antwoord: 'Ja, we komen met eigen bediening. Jullie gasten hoeven nergens voor te zorgen, jullie ook niet.' },
      { vraag: 'Hoe ver van tevoren moeten we boeken?', antwoord: 'Zaterdagen tussen mei en september gaan ver vooruit. Trouwen jullie in die maanden? Check je datum dan vroeg.' },
      { vraag: 'Vanaf hoeveel gasten komen jullie?', antwoord: 'Vanaf 40 personen. Is jullie groep net wat kleiner? Vraag het gerust.' },
    ],
  },
];

// Every town from the owner's list of jobs that were actually done.
// Local page of a town, by name. A town without one shows as a plain tag.
export const plaatsPaginas: Record<string, string> = { Assen: 'foodtruck-huren-assen' };
// Own page of a job from the portal, by slug. A job without one gets no link on the map.
export const casePaginas: Record<string, string> = {};

export const allPlaces = ['Stiens', 'Leeuwarden', 'Drachten', 'Leek', 'Roden', 'Assen', 'Rolde', 'Gieten', 'Gasselte', 'Gasselternijveen', 'Eeserveen', 'Drouwen', 'Een', 'De Wilp', 'Nooitgedacht', 'Oudemolen', 'Stadskanaal', 'Wedde'];

export const steps: Item[] = [
  { title: 'Je doet een aanvraag', text: 'Via het formulier, de telefoon of een appje. Een richtdatum en een schatting van het aantal gasten is genoeg.' },
  { title: 'We bespreken het samen', text: 'Binnen 2 werkdagen nemen we contact met je op. Je vertelt wat je voor ogen hebt, wij denken mee over menu en opzet.' },
  { title: 'Je krijgt een voorstel', text: 'Met menu, opzet en prijs, precies zoals we het hebben besproken. Zeg jij ja, dan gaan wij aan de slag.' },
  { title: 'De luiken gaan open', text: 'We zetten de bus neer, koken ter plekke en laten alles netjes achter. Jij bent gewoon gast op je eigen feest.' },
];

// Latitude and longitude of the towns where the bus stood, looked up in OpenStreetMap.
export const plaatsKaart: Record<string, [number, number]> = {
  Stiens: [53.2608, 5.7642],
  Leeuwarden: [53.2006, 5.7919],
  Drachten: [53.1091, 6.0948],
  Leek: [53.1632, 6.3771],
  Roden: [53.1405, 6.4275],
  Assen: [52.9972, 6.5506],
  Rolde: [52.9844, 6.6487],
  Gieten: [53.0033, 6.7638],
  Gasselte: [52.9719, 6.7922],
  Gasselternijveen: [52.9862, 6.8472],
  Eeserveen: [52.8767, 6.7843],
  Drouwen: [52.9525, 6.7965],
  Een: [53.0747, 6.3931],
  'De Wilp': [53.1183, 6.2544],
  Nooitgedacht: [52.9703, 6.6617],
  Oudemolen: [53.0489, 6.6386],
  Stadskanaal: [52.9962, 7.0014],
  Wedde: [53.0691, 7.0763],
};

export const twijfels: Item[] = [
  { title: 'Geen idee waar je originele catering voor je event kunt vinden?', text: 'Vertel wat je viert en wanneer, dan denken wij de rest met je mee.' },
  { title: 'Je huurde eerder catering, maar het eten viel tegen of kwam te laat?', text: 'Wij koken ter plekke, waar je gasten bij staan. Dus niks dat al uren in een bak ligt.' },
  { title: 'Lastig om iets te vinden dat lekker én professioneel is voor elk type publiek?', text: 'Er is geen vaste kaart. We stemmen het menu en de vorm af op wie er komt.' },
];

export const waarom: Item[] = [
  { title: 'Alles ter plekke bereid', text: 'We koken in de bus, op jouw locatie.' },
  { title: 'Lokale producten', text: 'We kopen zo dichtbij als het kan.' },
  { title: 'Eigen bediening', text: 'We komen met ons eigen team, jij blijft bij je gasten.' },
  { title: 'Menu in overleg', text: 'We kijken samen naar het seizoen, je gasten en je feest.' },
];

export const valuesIntro = 'Bij ons draait alles om lokaal, eerlijk en voedzaam voedsel. We kiezen voor lokale producten om de economie te steunen en respect voor iedereen in de keten te waarborgen.';

export const values: (Item & { icon: 'pin' | 'leaf' | 'tree' })[] = [
  { icon: 'pin', title: 'Lokaal verkregen', text: 'Waar mogelijk maken wij gebruik van regionale producten van nauwkeurig uitgekozen partners.' },
  { icon: 'leaf', title: 'Eerlijke producten', text: "Wij geloven in eerlijke, schone, goede producten. Geen 'gerommel' en onnodige toevoegingen. Eerlijk eten telt!" },
  { icon: 'tree', title: 'Ambachtelijk bereid', text: '90% van ons voedsel bereiden we zelf. Anders vertrouwen we op ambachtelijke partners binnen onze waarden.' },
];

export const nav = [
  { href: url('catering'), label: 'Catering' },
  { href: url('referenties'), label: 'Referenties' },
  { href: url('over-ons'), label: 'Over ons' },
  { href: url('contact'), label: 'Contact' },
];
