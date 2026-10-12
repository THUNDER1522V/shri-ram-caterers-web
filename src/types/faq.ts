export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  faqs: FAQItem[];
}
