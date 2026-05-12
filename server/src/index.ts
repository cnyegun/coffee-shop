import { prisma } from "../lib/prisma"
import { z } from "zod"
import express from "express"
import { ProductListResponseSchema, ProductSchema, FlavorSchema } from "contract"
import type { Product, ProductInput } from "contract"
import { ProductCategory, CoffeeForm, CoffeeRoastLevel } from "../generated/prisma/enums"

const app = express()
const port = 3000

function parseFlavours(flavours_raw: string): string[] {
  try {
    return JSON.parse(flavours_raw)
  } catch {
    throw new Error("Invalid coffee flavours")
  }
}

function mapRowToProductContract(p: ProductRow): ProductInput {
  const base = {
    id: p.id,
    name: p.name,
    description: p.description,
    unitPriceCents: p.unitPriceCents,
    imageUrl: p.imageUrl
  }
  switch (p.category) {
    case ProductCategory.coffee: {
      if (!p.coffee) throw new Error(`Missing coffee data for: ${p.id}`)
      if (p.coffee.form == CoffeeForm.ground) {
        if (p.coffee.grindSize == null) throw new Error(`Missing grounded coffee grindSize ${p.id}`)
        return {
          ...base,
          category: p.category,
          weightGrams: p.coffee.weightGrams,
          form: p.coffee.form,
          roastLevel: p.coffee.roastLevel,
          grindSize: p.coffee.grindSize,
          flavours: parseFlavours(p.coffee.flavours)
        }
      }
      return {
        ...base,
        category: p.category,
        weightGrams: p.coffee.weightGrams,
        form: p.coffee.form,
        roastLevel: p.coffee.roastLevel,
        flavours: parseFlavours(p.coffee.flavours)
      }
    }
    case ProductCategory.merch: {
      if (p.merch == undefined) throw new Error(`Missing merch ${p.id}`)
      return {
        ...base,
        category: p.category,
        merchType: p.merch.merchType
      }
    }
    case ProductCategory.bundle: {
      if (p.bundle == undefined) throw new Error(`Missing bundle ${p.id}`)
      return {
        ...base,
        category: p.category,
        items: p.bundle.items.map((item) => {
          if (item.product.category == ProductCategory.bundle)
            throw new Error(`Bundle cannot contain other bundle ${p.id}`)
          return {
            product: {
              id: item.product.id,
              name: item.product.name,
              unitPriceCents: item.product.unitPriceCents,
              category: item.product.category,
            },
            quantity: item.quantity
          }
        })
      }
    }
  }
}

function findProductRows() {
  return prisma.product.findMany({
    include: {
      coffee: true,
      merch: true,
      bundle: { include: { items: { include: { product: true } } } }
    }
  })
}
type ProductRow = Awaited<ReturnType<typeof findProductRows>>[number]

app.get('/products', async (req, res) => {
  const productRows: ProductRow[] = await findProductRows()
  const products: ProductInput[] = productRows.map(mapRowToProductContract)
  res.json(ProductListResponseSchema.parse({
    items: products
  }))
})

app.listen(port, () => {
  console.log(`coffee-shop listening on port ${port}`)
})