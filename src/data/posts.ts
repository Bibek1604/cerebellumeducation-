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
];
