import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: `Terms of use for the ${siteConfig.name} website and information about the limits of our guidance.`,
  path: "/terms-and-conditions",
});

// NOTE FOR SITE OWNER: have these terms reviewed by a qualified legal adviser
// before launch, and add your service agreement terms separately.
export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" path="/terms-and-conditions">
      <p>
        By using this website you agree to these terms. If you do not agree, please do not use the website.
      </p>

      <h2>About the information on this website</h2>
      <p>
        Content on this website is general information about studying medicine and healthcare abroad. It is not legal,
        immigration or regulatory advice. Entry requirements, programme details, fees, visa rules and licensing regulations
        are set by universities, governments and regulators and can change at any time. Always confirm details with the
        relevant official source before making decisions.
      </p>

      <h2>No guarantee of outcomes</h2>
      <ul>
        <li>Admission decisions are made solely by universities.</li>
        <li>Visa decisions are made solely by the relevant government authorities.</li>
        <li>Recognition of degrees and eligibility for medical licensing are decided by medical regulators.</li>
        <li>Scholarships are awarded at the discretion of their providers.</li>
      </ul>
      <p>
        {siteConfig.name} does not guarantee admission, visas, scholarships, licensing or employment.
      </p>

      <h2>University listings</h2>
      <p>
        Universities named on this website are listed for information. A listing does not mean an official partnership or
        endorsement unless explicitly stated.
      </p>

      <h2>External links</h2>
      <p>
        We link to official and third-party websites for your convenience. We are not responsible for their content or
        availability.
      </p>

      <h2>Use of this website</h2>
      <p>
        You agree not to misuse the website, submit false information, attempt to disrupt its operation or use automated
        means to submit forms.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The content, design and branding of this website belong to {siteConfig.name} unless otherwise stated, and may not be
        reproduced without permission.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle personal information is explained in our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. The &ldquo;last updated&rdquo; date above shows when they last changed.</p>
    </LegalPage>
  );
}
