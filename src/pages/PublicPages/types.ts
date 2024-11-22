export interface Template {
  id: string;
  title: string;
  description: string;
  image?: string;
  workflowOrderedList?: string[];
  links?: Link[];
}

export interface BagpipesTemplate extends Template {
  workflowOrderedList?: string[];
  links: Link[];
}

export interface UITemplate extends Template {
  links: Link[];
  image: string;
}

export interface Feature {
  feature: string;
  description: string;
}

export interface HowTo {
  title: string;
  image: string;
  description: string;
  links?: Link[];
}

export interface Link {
  title: string;
  url: string;
}

export interface Hashtag {
  backgroundColor: string;
  id: string;
  tag: string;
  color: string;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  title: string;
  image: string;
  description: string;
  templates: string[]; // Array of Template IDs
}

export interface Community {
  id: string;
  logo: string;
  name: string;
  title: string;
  description: string;
  url: string;
  templates: {
    bagpipes: BagpipesTemplate[];
    ui: UITemplate[];
  };
  howTos: HowTo[];
  features: Feature[];
  hashTags: string[];
  mostActiveCreators: string[];
  uiTemplateShowcase?: boolean;
}
