/**
 * Articles that ship with the website. They are the starting content of
 * Admin → Blog posts, where they can be edited or hidden.
 *
 * Every fact must come from an official source that was actually read.
 */
export type SeedPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: { src: string; alt: string };
  blocks: { heading: string; text: string }[];
};

/*
 * after-cee-result-options: sources read on 2026-11-25
 *  - MEC retotaling notice (MECEE-BL 2027): application times, fee, how to apply
 *  - MEC MBBS result notice, 18 November 2026: exam date, result in online profile
 *  - MEC FAQ (mec.gov.np/frontfaq): matching, Eligibility Letter, fee, exceptions
 */
export const seedPosts: SeedPost[] = [
  {
    slug: "after-cee-result-options",
    title: "After CEE Result 2083: All Your Options",
    date: "2026-11-25",
    excerpt: "CEE (MECEE-BL 2027) results are out. What to do next: retotaling, matching in Nepal, the MEC Eligibility Letter, studying abroad or another course.",
    cover: { src: "/images/why-counselling.jpg", alt: "A counsellor talking one-to-one with a student" },
    blocks: [
      {
        heading: "",
        text: "The Medical Education Commission (MEC) has published results of CEE, officially called MECEE-BL 2027, for the 2083/84 session. The MBBS result came first, on 18 November 2026. This guide explains what you can do next, whether your name is on the merit list or not.\n\nRules and dates can change. Always check the latest notice on [mec.gov.np](https://www.mec.gov.np) before you pay a fee or make a decision.",
      },
      {
        heading: "First: is retotaling right for you?",
        text: "Retotaling means your marks are added up again. It is for candidates who are not satisfied with their score. MEC's notice for MECEE-BL 2027 says:\n\n- Applications open at 9:00 AM on 24 November 2026\n- Applications close at 4:00 PM on 26 November 2026\n- The fee is Rs 1,000\n- It covers all programmes in the exam held from 31 October to 4 November 2026\n- You apply by scanning the QR code in the notice\n\nThe form asks for your payment voucher, a copy of your admit card and your score card. Take the bank details and QR code only from the [official retotaling notice](https://www.mec.gov.np/np/detail/panarayaga-retotaling-ka-lga-navathana-thanasamabnathha-sacana-mecee-bl2027), never from a message or a social media post.",
      },
      {
        heading: "Option 1: Study in Nepal through matching",
        text: "If you are on the merit list, admission in Nepal happens only through MEC's matching process. Your rank decides which seat you can get. According to MEC:\n\n- You cannot be admitted to a college directly. Admission follows the merit order and matching\n- After each admission list is published, you get at least five days to complete admission\n- Admission is finished within 35 days of the start of the academic session\n\nWhile you wait for the matching notice, keep your original documents ready and discuss your college priorities with your family. We had not seen MEC's matching dates for this session when this article was published, so watch the MEC website and your online profile.",
      },
      {
        heading: "Option 2: Study MBBS, BDS or nursing abroad",
        text: "If you passed the CEE, you can apply to MEC for an Eligibility Letter to study abroad. MEC says you must get this letter before you leave, because your professional council in Nepal will register you only with it.\n\nKey points from MEC:\n\n- Nepali citizens who passed the entrance exam can get the letter for the level and subject they passed\n- The letter must be taken before the next entrance exam result is published\n- The fee is Rs 3,000 at bachelor level. It is not refunded if you turn out not to qualify, so check first\n- MEC does not issue the letter for a programme that is shorter than the same level in Nepal\n\nNext, compare countries. Read our guides to [Bangladesh](/destinations/bangladesh), [India](/destinations/india), [China](/destinations/china), [Russia](/destinations/russia), [Georgia](/destinations/georgia), [Kazakhstan](/destinations/kazakhstan) and the [Philippines](/destinations/philippines), or see the full [admission process](/admission-process).",
      },
      {
        heading: "Option 3: Your name is not on the list",
        text: "One exam does not decide your whole career, but be careful with anyone who promises an easy way around the rules.\n\nMEC states that candidates who did not sit the CEE, or did not qualify, cannot get an Eligibility Letter. There is one exception. If a country's national written entrance exam is recognised by MEC, and you pass it with at least 50 percent or the 50th percentile, MEC may allow you to study in that country. Confirm with MEC that your exam and country are accepted before you pay anyone.\n\nYou can also:\n\n- Check whether you qualified in another programme you sat for, such as [BSc Nursing](/programs/nursing)\n- Prepare again for the next CEE\n- Look at related fields such as [pharmacy](/programs/pharmacy) or [biomedical sciences](/programs/biomedical-sciences), and ask MEC which of them need the entrance exam",
      },
      {
        heading: "Five questions to ask before you pay any consultancy or college",
        text: "- Is the university listed in the [World Directory of Medical Schools](https://search.wdoms.org/)?\n- Will MEC issue an Eligibility Letter for this exact programme and length?\n- Will my professional council in Nepal register this degree?\n- What is the full cost in writing, including hostel, exams and visa?\n- What is the refund policy if the letter or visa is refused?",
      },
      {
        heading: "CEE result पछि के गर्ने?",
        text: "नतिजामा चित्त नबुझेमा चिकित्सा शिक्षा आयोगले तोकेको समयभित्र पुनर्योग (Retotaling) का लागि निवेदन दिनुहोस्। योग्यता सूचीमा नाम भएमा नेपालमा म्याचिङ प्रक्रियाबाट मात्र भर्ना हुन सकिन्छ। विदेशमा पढ्न जानुअघि आयोगबाट अध्ययन अनुमतिपत्र (Eligibility Letter) लिनु पर्छ।",
      },
      {
        heading: "Talk it through with a counsellor",
        text: "Bring your CEE score card and +2 marks, and we will go through your realistic options together. The first consultation is free and parents are welcome. [Book a free counselling session](/book-counselling).",
      },
      {
        heading: "Official sources",
        text: "- [MEC retotaling notice, MECEE-BL 2027](https://www.mec.gov.np/np/detail/panarayaga-retotaling-ka-lga-navathana-thanasamabnathha-sacana-mecee-bl2027)\n- [MEC frequently asked questions](https://mec.gov.np/frontfaq)\n- [MEC results and notices](https://www.mec.gov.np)",
      },
    ],
  },
  // cee-entrance-guide-nepal: MEC FAQ (mec.gov.np/frontfaq), read on 2026-11-25.
  // Class dates, times and fees are left out on purpose until the owner supplies them.
  {
    slug: "cee-entrance-guide-nepal",
    title: "CEE Entrance Exam Nepal: Complete Guide",
    date: "2026-11-25",
    excerpt: "CEE (MECEE-BL) explained for +2 science students: who can apply, documents, exam-day rules, the 50th percentile, and our CEE classes.",
    cover: { src: "/images/about-student.jpg", alt: "Student reading a book between library shelves" },
    blocks: [
      {
        heading: "",
        text: "CEE is the common name for MECEE-BL, the bachelor-level entrance exam of Nepal's Medical Education Commission (MEC). It decides who can study medical and health programmes such as MBBS, BDS and nursing in Nepal. It also matters if you plan to study abroad, because the MEC Eligibility Letter is generally linked to passing it.\n\nThis guide is based on MEC's own frequently asked questions. Rules can change, so always check the latest notice on [mec.gov.np](https://www.mec.gov.np).",
      },
      {
        heading: "Who can sit the CEE?",
        text: "MEC states that you need:\n\n- Class 12 or equivalent with Physics, Chemistry and Biology\n- An average of at least 50 percent marks or a 2.4 GPA\n- For BNS: at least 50 percent in PCL or Diploma in Nursing, and registration with Nepal Nursing Council\n\nEach programme's syllabus can add further conditions, so read the [official syllabus page](https://www.mec.gov.np/category/syllabus) for the programme you want.",
      },
      {
        heading: "How to apply",
        text: "The whole process is online, so you do not need to visit MEC. Applications are made on [entrance.mec.gov.np](https://entrance.mec.gov.np/). Opening dates follow MEC's yearly academic calendar and are announced by notice.\n\nPay at the bank at least two days before the last application date. You need one voucher for each programme you apply for.",
      },
      {
        heading: "Documents to keep ready",
        text: "- Citizenship certificate or national ID (passport for foreign candidates)\n- Certificate and transcript of your qualification\n- Equivalence certificate, if you studied under a foreign board\n- Percentage or grade certificate, if your transcript does not show it\n- Reservation documents, if you apply under a reserved category\n- Professional council registration or experience certificate, if your programme requires it\n- Bank voucher for the exam fee\n- Recent passport-size digital photo and a scan of your signature",
      },
      {
        heading: "Exam-day rules",
        text: "- Your admit card appears in your online profile five days before the exam. Print it in colour\n- Arrive two hours early. Entry starts 30 minutes before the exam\n- You cannot enter if you are more than 15 minutes late, and you cannot leave until the time ends\n- Bring your admit card and your original citizenship certificate or national ID\n- Phones, watches and jewellery are not allowed\n- Fill the roll number and question-set bubbles carefully. MEC says mistakes there can cancel your answer sheet or stop your result from being published",
      },
      {
        heading: "What score do you need?",
        text: "MEC publishes a ranking. To be eligible for admission you need at least the 50th percentile. That makes you eligible, but it does not promise a seat: seats are filled by merit rank and the programme priorities you set online. The rank list is valid for one academic session.\n\nMEC's FAQ says that if you are not satisfied with your result, you can apply for retotaling within three days of publication. The notice for each exam gives the exact time.",
      },
      {
        heading: "How to prepare",
        text: "- Start from the official syllabus of your programme, not from a summary\n- Make a weekly plan that covers Physics, Chemistry and Biology\n- Practise with a timer and review every mistake\n- Practise filling an answer sheet, so that bubbles do not cost you your result\n- Set your documents aside early, so that application week stays calm",
      },
      {
        heading: "CEE classes and counselling at Cerebellum",
        text: "Cerebellum Education Network runs CEE preparation classes and also counsels students and parents on what comes after the exam. Our office is at Ramshah Path, Kathmandu. For current class information, [contact us](/contact) or [book a free counselling session](/book-counselling).\n\nNo class can guarantee a rank or a seat. Be careful with anyone who promises one.",
      },
      {
        heading: "After the exam",
        text: "Read [After CEE Result 2083: All Your Options](/blog/after-cee-result-options) for retotaling, matching and the Eligibility Letter, or see our guides to [MBBS](/programs/mbbs) and [nursing](/programs/nursing).",
      },
      {
        heading: "Official sources",
        text: "- [MEC frequently asked questions](https://mec.gov.np/frontfaq)\n- [MEC syllabus page](https://www.mec.gov.np/category/syllabus)\n- [MEC online application](https://entrance.mec.gov.np/)",
      },
    ],
  },
];
