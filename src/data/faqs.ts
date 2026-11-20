import type { FaqItem } from "@/types/content";

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

/** `answer: null` = TODO(owner). Such questions are hidden everywhere until answered. */
type DraftFaq = { question: string; answer: string | null };
type DraftCategory = { id: string; title: string; items: DraftFaq[] };

const draftCategories: DraftCategory[] = [
  {
    id: "eligibility",
    title: "Eligibility & qualifications",
    items: [
      {
        question: "What qualifications are required for MBBS abroad?",
        answer:
          "Most universities require completion of higher secondary education (Grade 12, A-levels or equivalent) with Physics, Chemistry and Biology, plus minimum marks in those subjects. The exact thresholds are set by each university. Separately, your home-country medical regulator may set its own minimum marks or entrance-exam requirement for students who want to practise at home after graduating, you need to meet both.",
      },
      {
        question: "Is an entrance examination required?",
        answer:
          "It depends on two things. Some destination countries or universities set their own entrance tests or interviews (for example, the Philippines requires the NMAT for MD entry). Separately, some home-country regulators require you to qualify in a national entrance exam before studying medicine abroad if you want to be eligible for licensing at home. A counsellor will check both for your situation.",
      },
      {
        question: "Do I need IELTS or TOEFL?",
        answer:
          "Not always. Many universities assess English through their own interview or accept school results taught in English, while others ask for a recognised certificate. This is university-specific.",
      },
    ],
  },
  {
    id: "nepal",
    title: "Nepali students: MECEE & Eligibility Certificate",
    items: [
      {
        question: "Do I need MECEE-BL and an Eligibility Certificate to study MBBS abroad?",
        answer:
          "If you are a Nepali citizen, yes in most cases. Nepal's Medical Education Commission (MEC) states that an Eligibility Letter (Eligibility Certificate) must be obtained before going abroad for medical study, and eligibility is generally linked to passing its bachelor-level entrance exam, MECEE-BL. MEC's FAQ describes limited exceptions and states that registration with the professional council follows only after applying with the letter. Check the current rules on mec.gov.np before you apply.",
      },
      {
        question: "What happens when I return to Nepal after graduating?",
        answer:
          "Nepal Medical Council conducts a licensing examination before registration. Requirements can change, so confirm the current process on nmc.org.np.",
      },
    ],
  },
  {
    id: "destinations",
    title: "Destinations & universities",
    items: [
      {
        question: "Which countries offer medical education opportunities?",
        answer:
          "Popular destinations for international medical students include China, Bangladesh, India, Russia, Georgia, Kazakhstan and the Philippines. Each has a different entry route, programme length, language environment and cost profile. Our destination pages explain each one, and we help you compare them against your goals.",
      },
      {
        question: "How can I compare universities?",
        answer:
          "Start with the essentials: whether the university is listed in the World Directory of Medical Schools, whether its programme meets your home regulator's rules (duration, internship, medium of instruction), the quality and size of affiliated teaching hospitals, the language you'll need for clinical years, total cost, and student support. Rankings matter far less than these factors for a medical degree.",
      },
    ],
  },
  {
    id: "process",
    title: "Admissions & documents",
    items: [
      {
        question: "How does the admission process work?",
        answer:
          "Typically: counselling and profile assessment, choosing a destination and university, preparing and submitting an application, receiving an admission letter, preparing visa documents, and pre-departure preparation. Timelines vary by country and intake. Our Admission Process page walks through each step.",
      },
      {
        question: "What documents are generally required?",
        answer:
          "Usually a valid passport, academic transcripts and certificates (Grade 10 and 12 or equivalent), passport-sized photographs, and later a medical fitness certificate and police clearance for the visa. Some countries require documents to be attested, apostilled or recognised by their education ministry. The exact list is country- and university-specific, we give you a checklist for your chosen university.",
      },
    ],
  },
  {
    id: "costs",
    title: "Costs & finances",
    items: [
      {
        question: "What are the expected tuition and living costs?",
        answer:
          "Costs vary widely between countries, cities and universities, and change each year. Tuition, hostel, food, insurance, visa and travel all add up. We share current, university-confirmed figures during counselling rather than publishing estimates that may be out of date.",
      },
    ],
  },
  {
    id: "student-life",
    title: "Student life & support",
    items: [
      // TODO(owner): answer from your verified university information.
      { question: "What is the total cost of studying MBBS abroad, including living expenses?", answer: null },
      // TODO(owner): describe hostel and food arrangements at the universities you work with.
      { question: "What are hostel and food arrangements like?", answer: null },
      // TODO(owner): describe safety support you and the universities provide.
      { question: "Is it safe for students to live abroad?", answer: null },
      // TODO(owner): explain internship arrangements per destination and home-regulator rules.
      { question: "Where do I complete my internship?", answer: null },
    ],
  },
  {
    id: "licensing",
    title: "Recognition & licensing",
    items: [
      {
        question: "What should I know about medical licensing after graduation?",
        answer:
          "A medical degree does not automatically give you the right to practise. The regulator in the country where you want to work decides whether your degree is eligible and usually requires a licensing or screening examination. Some regulators also set conditions on course length, internship, and medium of instruction. Check your home regulator's current rules before choosing a university, no university or consultancy can guarantee a licence.",
      },
      {
        question: "Does Cerebellum guarantee admission or a visa?",
        answer:
          "No. Admission decisions are made by universities and visa decisions by governments. We help you prepare the strongest possible application and complete documentation, but we cannot guarantee outcomes.",
      },
      // TODO(owner): state your service fee and refund policy exactly as in your client agreement.
      { question: "What is your refund policy?", answer: null },
    ],
  },
];

/** Published categories: only answered questions, empty categories dropped. */
export const faqCategories: FaqCategory[] = draftCategories
  .map((c) => ({ ...c, items: c.items.filter((i): i is FaqItem => typeof i.answer === "string" && i.answer.length > 0) }))
  .filter((c) => c.items.length > 0);

const byQuestion = (q: string) => faqCategories.flatMap((c) => c.items).find((i) => i.question === q);

/** Questions surfaced on the homepage preview (skips any that are unpublished). */
export const homeFaqs: FaqItem[] = [
  "What qualifications are required for MBBS abroad?",
  "Do I need MECEE-BL and an Eligibility Certificate to study MBBS abroad?",
  "Which countries offer medical education opportunities?",
  "What are the expected tuition and living costs?",
  "What should I know about medical licensing after graduation?",
]
  .map(byQuestion)
  .filter((i): i is FaqItem => Boolean(i));

export const allFaqs = faqCategories.flatMap((c) => c.items);
