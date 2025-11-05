import { blogPageMetadata } from "@/lib/seo/metadata";

export const metadata = blogPageMetadata;

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
