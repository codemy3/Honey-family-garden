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
      name: "isApproved",
      title: "Approved for Website?",
      type: "boolean",
      description: "Toggle this on to show the review publicly on the website.",
      initialValue: false,
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
      isApproved: "isApproved",
    },
    prepare({ title, subtitle, isApproved }) {
      return {
        title: title || "Anonymous",
        subtitle: `${subtitle} Stars - ${isApproved ? "🟢 Approved" : "🔴 Needs Approval"}`,
      };
    },
  },
});
