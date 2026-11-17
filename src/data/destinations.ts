import type { Destination } from "@/types/content";
import { globalSources } from "./sources";

/**
 * Study destinations.
 *
 * CONTENT POLICY
 * - Set `enabled: false` for any country the consultancy does not actively
 *   support. Disabled destinations disappear from every page, menu, form
 *   and the sitemap.
 * - Content here is general guidance. Entry rules, durations and
 *   recognition can change; review each entry before every intake.
 * - `indicativeCosts` stays null until figures are verified for the current intake.
 */
const all: Destination[] = [
  {
    slug: "china",
    enabled: true,
    name: "China",
    code: "CN",
    capital: "Beijing",
    coordinates: "39.90° N · 116.40° E",
    tagline: "Established English-taught MBBS programmes at large teaching universities",
    seoDescription:
      "Study MBBS in China: English-taught programmes at authorised universities, eligibility, Mandarin requirements and recognition guidance for students.",
    summary:
      "China admits international students to English-taught MBBS programmes at universities authorised by its Ministry of Education, with clinical training in affiliated hospitals.",
    overview: [
      "China has hosted international medical students for many years. Universities that teach MBBS in English to international students must be authorised by the Ministry of Education of the People's Republic of China, which publishes guidance on the programme.",
      "Programmes typically combine pre-clinical sciences with clinical rotations in university-affiliated hospitals. Because patients speak Chinese, students also study Mandarin during the course, and Chinese language proficiency is usually required before or during clinical training.",
    ],
    programmes: ["mbbs"],
    medium: "English for the authorised MBBS track; Mandarin is studied alongside",
    duration: "Typically 6 years, including a clinical internship year, confirm with each university",
    eligibility: [
      "Completion of higher secondary education (Grade 12 / A-levels or equivalent) with Physics, Chemistry and Biology",
      "Minimum marks in science subjects as set by each university and, where applicable, by your home-country regulator",
      "Minimum age requirements set by the university",
      "Valid passport and medical fitness documentation",
    ],
    academic: [
      "Strong results in Biology, Chemistry and Physics",
      "Some universities may hold an interview or entrance assessment",
      "Students planning to practise at home should check their regulator's entry criteria (for example, entrance-exam eligibility) before applying",
    ],
    language: [
      "Proof of English ability may be requested, and requirements vary by university",
      "Mandarin (HSK) study is part of the programme; specific HSK levels may be required for clinical rotations or graduation",
    ],
    admissionNotes: [
      "Applications usually open several months before the September intake",
      "An admission letter and the JW201/JW202 visa form are issued by the university for the student visa (X1)",
    ],
    // TODO(owner): verified fee figures for the current intake
    indicativeCosts: null,
    recognition: [
      "Check that the university appears in the World Directory of Medical Schools and is authorised by China's Ministry of Education for English-taught MBBS.",
      "Your home-country medical regulator decides whether a foreign degree qualifies you for its licensing examination or registration. Requirements such as course duration, internship location and medium of instruction differ by country.",
    ],
    sources: [
      {
        label: "Ministry of Education of the People's Republic of China",
        href: "http://en.moe.gov.cn/",
        publisher: "Government of China",
      },
      {
        label: "Campus China: China Scholarship Council portal",
        href: "https://www.campuschina.org/",
        publisher: "China Scholarship Council",
      },
      globalSources.wdoms,
    ],
    faqs: [
      {
        question: "Do I need to learn Chinese to study MBBS in China?",
        answer:
          "Teaching on the authorised MBBS track is in English, but Mandarin is studied during the programme because clinical work involves Chinese-speaking patients. Many universities set an HSK level for clinical rotations or graduation, confirm the exact requirement with the university.",
      },
      {
        question: "When is the main intake?",
        answer:
          "Most universities admit international MBBS students for a September intake, with applications opening months earlier. Exact dates are set by each university.",
      },
    ],
    art: ["#1d5fb8", "#262b5c"],
  },
  {
    slug: "bangladesh",
    enabled: true,
    name: "Bangladesh",
    code: "BD",
    capital: "Dhaka",
    coordinates: "23.81° N · 90.41° E",
    tagline: "English-medium MBBS and BDS with a curriculum familiar to South Asian students",
    seoDescription:
      "Study MBBS or BDS in Bangladesh: English-medium programmes regulated by BMDC, eligibility, admission steps and recognition guidance.",
    summary:
      "Bangladesh offers English-medium MBBS and BDS programmes regulated by the Bangladesh Medical and Dental Council, with a disease profile and curriculum familiar to students from the region.",
    overview: [
      "Medical colleges in Bangladesh teach in English and follow a curriculum regulated by the Bangladesh Medical and Dental Council (BMDC). International admissions are coordinated through the Directorate General of Medical Education (DGME), which publishes requirements each session.",
      "The MBBS course is followed by a compulsory internship. Students gain clinical exposure in teaching hospitals with conditions similar to those seen across South Asia.",
    ],
    programmes: ["mbbs", "dentistry"],
    medium: "English",
    duration: "MBBS: typically 5 years plus a 1-year internship. BDS: typically 4 years plus internship",
    eligibility: [
      "Higher secondary qualification (or equivalent) with Biology, Chemistry and Physics",
      "Minimum grade/GPA requirements published by DGME for foreign students in each session",
      "Year-of-passing restrictions may apply",
      "Equivalence certificate and documents attested as specified by the authorities",
    ],
    academic: [
      "Grade thresholds are set per session by the authorities, and counsellors check the current notice before you apply",
      "Check your home-country regulator's requirements before choosing a college",
    ],
    language: ["Teaching is in English", "Basic Bangla is helpful for patient interaction during clinical years"],
    admissionNotes: [
      "International seats are allocated through official procedures announced each session",
      "Document attestation and equivalence can take time, so start early",
    ],
    // TODO(owner): verified fee figures for the current intake
    indicativeCosts: null,
    recognition: [
      "Colleges must be recognised by the Bangladesh Medical and Dental Council.",
      "Licensing back home depends on your home regulator's rules, so check them before applying.",
    ],
    sources: [
      {
        label: "Bangladesh Medical and Dental Council (BMDC)",
        href: "https://bmdc.org.bd/",
        publisher: "Bangladesh",
      },
      {
        label: "Directorate General of Medical Education (DGME)",
        href: "https://dgme.gov.bd/",
        publisher: "Government of Bangladesh",
      },
      globalSources.wdoms,
    ],
    faqs: [
      {
        question: "Is the MBBS course in Bangladesh taught in English?",
        answer:
          "Yes. Teaching and examinations are in English. Some Bangla helps when talking to patients during clinical training.",
      },
      {
        question: "Who sets the minimum grades for foreign students?",
        answer:
          "Requirements for foreign students are published by the Directorate General of Medical Education for each academic session, and individual colleges may add their own criteria.",
      },
    ],
    art: ["#14806b", "#262b5c"],
  },
  {
    slug: "india",
    enabled: true,
    name: "India",
    code: "IN",
    capital: "New Delhi",
    coordinates: "28.61° N · 77.21° E",
    tagline: "A large medical education system regulated by the National Medical Commission",
    seoDescription:
      "Study MBBS in India: NMC-regulated programmes, entrance-exam routes for international students, eligibility and what to check first.",
    summary:
      "India has one of the world's largest medical education systems, regulated by the National Medical Commission. Admission routes for international students depend on nationality and current regulations.",
    overview: [
      "Medical education in India is regulated by the National Medical Commission (NMC). The MBBS course includes a compulsory rotating internship and is taught in English.",
      "Admission routes for foreign nationals, NRIs and OCI cardholders differ, and entrance examination requirements (such as NEET-UG) apply to many applicants. Rules are updated by the authorities, so we confirm the route that applies to your nationality before you apply.",
    ],
    programmes: ["mbbs", "dentistry", "nursing", "pharmacy"],
    medium: "English",
    duration: "MBBS: 5.5 years including a 1-year compulsory rotating internship",
    eligibility: [
      "Higher secondary qualification with Physics, Chemistry, Biology and English",
      "Entrance examination requirements (for example NEET-UG) as applicable to your nationality and admission route",
      "Minimum age requirements set by the regulator",
    ],
    academic: [
      "Minimum aggregate marks in science subjects as specified by the regulator",
      "Seat availability for international students varies by institution and admission route",
    ],
    language: ["Teaching is in English", "Local language skills help with patient communication in clinical years"],
    admissionNotes: [
      "International admission routes are specific to nationality, and we confirm the current route before applying",
      "Counselling and seat allocation follow official schedules",
    ],
    // TODO(owner): verified fee figures for the current intake
    indicativeCosts: null,
    recognition: [
      "Check that the college is recognised by the National Medical Commission.",
      "Graduates who plan to practise outside India must meet their home regulator's requirements.",
    ],
    sources: [
      {
        label: "National Medical Commission (NMC)",
        href: "https://www.nmc.org.in/",
        publisher: "Government of India",
      },
      globalSources.wdoms,
    ],
    faqs: [
      {
        question: "Do international students need NEET to study MBBS in India?",
        answer:
          "It depends on your nationality and admission route. Many applicants must qualify in NEET-UG, but the rules for foreign nationals, NRIs and OCI cardholders differ and are updated by the authorities. A counsellor will confirm the current requirement for your case.",
      },
    ],
    art: ["#c2611a", "#262b5c"],
  },
  {
    slug: "russia",
    enabled: true,
    name: "Russia",
    code: "RU",
    capital: "Moscow",
    coordinates: "55.76° N · 37.62° E",
    tagline: "Six-year General Medicine programmes at long-established state universities",
    seoDescription:
      "Study General Medicine (MBBS) in Russia: six-year programmes, English and Russian tracks, eligibility, admission and recognition tips.",
    summary:
      "Russian state medical universities offer six-year General Medicine programmes, many with English-medium teaching in the early years and Russian language training for clinical work.",
    overview: [
      "Russia's General Medicine programme (often marketed internationally as MBBS or MD) is a six-year specialist degree. Many state universities have taught international students for decades.",
      "English-medium tracks are common, but Russian language study is included because clinical rotations involve Russian-speaking patients. Some universities also offer preparatory language years for students who wish to study fully in Russian.",
    ],
    programmes: ["mbbs"],
    medium: "English-medium or Russian-medium tracks, depending on the university",
    duration: "Typically 6 years (an additional preparatory language year is optional at some universities)",
    eligibility: [
      "Higher secondary qualification with Biology and Chemistry (Physics often also required)",
      "Minimum marks set by the university, plus any requirement from your home-country regulator",
      "Some universities hold entrance tests or interviews",
    ],
    academic: [
      "Strong grades in Biology and Chemistry",
      "Document legalisation/attestation as required by the university",
    ],
    language: [
      "English proficiency for English-medium tracks, usually assessed by the university",
      "Russian language is studied throughout the course for clinical communication",
    ],
    admissionNotes: [
      "Main intake is usually in September",
      "The university issues an invitation letter required for the student visa",
    ],
    // TODO(owner): verified fee figures for the current intake
    indicativeCosts: null,
    recognition: [
      "Verify the university's listing in the World Directory of Medical Schools.",
      "Home-country regulators may have specific rules on course duration, internship and medium of instruction for foreign graduates.",
    ],
    sources: [
      {
        label: "Study in Russia: official portal",
        href: "https://studyinrussia.ru/en/",
        publisher: "Ministry of Science and Higher Education of the Russian Federation",
      },
      globalSources.wdoms,
    ],
    faqs: [
      {
        question: "Is General Medicine in Russia the same as MBBS?",
        answer:
          "It is a different degree title for a primary medical qualification. Whether it is accepted for licensing depends on your home regulator's rules, so check those before applying.",
      },
    ],
    art: ["#3554a5", "#262b5c"],
  },
  {
    slug: "georgia",
    enabled: true,
    name: "Georgia",
    code: "GE",
    capital: "Tbilisi",
    coordinates: "41.72° N · 44.79° E",
    tagline: "English-taught six-year MD programmes in a European-style system",
    seoDescription:
      "Study MD in Georgia: English-taught six-year Doctor of Medicine programmes, eligibility, language requirements and recognition guidance.",
    summary:
      "Georgia offers English-taught Doctor of Medicine (MD) programmes aligned to European higher-education frameworks, at universities authorised by its national quality agency.",
    overview: [
      "Georgian universities offer a one-cycle Doctor of Medicine (MD) programme taught in English. Higher-education institutions and medical programmes are authorised and accredited by the National Center for Educational Quality Enhancement.",
      "Programmes follow the European Credit Transfer System (ECTS). Georgian is taught to support communication with patients during clinical training.",
    ],
    programmes: ["md", "dentistry"],
    medium: "English",
    duration: "MD: typically 6 years. Dentistry (DDS): typically 5 years",
    eligibility: [
      "Higher secondary qualification with Biology and Chemistry",
      "University entrance exam or interview, as set by each university",
      "Educational document recognition through Georgian authorities, coordinated by the university",
    ],
    academic: [
      "Minimum grades set by each university",
      "Check your home-country regulator's entry criteria before applying",
    ],
    language: [
      "English proficiency, tested by the university or proven with a recognised certificate",
      "Georgian language is studied for clinical communication",
    ],
    admissionNotes: [
      "Intakes are commonly in the autumn, with some universities offering a spring intake",
      "Enrolment is completed after the Ministry recognises your school documents",
    ],
    // TODO(owner): verified fee figures for the current intake
    indicativeCosts: null,
    recognition: [
      "Confirm the university is authorised and the programme accredited by Georgia's National Center for Educational Quality Enhancement.",
      "Check the university's World Directory of Medical Schools listing and your home regulator's requirements.",
    ],
    sources: [
      {
        label: "National Center for Educational Quality Enhancement",
        href: "https://eqe.ge/en",
        publisher: "Georgia",
      },
      globalSources.wdoms,
    ],
    faqs: [
      {
        question: "Is the MD degree in Georgia an undergraduate qualification?",
        answer:
          "Yes. In Georgia the MD is a one-cycle primary medical degree taken after secondary school, comparable in level to an MBBS. It is not the same as a postgraduate MD specialisation in South Asia.",
      },
    ],
    art: ["#9c2c3d", "#262b5c"],
  },
  {
    slug: "kazakhstan",
    enabled: true,
    name: "Kazakhstan",
    code: "KZ",
    capital: "Astana",
    coordinates: "51.17° N · 71.45° E",
    tagline: "English-medium General Medicine at national medical universities in Central Asia",
    seoDescription:
      "Study General Medicine (MBBS) in Kazakhstan: English-medium options, programme length, eligibility and recognition considerations.",
    summary:
      "Kazakhstan's medical universities offer General Medicine programmes with English-medium options for international students and clinical training in affiliated hospitals.",
    overview: [
      "Several national and regional medical universities in Kazakhstan admit international students to General Medicine programmes, with English-medium groups at many institutions.",
      "Programme structures have changed in recent years, including how the internship is organised. We confirm the current structure and length for each university before you apply.",
    ],
    programmes: ["mbbs"],
    medium: "English-medium groups at many universities; Kazakh/Russian also used in clinical settings",
    duration: "Typically 5–6 years depending on programme structure and internship, confirm per university",
    eligibility: [
      "Higher secondary qualification with Biology and Chemistry",
      "Minimum marks set by the university and your home-country regulator",
    ],
    academic: ["Strong science grades", "Some universities interview applicants"],
    language: [
      "English proficiency for English-medium groups",
      "Russian or Kazakh is studied for clinical communication",
    ],
    admissionNotes: ["Main intake is usually in September", "The university supports invitation and visa documents"],
    // TODO(owner): verified fee figures for the current intake
    indicativeCosts: null,
    recognition: [
      "Verify the university's World Directory of Medical Schools listing.",
      "Check that the programme's duration and internship meet your home regulator's requirements.",
    ],
    sources: [globalSources.wdoms],
    faqs: [
      {
        question: "How long is General Medicine in Kazakhstan?",
        answer:
          "It varies by programme structure and how the internship is organised. Expect roughly 5 to 6 years, and confirm the exact length with the university and against your home regulator's rules.",
      },
    ],
    art: ["#0f7fa8", "#262b5c"],
  },
  {
    slug: "philippines",
    enabled: true,
    name: "Philippines",
    code: "PH",
    capital: "Manila",
    coordinates: "14.60° N · 120.98° E",
    tagline: "An American-style MD pathway taught entirely in English",
    seoDescription:
      "Study medicine in the Philippines: pre-med plus 4-year MD pathway taught in English, NMAT entry, eligibility and recognition guidance.",
    summary:
      "The Philippines follows an American-style pathway: a pre-medical bachelor's degree followed by a four-year Doctor of Medicine (MD), all taught in English.",
    overview: [
      "Medical education in the Philippines is regulated by the Commission on Higher Education (CHED). Students first complete a pre-medical bachelor's degree, then a four-year Doctor of Medicine programme that includes clinical clerkship.",
      "Entry to the MD programme requires the National Medical Admission Test (NMAT). English is the language of instruction and is widely spoken in hospitals.",
    ],
    programmes: ["md", "nursing"],
    medium: "English",
    duration: "Pre-medical bachelor's (length varies) followed by a 4-year MD",
    eligibility: [
      "Completion of a pre-medical bachelor's degree (e.g. BS Biology or Psychology) for MD entry",
      "Qualifying NMAT score as set by each medical school",
      "For pre-med entry: higher secondary qualification with science subjects",
    ],
    academic: ["NMAT percentile requirements vary by school", "Academic records from the pre-medical degree are assessed"],
    language: ["Teaching is in English", "Filipino is helpful but not required for study"],
    admissionNotes: [
      "Plan the combined pre-med + MD timeline from the start",
      "Student visa processing involves both the school and Philippine authorities",
    ],
    // TODO(owner): verified fee figures for the current intake
    indicativeCosts: null,
    recognition: [
      "Confirm the institution is recognised by the Commission on Higher Education.",
      "Total study length (pre-med + MD) matters for some home regulators, so check their rules first.",
    ],
    sources: [
      {
        label: "Commission on Higher Education (CHED)",
        href: "https://ched.gov.ph/",
        publisher: "Republic of the Philippines",
      },
      globalSources.wdoms,
    ],
    faqs: [
      {
        question: "Can I join the MD directly after Grade 12?",
        answer:
          "Usually not. The standard route is a pre-medical bachelor's degree first, then the MD after passing the NMAT. Total time is longer than a direct-entry MBBS, which matters for some home regulators.",
      },
    ],
    art: ["#c9851a", "#262b5c"],
  },
];

export const destinations = all.filter((d) => d.enabled);

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
