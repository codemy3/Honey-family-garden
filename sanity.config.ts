import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  
  // Add our custom schema definition
  schema,
  
  plugins: [
    structureTool(),
  ],
});
