import type { Programme } from "@/types/content";

/**
 * Programmes. Set `enabled: false` for any programme the consultancy
 * does not currently offer through confirmed opportunities.
 */
const all: Programme[] = [
  {
    slug: "mbbs",
    enabled: true,
    name: "MBBS / General Medicine",
    shortName: "MBBS",
    category: "Medicine",
    icon: "stethoscope",
    seoDescription:
      "Study MBBS abroad: eligibility, duration, destinations, MECEE and licensing considerations, and how to choose the right medical university.",
    summary: "The primary medical degree for students who want to become doctors, taught in English abroad.",
    intro:
      "The Bachelor of Medicine, Bachelor of Surgery (MBBS), called General Medicine in some countries, is the primary medical qualification that leads towards practising as a doctor.",
    overview: [
      "MBBS programmes combine pre-clinical sciences such as anatomy, physiology and biochemistry with para-clinical subjects and supervised clinical training in teaching hospitals.",
      "Abroad, the degree title, length and internship arrangements vary by country. Those details matter, because your home-country regulator may set conditions on them before you can sit its licensing examination.",
    ],
    duration: "Typically 5–6 years including or followed by an internship, depending on the country",
    eligibility: [
      "Higher secondary (Grade 12) or equivalent with Physics, Chemistry and Biology",
      "Minimum marks in science subjects set by the university and, where relevant, your home regulator",
      "Entrance examination eligibility where required by your home regulator or destination country",
    ],
    academic: [
      "Strong grades in Biology and Chemistry",
      "English proficiency for English-taught programmes",
      "Some universities set interviews or entrance assessments",
    ],
    considerations: [
      "Check your home regulator's rules on course duration, internship and medium of instruction before applying",
      "Clinical years may require learning the local language",
      "Plan for licensing examinations after graduation, as no degree guarantees a licence",
    ],
    faqs: [
      {
        question: "Is MBBS abroad recognised in my country?",
        answer:
          "Recognition is decided by your home-country medical regulator, not by the university or consultancy. Check the regulator's current rules and the university's World Directory of Medical Schools listing before you apply.",
      },
      {
        question: "What is the difference between MBBS, MD and General Medicine?",
        answer:
          "They are titles for primary medical degrees used in different countries. The title matters less than whether the programme meets your home regulator's requirements.",
      },
    ],
  },
  {
    slug: "md",
    enabled: true,
    name: "Doctor of Medicine (MD)",
    shortName: "MD",
    category: "Medicine",
    icon: "graduation",
    seoDescription:
      "Doctor of Medicine (MD) abroad as a primary medical degree in Georgia and the Philippines: eligibility, duration and key considerations.",
    summary: "A primary medical degree titled MD in countries such as Georgia and the Philippines.",
    intro:
      "In several countries the primary medical degree is called Doctor of Medicine (MD). This is a first medical qualification, not the postgraduate MD specialisation used in South Asia.",
    overview: [
      "In Georgia the MD is a one-cycle programme taken directly after secondary school. In the Philippines it follows a pre-medical bachelor's degree, in the American style.",
      "Both routes include supervised clinical training. The total study length and entry route differ, so compare them against your goals and your home regulator's rules.",
    ],
    duration: "Georgia: typically 6 years. Philippines: pre-med degree plus a 4-year MD",
    eligibility: [
      "Direct-entry MD (e.g. Georgia): higher secondary qualification with Biology and Chemistry",
      "Graduate-entry MD (e.g. Philippines): pre-medical bachelor's degree and an admission test such as the NMAT",
    ],
    academic: ["Strong science background", "English proficiency", "Entrance test or interview where required"],
    considerations: [
      "Don't confuse the primary MD with a postgraduate MD",
      "Total study duration differs between direct-entry and graduate-entry routes",
      "Home regulator requirements apply exactly as for MBBS",
    ],
    faqs: [
      {
        question: "Is an MD from Georgia equivalent to MBBS?",
        answer:
          "Both are primary medical degrees. Whether a specific programme qualifies you for licensing depends on your home regulator's rules.",
      },
    ],
  },
  {
    slug: "dentistry",
    enabled: true,
    name: "Dentistry (BDS / DDS)",
    shortName: "Dentistry",
    category: "Dental",
    icon: "smile",
    seoDescription:
      "Study dentistry (BDS/DDS) abroad: eligibility, typical duration, available destinations and licensing considerations for students.",
    summary: "Professional dental degrees combining biomedical science with hands-on clinical practice.",
    intro:
      "Dentistry programmes, titled BDS or DDS depending on the country, train students in oral health, dental surgery and patient care.",
    overview: [
      "Dental programmes combine biomedical sciences with pre-clinical laboratory work and supervised clinical practice treating patients.",
      "As with medicine, practising after graduation depends on the dental regulator in the country where you intend to work.",
    ],
    duration: "Typically 4–5 years plus internship, depending on the country",
    eligibility: ["Higher secondary qualification with Physics, Chemistry and Biology", "Minimum marks set by the university"],
    academic: ["Strong science grades", "Manual dexterity is assessed by some programmes", "English proficiency"],
    considerations: [
      "Check your home dental regulator's requirements for foreign graduates",
      "Clinical training may require local language skills",
    ],
    faqs: [
      {
        question: "Do dental graduates need a licensing exam?",
        answer:
          "In most countries, yes. Requirements are set by the dental or medical regulator where you intend to practise.",
      },
    ],
  },
  {
    slug: "nursing",
    enabled: true,
    name: "Nursing",
    shortName: "Nursing",
    category: "Allied health",
    icon: "heart",
    seoDescription:
      "Study nursing abroad: bachelor's programmes, eligibility, duration, destinations and nurse registration considerations for international students.",
    summary: "Degree programmes preparing students for professional nursing practice and patient care.",
    intro:
      "Bachelor's-level nursing programmes prepare students for professional practice in hospitals and community healthcare.",
    overview: [
      "Nursing degrees cover health sciences, nursing theory and extensive supervised clinical placements.",
      "Registration as a nurse is controlled by the nursing regulator in the country where you plan to work, and usually requires passing its examination.",
    ],
    duration: "Typically 4 years for a bachelor's degree",
    eligibility: ["Higher secondary qualification with science subjects", "Minimum marks set by the institution"],
    academic: ["Science background (Biology is usually required)", "English proficiency"],
    considerations: [
      "Check nurse-registration rules where you intend to work",
      "Clinical placements may require local language skills",
    ],
    faqs: [
      {
        question: "Can I work abroad after a nursing degree?",
        answer:
          "Possibly, but each country's nursing regulator sets its own registration and examination requirements. No degree guarantees registration or employment.",
      },
    ],
  },
  {
    slug: "pharmacy",
    enabled: true,
    name: "Pharmacy",
    shortName: "Pharmacy",
    category: "Allied health",
    icon: "pill",
    seoDescription:
      "Study pharmacy abroad: degree types, eligibility, duration and pharmacist registration considerations for international students.",
    summary: "Study medicines, pharmacology and pharmaceutical practice for careers in healthcare and industry.",
    intro:
      "Pharmacy degrees focus on medicines: how they are developed, how they work, and how they are dispensed safely to patients.",
    overview: [
      "Courses cover pharmaceutical chemistry, pharmacology, pharmaceutics and pharmacy practice, with laboratory work and placements.",
      "Practising as a pharmacist requires registration with the pharmacy regulator where you intend to work.",
    ],
    duration: "Typically 4–5 years depending on the degree and country",
    eligibility: ["Higher secondary qualification with Chemistry and Biology or Mathematics", "Minimum marks set by the institution"],
    academic: ["Strong Chemistry grades", "English proficiency"],
    considerations: ["Check pharmacist registration rules where you plan to work"],
    faqs: [
      {
        question: "Is a pharmacy degree the same everywhere?",
        answer:
          "No. Degree titles and lengths vary (for example B.Pharm and Pharm.D). Check which qualification your target regulator accepts.",
      },
    ],
  },
  {
    slug: "biomedical-sciences",
    enabled: true,
    name: "Biomedical Sciences",
    shortName: "Biomedical",
    category: "Health sciences",
    icon: "microscope",
    seoDescription:
      "Study Biomedical Sciences abroad: laboratory-focused degrees, eligibility, typical duration and how they differ from an MBBS degree.",
    summary: "Laboratory-focused study of human biology and disease for research and diagnostic careers.",
    intro:
      "Biomedical Sciences explores the biology of human health and disease, with a strong emphasis on laboratory and research skills.",
    overview: [
      "Programmes cover cell biology, genetics, microbiology, immunology and laboratory diagnostics.",
      "Biomedical Sciences is not a medical degree and does not lead directly to practising as a doctor, but it can open research, laboratory and further-study pathways.",
    ],
    duration: "Typically 3–4 years for a bachelor's degree",
    eligibility: ["Higher secondary qualification with Biology and Chemistry", "Minimum marks set by the institution"],
    academic: ["Strong science grades", "English proficiency"],
    considerations: [
      "It is not a substitute for MBBS/MD if your goal is clinical practice",
      "Graduate-entry medicine routes have their own separate requirements",
    ],
    faqs: [
      {
        question: "Can Biomedical Sciences lead to medicine?",
        answer:
          "In some countries, graduate-entry medical programmes accept science graduates. Requirements are strict and vary, so plan carefully with a counsellor.",
      },
    ],
  },
];

/** Every programme including disabled ones (the Admin Panel defaults). */
export const allProgrammes = all;

export const programmes = all.filter((p) => p.enabled);

export function getProgramme(slug: string) {
  return programmes.find((p) => p.slug === slug);
}
