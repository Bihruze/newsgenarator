export type Language = 'English' | 'Japanese' | 'Thai' | 'French' | 'German' | 'Turkish' | 'Spanish' | 'Italian';

export type PromoMode = 'Full' | 'CTA Only' | 'No CTA';

export interface AppState {
  sourceUrls: string;
  keywords: string;
  linkDefinitions: string;
  newsAngle: string;
  numSections: number;
  additionalContent: string;
  promoCoin: string;
  customPromoText: string;
  promoMode: PromoMode;
  uploadType: 'Post' | 'Page';
  selectedLanguage: Language;
}

export interface GeneratedSection {
  heading: string;
  paragraphs: string[];
}

export interface GeneratedContent {
  intro: string;
  sections: GeneratedSection[]; // Changed from Record<string, GeneratedSection> to GeneratedSection[]
}

export interface GeneratedSEO {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  imagePrompt: string;
  altText: string;
}

export interface Source {
  domain: string;
  url: string;
}

export interface GeneratedArticle {
  title: string;
  content: GeneratedContent;
  seo: GeneratedSEO;
  sources: Source[];
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success';
}