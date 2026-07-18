import { type SchemaTypeDefinition } from "sanity";
import { reviewType } from "./review";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [reviewType],
};
