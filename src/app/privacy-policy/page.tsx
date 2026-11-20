import { ManagedLegalPage } from "@/components/cms/legal";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects personal information submitted through this website.`,
  path: "/privacy-policy",
});

// NOTE FOR SITE OWNER: have this policy reviewed by a qualified legal adviser
// for the jurisdictions you operate in before launch.
/** Content: Admin → Pages → Privacy Policy. */
export default function PrivacyPolicyPage() {
  return <ManagedLegalPage contentKey="page:privacy-policy" path="/privacy-policy" />;
}
