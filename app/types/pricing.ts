export interface PricingPlan {
  title: string;
  image: string;
  description: string;
  basePrice: number;
  features: string[];
  buttonText: string;
  buttonStyle: "primary" | "secondary";
  popular: boolean;
  link: string;
}

export interface PricingSection {
  title: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  description: string;
  plans: PricingPlan[];
  footer: {
    text: string;
    linkText: string;
  };
}

export interface PricingConfig {
  section: PricingSection;
}
