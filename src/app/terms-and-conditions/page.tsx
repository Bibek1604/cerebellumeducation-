import { ManagedLegalPage } from "@/components/cms/legal";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms & Conditions",
  description: `Terms of use for the ${siteConfig.name} website and information about the limits of our guidance.`,
  path: "/terms-and-conditions",
});

// NOTE FOR SITE OWNER: have these terms reviewed by a qualified legal adviser
// before launch, and add your service agreement terms separately.
/** Content: Admin → Pages → Terms & Conditions. */
export default function TermsPage() {
  return <ManagedLegalPage contentKey="page:terms-and-conditions" path="/terms-and-conditions" />;
}
