import { contactPageMetadata } from "@/lib/seo/metadata";

export const metadata = contactPageMetadata;

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
