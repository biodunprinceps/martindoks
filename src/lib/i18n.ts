/**
 * Multi-language Support (i18n)
 * Basic internationalization for English and local languages
 */

export type Language = 'en' | 'yo' | 'ig' | 'ha'; // English, Yoruba, Igbo, Hausa

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.properties': 'Properties',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.mortgage': 'Mortgage Calculator',
    'nav.brandAssociates': 'Brand Associates',
    
    // Common
    'common.view': 'View',
    'common.readMore': 'Read More',
    'common.learnMore': 'Learn More',
    'common.contact': 'Contact Us',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    
    // Property
    'property.price': 'Price',
    'property.location': 'Location',
    'property.bedrooms': 'Bedrooms',
    'property.bathrooms': 'Bathrooms',
    'property.squareFeet': 'Square Feet',
    'property.status': 'Status',
    'property.type': 'Type',
    'property.inquire': 'Inquire About This Property',
    'property.scheduleViewing': 'Schedule a Viewing',
    'property.viewDetails': 'View Details',
    
    // Contact
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    
    // Alerts
    'alerts.subscribe': 'Subscribe to Alerts',
    'alerts.newProperties': 'New Properties',
    'alerts.priceDrops': 'Price Drops',
    'alerts.statusChanges': 'Status Changes',
    
    // Pages
    'page.home': 'Home',
    'page.about': 'About Us',
    'page.services': 'Services',
    'page.portfolio': 'Portfolio',
    'page.listings': 'Listings',
    'page.team': 'Team',
    'page.blog': 'Blog',
    'page.testimonials': 'Testimonials',
    'page.contact': 'Contact Us',
    'page.calculator': 'Mortgage Calculator',
    'page.virtualTour': 'Virtual Tour',
    
    // Footer
    'footer.description': 'Your trusted partner in real estate. We help you find your dream home.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.followUs': 'Follow Us',
    'footer.rights': 'All rights reserved.',
    
    // Hero
    'hero.title': 'Find Your Dream Home',
    'hero.subtitle': 'Discover premium properties in Nigeria',
    'hero.cta': 'Explore Properties',
    
    // Mortgage Calculator
    'calculator.title': 'Mortgage Calculator',
    'calculator.subtitle': 'Calculate your monthly mortgage payments',
  },
  yo: {
    // Navigation
    'nav.home': 'Ilé',
    'nav.about': 'Nipa',
    'nav.properties': 'Ohun-ini',
    'nav.services': 'Iṣẹ',
    'nav.blog': 'Blog',
    'nav.contact': 'Kan si wa',
    'nav.mortgage': 'Ẹrọ Iṣiro Mortgage',
    'nav.brandAssociates': 'Awọn Alabaṣepọ Brand',
    
    // Common
    'common.view': 'Wo',
    'common.readMore': 'Ka siwaju',
    'common.learnMore': 'Kọ siwaju',
    'common.contact': 'Kan si wa',
    'common.submit': 'Fi ranṣẹ',
    'common.cancel': 'Fagilee',
    'common.save': 'Fi pamọ',
    'common.delete': 'Paarẹ',
    'common.edit': 'Ṣatunkọ',
    'common.close': 'Pa',
    
    // Property
    'property.price': 'Iye owo',
    'property.location': 'Ibi',
    'property.bedrooms': 'Yara ibusun',
    'property.bathrooms': 'Yara wẹwẹ',
    'property.squareFeet': 'Square Feet',
    'property.status': 'Ipo',
    'property.type': 'Iru',
    'property.inquire': 'Beere nipa ohun-ini yii',
    'property.scheduleViewing': 'Ṣeto lati wo',
    'property.viewDetails': 'Wo Awọn alaye',
    
    // Pages
    'page.home': 'Ilé',
    'page.about': 'Nipa wa',
    'page.services': 'Iṣẹ',
    'page.portfolio': 'Portfolio',
    'page.listings': 'Awọn ohun-ini',
    'page.team': 'Ẹgbẹ',
    'page.blog': 'Blog',
    'page.testimonials': 'Awọn ifiranṣẹ',
    'page.contact': 'Kan si wa',
    'page.calculator': 'Ẹrọ Iṣiro Mortgage',
    'page.virtualTour': 'Irin-ajo Foju',
    
    // Footer
    'footer.description': 'Ọrẹ ti o ni igbagbọ ni ile-ẹkọ. A ṣe iranlọwọ fun ọ lati ri ile ala rẹ.',
    'footer.quickLinks': 'Awọn ọna asopọ ni kiakia',
    'footer.contact': 'Kan si',
    'footer.followUs': 'Tọpa wa',
    'footer.rights': 'Gbogbo awọn ẹtọ ti a fipamọ.',
    
    // Hero
    'hero.title': 'Ri Ile Ala Rẹ',
    'hero.subtitle': 'Ṣe awari awọn ohun-ini to ga julọ ni Nigeria',
    'hero.cta': 'Ṣe Awari Awọn Ohun-ini',
    
    // Mortgage Calculator
    'calculator.title': 'Ẹrọ Iṣiro Mortgage',
    'calculator.subtitle': 'Ṣe iṣiro awọn owo oṣu rẹ fun mortgage',
  },
  ig: {
    // Navigation
    'nav.home': 'Ụlọ',
    'nav.about': 'Banyere',
    'nav.properties': 'Ihe onwunwe',
    'nav.services': 'Ọrụ',
    'nav.blog': 'Blog',
    'nav.contact': 'Kpọtụrụ anyị',
    'nav.mortgage': 'Ihe ngụkọta ego',
    'nav.brandAssociates': 'Ndị Mmekọ Brand',
    
    // Common
    'common.view': 'Lelee',
    'common.readMore': 'Gụọkwuo',
    'common.learnMore': 'Mụtakwuo',
    'common.contact': 'Kpọtụrụ anyị',
    'common.submit': 'Ziga',
    'common.cancel': 'Kagbuo',
    'common.save': 'Chekwaa',
    'common.delete': 'Hichapụ',
    'common.edit': 'Dezie',
    'common.close': 'Mechie',
    
    // Property
    'property.price': 'Ọnụ ego',
    'property.location': 'Ebe',
    'property.bedrooms': 'Ime ụlọ',
    'property.bathrooms': 'Ime ụlọ ịsa ahụ',
    'property.squareFeet': 'Square Feet',
    'property.status': 'Ọnọdụ',
    'property.type': 'Ụdị',
    'property.inquire': 'Jụọ banyere ihe onwunwe a',
    'property.scheduleViewing': 'Hazie ilele',
    'property.viewDetails': 'Lelee nkọwa',
    
    // Pages
    'page.home': 'Ụlọ',
    'page.about': 'Banyere anyị',
    'page.services': 'Ọrụ',
    'page.portfolio': 'Portfolio',
    'page.listings': 'Ihe onwunwe',
    'page.team': 'Otu',
    'page.blog': 'Blog',
    'page.testimonials': 'Nkwupụta',
    'page.contact': 'Kpọtụrụ anyị',
    'page.calculator': 'Ihe ngụkọta ego',
    'page.virtualTour': 'Njem Virtual',
    
    // Footer
    'footer.description': 'Onye ntụkwasị obi gị na ụlọ. Anyị na-enyere gị aka ịchọta ụlọ nrọ gị.',
    'footer.quickLinks': 'Njikọ ngwa ngwa',
    'footer.contact': 'Kpọtụrụ',
    'footer.followUs': 'Soro anyị',
    'footer.rights': 'Ikike niile echekwara.',
    
    // Hero
    'hero.title': 'Chọta Ụlọ Nrọ Gị',
    'hero.subtitle': 'Chọpụta ụlọ dị elu na Nigeria',
    'hero.cta': 'Chọpụta Ihe Onwunwe',
    
    // Mortgage Calculator
    'calculator.title': 'Ihe ngụkọta ego',
    'calculator.subtitle': 'Gbakọọ ụgwọ ọnwa gị maka mortgage',
  },
  ha: {
    // Navigation
    'nav.home': 'Gida',
    'nav.about': 'Game da',
    'nav.properties': 'Dukiya',
    'nav.services': 'Ayyuka',
    'nav.blog': 'Blog',
    'nav.contact': 'Tuntuɓe mu',
    'nav.mortgage': 'Kalkuleta Mortgage',
    'nav.brandAssociates': 'Abokan Brand',
    
    // Common
    'common.view': 'Duba',
    'common.readMore': 'Karanta ƙari',
    'common.learnMore': 'Koyi ƙari',
    'common.contact': 'Tuntuɓe mu',
    'common.submit': 'Aika',
    'common.cancel': 'Soke',
    'common.save': 'Ajiye',
    'common.delete': 'Share',
    'common.edit': 'Gyara',
    'common.close': 'Rufe',
    
    // Property
    'property.price': 'Farashin',
    'property.location': 'Wuri',
    'property.bedrooms': 'Dakunan kwana',
    'property.bathrooms': 'Dakunan wanka',
    'property.squareFeet': 'Square Feet',
    'property.status': 'Matsayi',
    'property.type': 'Nau\'in',
    'property.inquire': 'Tambayi game da wannan dukiya',
    'property.scheduleViewing': 'Shirya dubawa',
    'property.viewDetails': 'Duba bayanai',
    
    // Pages
    'page.home': 'Gida',
    'page.about': 'Game da mu',
    'page.services': 'Ayyuka',
    'page.portfolio': 'Portfolio',
    'page.listings': 'Dukiya',
    'page.team': 'Ƙungiya',
    'page.blog': 'Blog',
    'page.testimonials': 'Shaidun',
    'page.contact': 'Tuntuɓe mu',
    'page.calculator': 'Kalkuleta Mortgage',
    'page.virtualTour': 'Tafiya Virtual',
    
    // Footer
    'footer.description': 'Abokin amana a cikin gidaje. Muna taimaka muku samun gidan mafarkinku.',
    'footer.quickLinks': 'Hanyoyin sauri',
    'footer.contact': 'Tuntuɓe',
    'footer.followUs': 'Bi mu',
    'footer.rights': 'Duk haƙƙoƙin an keɓe.',
    
    // Hero
    'hero.title': 'Nemo Gidan Mafarkinku',
    'hero.subtitle': 'Gano manyan dukiya a Najeriya',
    'hero.cta': 'Bincika Dukiya',
    
    // Mortgage Calculator
    'calculator.title': 'Kalkuleta Mortgage',
    'calculator.subtitle': 'Ƙididdige biyan kuɗi na wata-wata',
  },
};

let currentLanguage: Language = 'en';

/**
 * Set the current language
 */
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    currentLanguage = lang;
    localStorage.setItem('mdh_language', lang);
  }
}

/**
 * Get the current language
 */
export function getLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mdh_language') as Language;
    if (stored && translations[stored]) {
      return stored;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'yo' || browserLang === 'ig' || browserLang === 'ha') {
      return browserLang as Language;
    }
  }
  return currentLanguage;
}

/**
 * Translate a key
 */
export function t(key: string, fallback?: string, forceLang?: Language): string {
  const lang = forceLang || getLanguage();
  return translations[lang]?.[key] || translations.en[key] || fallback || key;
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Array<{ code: Language; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'yo', name: 'Yorùbá' },
    { code: 'ig', name: 'Igbo' },
    { code: 'ha', name: 'Hausa' },
  ];
}
