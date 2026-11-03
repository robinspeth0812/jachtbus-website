// Content of the new bus-styled site under /nieuw. Everything that the portal
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

export const BASE = '/nieuw';
/** Internal link, so the whole site can move to the root in one change. */
export const url = (path = '') => `${BASE}/${path.replace(/^\/|\/$/g, '')}${path ? '/' : ''}`.replace('//', '/');
export const aanvraagUrl = (gelegenheid?: string) => `${url('aanvraag')}${gelegenheid ? `?gelegenheid=${gelegenheid}` : ''}`;

export const contact = {
  telefoon: '0592 656363',
  telefoonHref: 'tel:+31592656363',
  whatsappHref: 'https://wa.me/31592656363',
  email: 'info@brasseriejachtlust.nl',
  instagram: 'https://www.instagram.com/jachtbusfoodtruck/',
  bedrijf: 'Jachtbus Foodtruck & Catering B.V.',
  kvk: '96772174',
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

export const arrangementen: Item[] = [
  { title: 'Walking dinner', text: 'Zeven seizoensgerechten die we rondbrengen door je feest. Niemand zit vast aan een tafel.' },
  { title: 'Streetfood', text: 'Direct uit de bus, lekker informeel. Gasten halen het zelf aan het luik.' },
  { title: 'BBQ van de smoker', text: 'Langzaam gegaard vlees, salades en huisgemaakte sauzen.' },
  { title: 'Buffet', text: 'Gasten pakken zelf, wij vullen aan en houden alles vers.' },
  { title: 'Aan tafel', text: 'Wij serveren uit, jij blijft zitten. Netjes, zonder poespas.' },
];

export interface Service {
  slug: string;
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
  storyTitle: string;
  story: string[];
  storyPhoto: Photo;
  worriesTitle: string;
  worries: Item[];
  faq: Faq[];
}

export const services: Service[] = [
  {
    slug: 'bruiloft',
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
    gelegenheid: 'overige',
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
  verhaal: string[];
  plaatsen: string[];
  photo: Photo;
  faq: Faq[];
}

export const regions: Region[] = [
  {
    slug: 'foodtruck-drenthe',
    naam: 'Drenthe',
    title: 'Een foodtruck huren in Drenthe',
    metaTitle: 'Foodtruck huren in Drenthe',
    metaDescription: 'Foodtruck huren in Drenthe? De Jachtbus komt uit Gasselte en kookt ter plekke op bruiloften, tuinfeesten en bedrijfsfeesten, vanaf 40 personen.',
    intro: 'Hier komen we vandaan. De Jachtbus staat in Gasselte, dus van Assen tot de Hondsrug zijn we zo bij je.',
    verhaal: [
      'Drenthe is ons thuis, en dat merk je aan de agenda: we stonden al in Assen, Gasselte, Rolde, Gieten en een hoop dorpen eromheen. In een tuin, op een erf of midden in het veld.',
      'Juist op de Drentse plekken zonder zaal of keuken komt de bus goed uit. Wij nemen de keuken mee, jij zorgt voor een plek en 230V.',
    ],
    plaatsen: ['Assen', 'Gasselte', 'Rolde', 'Gieten', 'Roden', 'Gasselternijveen', 'Drouwen', 'Eeserveen', 'Een', 'Oudemolen', 'Nooitgedacht', 'De Wilp'],
    photo: photos.bus,
    faq: [
      { vraag: 'Waar in Drenthe komen jullie?', antwoord: 'Overal in de provincie. We rijden vanuit Gasselte, dus ook de hoeken van Drenthe zijn goed te doen.' },
      { vraag: 'Kan de bus op een plek zonder zaal of keuken?', antwoord: 'Dat is juist waar we voor gemaakt zijn. We hebben een plek van 6,5 bij 2,5 meter nodig, een stevige ondergrond en 230V of 16A binnen 25 meter.' },
    ],
  },
  {
    slug: 'foodtruck-groningen',
    naam: 'Groningen',
    title: 'Een foodtruck huren in Groningen',
    metaTitle: 'Foodtruck huren in Groningen',
    metaDescription: 'Foodtruck huren in Groningen? De Jachtbus kookt ter plekke op je bruiloft, bedrijfsfeest of evenement in Stad en Ommeland, vanaf 40 personen.',
    intro: 'Van Stad tot Westerwolde. We zetten de bus neer waar het feest is en koken ter plekke.',
    verhaal: [
      'We stonden al in Stadskanaal, Wedde en Leek, en vanuit Gasselte zijn we zo in de provincie. Bedrijfsterrein in de stad of boerenerf in het Ommeland: als de bus er kan komen, kunnen wij koken.',
      'Zit je in de stad met een smalle toegang? Vertel het ons vooraf, dan kijken we samen waar de bus het beste past.',
    ],
    plaatsen: ['Stadskanaal', 'Wedde', 'Leek'],
    photo: photos.grill,
    faq: [
      { vraag: 'Komen jullie ook in de stad Groningen?', antwoord: 'Ja, als de bus er kan staan. Hij is 6,5 meter lang en 3,5 ton, dus kijk even naar de toegang en vraag het gerust.' },
      { vraag: 'Hoe ver reizen jullie in de provincie?', antwoord: 'De hele provincie valt in ons werkgebied. Ligt je locatie ver weg? Dat bespreken we in het voorstel.' },
    ],
  },
  {
    slug: 'foodtruck-friesland',
    naam: 'Friesland',
    title: 'Een foodtruck huren in Friesland',
    metaTitle: 'Foodtruck huren in Friesland',
    metaDescription: 'Foodtruck huren in Friesland? De Jachtbus kookte al in Leeuwarden, Stiens en Drachten. Voor je bruiloft, bedrijfsfeest of tuinfeest, vanaf 40 personen.',
    intro: 'Ook over de provinciegrens staan we graag. Van Drachten tot Stiens, met de keuken achterin.',
    verhaal: [
      'We kookten al in Leeuwarden, Stiens en Drachten. Een Drentse bus op een Fries feest: dat gaat prima samen, zolang het eten goed is.',
      'Omdat de bus uit Drenthe komt, plannen we in Friesland de reis en de opbouw iets ruimer in. Dat regelen wij, daar merk jij niets van.',
    ],
    plaatsen: ['Leeuwarden', 'Stiens', 'Drachten'],
    photo: photos.plank,
    faq: [
      { vraag: 'Komen jullie door heel Friesland?', antwoord: 'Friesland hoort bij ons werkgebied. Ligt je locatie ver weg of op een lastige plek? Vraag het gerust, dan kijken we wat er kan.' },
      { vraag: 'Is er een minimum aantal gasten voor Friesland?', antwoord: 'We komen overal vanaf 40 personen. Is je groep net wat kleiner? Vraag het gerust.' },
    ],
  },
];

// Every town from the owner's list of jobs that were actually done.
export const allPlaces = ['Stiens', 'Leeuwarden', 'Drachten', 'Leek', 'Roden', 'Assen', 'Rolde', 'Gieten', 'Gasselte', 'Gasselternijveen', 'Eeserveen', 'Drouwen', 'Een', 'De Wilp', 'Nooitgedacht', 'Oudemolen', 'Stadskanaal', 'Wedde'];

export const steps: Item[] = [
  { title: 'Jij belt, appt of vult iets in', text: 'Wat je handig vindt. Een richtdatum en een schatting van het aantal gasten is genoeg.' },
  { title: 'We gaan om tafel', text: 'Live of online. Wat vieren we, en wat past daarbij?' },
  { title: 'Je krijgt een voorstel', text: 'Met menu en prijs. Klopt het nog niet helemaal? Dan schuiven we door tot het wel klopt.' },
  { title: 'De luiken gaan open', text: 'We zetten de bus neer, koken ter plekke en laten alles netjes achter.' },
];

export const values: Item[] = [
  { title: 'Lokaal verkregen', text: 'We kopen zo dichtbij als het kan. Wat hier groeit en graast, dat koken we.' },
  { title: 'Eerlijke producten', text: 'Geen poespas en niets om te verbergen. Je proeft waar het vandaan komt.' },
  { title: 'Ambachtelijk bereid', text: 'Alles gaat ter plekke over het vuur, niet uit een zak van de groothandel.' },
];

export const nav = [
  { href: url('catering'), label: 'Catering' },
  { href: url('referenties'), label: 'Referenties' },
  { href: url('over-ons'), label: 'Over ons' },
  { href: url('contact'), label: 'Contact' },
];
