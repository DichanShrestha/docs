import mongoose, { Schema } from "mongoose";

const DocsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
      default: () => ({
        type: "doc",
        content: [],
      }),
    },
    owner: {
      type: String,
      required: true,
    },
    collaborators: [],
  },
  { timestamps: true }
);

export const DocsModel = mongoose.model("Docs", DocsSchema);
