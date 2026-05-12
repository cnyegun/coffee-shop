import { z } from "zod"

export const FlavorSchema = z.array(z.string().nonempty()).nonempty()

const BaseProductSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  imageUrl: z.string().nonempty(),
  unitPriceCents: z.number().int().nonnegative()
}).strict()

const CoffeeBaseSchema = BaseProductSchema.safeExtend({
  category: z.literal("coffee"),
  weightGrams: z.number().int().positive(),
  roastLevel: z.enum(["light", "medium", "dark"]),
  flavours: FlavorSchema,
}).strict()

const CoffeeSchema = z.discriminatedUnion("form", [
  CoffeeBaseSchema.safeExtend({
    form: z.literal("ground"),
    grindSize: z.number().int().min(1).max(5)
  }),
  CoffeeBaseSchema.safeExtend({
    form: z.literal("whole_bean"),
  })
])
type Coffee = z.infer<typeof CoffeeSchema>

const ProductSummarySchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  unitPriceCents: z.number().int().nonnegative(),
  category: z.enum(["coffee", "merch"])
}).strict()

const BundleItemSchema = z.object({
  product: ProductSummarySchema,
  quantity: z.number().int().positive()
}).strict()

export const ProductSchema = z.discriminatedUnion("category", [
  CoffeeSchema,

  BaseProductSchema.safeExtend({
    category: z.literal("merch"),
    merchType: z.string().nonempty()
  }),

  BaseProductSchema.safeExtend({
    category: z.literal("bundle"),
    items: z.array(BundleItemSchema).min(1)
  })
])
export type Product = z.infer<typeof ProductSchema>
export type ProductInput = z.input<typeof ProductSchema>

export const ProductListResponseSchema = z.object({
  items: z.array(ProductSchema)
}).strict()
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>