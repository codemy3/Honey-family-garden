import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Reviews",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Reviewer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "email",
      title: "Reviewer Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Reviewer Phone",
      type: "string",
    }),
    defineField({
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "Wedding", value: "wedding" },
          { title: "Corporate Event", value: "corporate" },
          { title: "Family Gathering", value: "family" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "comment",
      title: "Review Comment",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Uploaded Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Photos uploaded by the reviewer.",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "rating",
      email: "email",
      phone: "phone",
    },
    prepare({ title, subtitle, email, phone }) {
      const contact = [phone, email].filter(Boolean).join(" | ");
      return {
        title: title || "Anonymous",
        subtitle: `${subtitle} Stars${contact ? ` - ${contact}` : ""}`,
      };
    },
  },
});
