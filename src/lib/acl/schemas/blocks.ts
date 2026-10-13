import { z } from "zod";
import {
  ImageSchema,
  arrayOfValid,
  slugField,
  titleField,
  orderField,
  optionalString,
} from "./base";

/** A content block: rich text + a list of images. Used on home, about, etc. */
export const CustomBlockSchema = z.object({
  slug: slugField,
  type: z.literal("custom"),
  title: titleField,
  order: orderField,
  data: z
    .object({
      content: optionalString,
      image_position: optionalString,
      images: arrayOfValid(ImageSchema),
    })
    .default({ content: "", image_position: "", images: [] }),
});

/** One icon/title/content card inside a features block. title is required. */
const FeatureItemSchema = z.object({
  icon: optionalString,
  title: z.string().min(1),
  content: optionalString,
});

/** A grid of feature cards. Used on about-style pages. */
export const FeaturesBlockSchema = z.object({
  slug: slugField,
  type: z.literal("features"),
  title: titleField,
  order: orderField,
  data: z
    .object({ items: arrayOfValid(FeatureItemSchema) })
    .default({ items: [] }),
});

/** One review record. Only `rating` is required; other fields pass through. */
const ReviewRecordSchema = z.object({ rating: z.number() }).passthrough();

/** Customer reviews. Used on home and contact ("reviews"). */
export const ReviewBlockSchema = z.object({
  slug: slugField,
  type: z.literal("review"),
  title: titleField,
  order: orderField,
  data: z
    .object({ records: arrayOfValid(ReviewRecordSchema) })
    .default({ records: [] }),
});
