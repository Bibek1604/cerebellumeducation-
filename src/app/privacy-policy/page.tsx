import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects personal information submitted through this website.`,
  path: "/privacy-policy",
});

// NOTE FOR SITE OWNER: have this policy reviewed by a qualified legal adviser
// for the jurisdictions you operate in before launch.
export default function PrivacyPolicyPage() {
  const { email } = siteConfig.contact;
  return (
    <LegalPage title="Privacy Policy" path="/privacy-policy">
      <p>
        This policy explains how {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information you
        share with us through this website.
      </p>

      <h2>Information we collect</h2>
      <p>When you submit an enquiry or counselling request, we collect the details you choose to provide, such as:</p>
      <ul>
        <li>Your name, phone number and email address</li>
        <li>Your current location and academic qualification</li>
        <li>Your programme, destination and intake preferences</li>
        <li>Any message you write to us</li>
      </ul>
      <p>
        We do not ask for passports, certificates or other sensitive documents through website forms. Our web server may
        also record basic technical information such as your browser type and the page you submitted from.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your enquiry and arrange counselling</li>
        <li>To provide guidance relevant to your study plans</li>
        <li>To keep records of our communication with you</li>
        <li>To protect our website from spam and misuse</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>Legal basis and consent</h2>
      <p>
        We process enquiry information on the basis of your consent, which you give when submitting a form, and our
        legitimate interest in responding to you. You may withdraw consent at any time.
      </p>

      <h2>Sharing your information</h2>
      <p>
        We share your information only where needed to provide our service, for example, with service providers that
        host our website or manage our enquiries. Information is shared with universities only when you ask us to help you
        apply, and only what is required for that application.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry information only as long as needed for the purposes above or as required by law, after which it is
        deleted or anonymised.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct or delete your personal information, or to
        object to how it is used. To make a request, please{" "}
        {email ? <a href={`mailto:${email}`}>email us at {email}</a> : <Link href="/contact">contact us</Link>}.
      </p>

      <h2>Cookies</h2>
      <p>
        This website does not use advertising or analytics cookies. If that changes, we will update this policy and ask for
        consent where required.
      </p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The &ldquo;last updated&rdquo; date above shows when it last changed.</p>
    </LegalPage>
  );
}
