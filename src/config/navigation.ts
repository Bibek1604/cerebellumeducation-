export type NavItem = {
  label: string;
  href: string;
  /** When set, the header shows a dropdown populated from this data source. */
  menu?: "destinations" | "programmes";
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Study Destinations", href: "/destinations", menu: "destinations" },
  { label: "Programmes", href: "/programs", menu: "programmes" },
  { label: "Admission Process", href: "/admission-process" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  explore: [
    { label: "About Us", href: "/about" },
    { label: "Study Destinations", href: "/destinations" },
    { label: "Programmes", href: "/programs" },
    { label: "Scholarships", href: "/scholarships" },
  ],
  support: [
    { label: "Admission Process", href: "/admission-process" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "FAQs", href: "/faqs" },
    { label: "Book Free Counselling", href: "/book-counselling" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
};
