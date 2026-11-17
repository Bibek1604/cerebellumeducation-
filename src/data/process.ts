export type ProcessStep = {
  title: string;
  short: string;
  detail: string;
  youProvide: string[];
};

export const admissionSteps: ProcessStep[] = [
  {
    title: "Initial Counselling",
    short: "Understand your goals, budget and timeline.",
    detail:
      "A one-to-one conversation with a counsellor about your ambitions, academic background, budget, family priorities and preferred intake. No commitment required.",
    youProvide: ["Your academic results so far", "Questions from you and your family"],
  },
  {
    title: "Academic Profile Assessment",
    short: "Check eligibility against university and regulator rules.",
    detail:
      "We review your grades and subjects against university requirements and, where relevant, your home regulator's rules for studying medicine abroad.",
    youProvide: ["Grade 10 and 12 marksheets (or equivalent)", "Entrance exam results, if any"],
  },
  {
    title: "Destination Selection",
    short: "Compare countries side by side.",
    detail:
      "We compare destinations on programme structure, language environment, recognition considerations, living conditions and total cost so you can choose with confidence.",
    youProvide: ["Your priorities: cost, language, climate, distance"],
  },
  {
    title: "University Selection",
    short: "Shortlist universities that fit your profile.",
    detail:
      "Together we shortlist universities, checking official listings, teaching hospitals and programme details directly from official sources.",
    youProvide: ["Feedback on the shortlist"],
  },
  {
    title: "Application Submission",
    short: "Prepare and submit a complete application.",
    detail:
      "We guide you through forms, document preparation, translations and attestation so your application is complete and submitted on time.",
    youProvide: ["Passport", "Academic documents", "Photographs"],
  },
  {
    title: "Admission Confirmation",
    short: "Review your offer and next steps.",
    detail:
      "When the university issues an admission letter we explain its terms, fee schedule and conditions before you accept.",
    youProvide: ["Acceptance and any required deposit, paid directly as instructed by the university"],
  },
  {
    title: "Visa Preparation",
    short: "Assemble your student-visa file.",
    detail:
      "We help you prepare the documents for your student visa application. The visa decision is made solely by the destination country's authorities.",
    youProvide: ["Medical fitness certificate", "Police clearance", "Financial documents, if required"],
  },
  {
    title: "Pre-Departure Guidance",
    short: "Arrive prepared and confident.",
    detail:
      "Briefings on travel, packing, accommodation, banking, local culture, health insurance and what to expect in your first weeks.",
    youProvide: ["Travel dates"],
  },
];

export const services = [
  {
    title: "Personalised Counselling",
    description: "One-to-one guidance shaped around your grades, goals, budget and family priorities.",
  },
  {
    title: "University Selection Assistance",
    description: "Shortlists built from official information, not rankings or sales targets.",
  },
  {
    title: "Application Guidance",
    description: "Forms, statements and deadlines handled carefully and on time.",
  },
  {
    title: "Documentation Support",
    description: "Checklists, translations, attestation and equivalence explained step by step.",
  },
  {
    title: "Visa Process Guidance",
    description: "Help assembling a complete, accurate student-visa file.",
  },
  {
    title: "Pre-Departure Assistance",
    description: "Practical briefings so you land prepared: travel, money, housing and culture.",
  },
  {
    title: "Continued Student Support",
    description: "We stay in touch after you arrive, so you're never on your own.",
  },
];
