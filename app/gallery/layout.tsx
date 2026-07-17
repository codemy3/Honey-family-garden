import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — Photo Gallery",
  description:
    "Browse our gallery of beautiful venue photos, event celebrations, food displays, garden landscapes, and event setups at Honey Family Garden Restaurant, Shimoga.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
