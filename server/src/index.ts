import { prisma } from "../lib/prisma"
import express from "express"
import { ProductListResponseSchema, ProductSchema } from "contract"
import type { Product } from "contract"

const app = express()
const port = 3000

function mapProductToContract(p: ProductRow): Product {
  if (p.category === "coffee") {
    const coffee = {
      id: p.id,
      name: p.name,
      description: p.description,
      unitPriceCents: p.unitPriceCents,
      category: "coffee",
      form: p.coffee?.form,
      weightGrams: p.coffee?.weightGrams,
      roastLevel: p.coffee?.roastLevel,
      ...(p.coffee?.form === "ground" ? { grindSize: p.coffee.grindSize } : {})
    }
    return ProductSchema.parse(coffee)
  }
  else if (p.category === "merch") {
    const merch = {
      id: p.id,
      name: p.name,
      description: p.description,
      unitPriceCents: p.unitPriceCents,
      category: "merch",
      merchType: p.merch?.merchType
    }
    return ProductSchema.parse(merch)
  }
  else if (p.category === "bundle") {
    const bundle = {
      id: p.id,
      name: p.name,
      description: p.description,
      unitPriceCents: p.unitPriceCents,
      category: "bundle",
      items: p.bundle?.items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          unitPriceCents: item.product.unitPriceCents,
          category: item.product.category,
        },
        quantity: item.quantity
      }))
    }
    return ProductSchema.parse(bundle)
  }
  throw new Error(`Unrecognized category: ${p.category}`)
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
  const products: Product[] = productRows.map(mapProductToContract)
  res.json(ProductListResponseSchema.parse({
    items: products
  }))
})

app.listen(port, () => {
  console.log(`coffee-shop listening on port ${port}`)
})