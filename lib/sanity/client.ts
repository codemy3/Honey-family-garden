import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "edh8ol10";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01"; // Use current date for the API version

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if you want to ensure fresh data always
});

// Helper for generating Image URLs from Sanity
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
