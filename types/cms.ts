export type Settings = Record<string, string | number | boolean>;

export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  active?: boolean;
  sort?: number;
};

export type Tariff = {
  id: string;
  category_id: string;
  name: string;
  badge?: string;
  price: number;
  old_price?: number | string;
  description: string;
  features: string[];
  popular?: boolean;
  gradient?: string;
  active?: boolean;
  sort?: number;
};

export type Service = {
  id: string;
  tariff_id: string;
  name: string;
  description?: string;
  price: number;
  type?: string;
  active?: boolean;
  sort?: number;
};

export type Testimonial = {
  id: string;
  name: string;
  company?: string;
  text: string;
  rating: number;
  active?: boolean;
  sort?: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  active?: boolean;
  sort?: number;
};

export type Stat = {
  id: string;
  title: string;
  value: number | string;
  suffix?: string;
  active?: boolean;
  sort?: number;
};

export type Problem = {
  id: string;
  pain: string;
  solution: string;
  active?: boolean;
  sort?: number;
};

export type ProcessStep = {
  id: string;
  title: string;
  text: string;
  active?: boolean;
  sort?: number;
};

export type CmsData = {
  settings: Settings;
  categories: Category[];
  tariffs: Tariff[];
  services: Service[];
  testimonials: Testimonial[];
  faq: Faq[];
  stats: Stat[];
  problems: Problem[];
  process: ProcessStep[];
};

export type LeadPayload = {
  name: string;
  company: string;
  phone: string;
  telegram: string;
  industry: string;
  tariff: string;
  services: string[];
  total: number;
  comment: string;
};
