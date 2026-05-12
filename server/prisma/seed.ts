import { prisma } from "../lib/prisma"
import {
  ProductCategory,
  CoffeeForm,
  CoffeeRoastLevel,
} from "../generated/prisma/enums"

async function main() {
  // Reset the db
  await prisma.bundleItem.deleteMany()
  await prisma.bundle.deleteMany()
  await prisma.coffee.deleteMany()
  await prisma.merch.deleteMany()
  await prisma.product.deleteMany()
  console.log("Cleared the db.")

  await prisma.product.createMany({
    data: [
      // Coffee
      {
        id: "morning-lift-250g", name: "Morning Lift",
        description: "Bright medium roast for daily brewing.",
        unitPriceCents: 199, category: ProductCategory.coffee
      },
      {
        id: "velvet-ground-340g", name: "Velvet Ground",
        description: "Smooth ground coffee for filter brewing.",
        unitPriceCents: 239, category: ProductCategory.coffee
      },
      {
        id: "midnight-ground-250g", name: "Midnight Ground",
        description: "Bold dark ground coffee.",
        unitPriceCents: 289, category: ProductCategory.coffee
      },

      // Merch
      {
        id: "classic-mug-white", name: "Classic White Mug",
        description: "Ceramic white mug with our coffee shop logo.",
        unitPriceCents: 599, category: ProductCategory.merch
      },

      {
        id: "canvas-tote-cream", name: "Cream Canvas Tote",
        description: "Reusable canvas tote bag.",
        unitPriceCents: 1299, category: ProductCategory.merch
      },

      // Bundle
      {
        id: "starter-bundle", name: "Starter Bundle",
        description: "Recommended by coffee enthusiast. JustBrew™.",
        unitPriceCents: 699, category: ProductCategory.bundle
      },
      {
        id: "dark-brew-kit", name: "Dark Brew Kit",
        description: "For something more than just light brewing sessions.",
        unitPriceCents: 699, category: ProductCategory.bundle
      },
    ]
  })

  await prisma.coffee.createMany({
    data: [
      { productId: "morning-lift-250g", form: CoffeeForm.whole_bean, weightGrams: 250, roastLevel: CoffeeRoastLevel.light },
      { productId: "velvet-ground-340g", form: CoffeeForm.ground, weightGrams: 340, roastLevel: CoffeeRoastLevel.medium, grindSize: 3 },
      { productId: "midnight-ground-250g", form: CoffeeForm.ground, weightGrams: 250, roastLevel: CoffeeRoastLevel.dark, grindSize: 2 },
    ]
  })

  await prisma.merch.createMany({
    data: [
      { productId: "classic-mug-white", merchType: "mug" },
      { productId: "canvas-tote-cream", merchType: "tote" },
    ]
  })

  await prisma.bundle.createMany({
    data: [
      { productId: "starter-bundle" },
      { productId: "dark-brew-kit" }
    ]
  })

  await prisma.bundleItem.createMany({
    data: [
      // Starter bundle
      { productId: "morning-lift-250g", bundleId: "starter-bundle", quantity: 1 },
      { productId: "classic-mug-white", bundleId: "starter-bundle", quantity: 1 },
      // Dark brew bundle
      { productId: "midnight-ground-250g", bundleId: "dark-brew-kit", quantity: 2 },
      { productId: "canvas-tote-cream", bundleId: "dark-brew-kit", quantity: 1 }
    ]
  })

}

main().finally(async () => {
  console.log("seed.ts all good bro :D")
  const bundles = await prisma.product.findMany({
    where: {
      category: ProductCategory.bundle,
    },
    include: {
      bundle: {
        include: { items: { include: { product: true } } }
      }
    }
  })
  await prisma.$disconnect()
})