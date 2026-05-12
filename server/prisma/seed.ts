import { prisma } from "../lib/prisma"
import {
  ProductCategory,
  CoffeeForm,
  CoffeeRoastLevel,
} from "../generated/prisma/enums"

const coffees = [
  {
    id: "sai-gon-signature",
    name: "Sài Gòn Signature",
    description: "Dark Roast",
    imageUrl: "../images/products/sai-gon-signature.png",
    unitPriceCents: 220000,
    form: CoffeeForm.whole_bean,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.dark,
    flavours: ["Socola đen", "Caramel", "Hậu ngọt"],
  },
  {
    id: "da-lat-highlands",
    name: "Đà Lạt Highlands",
    description: "Medium Roast",
    imageUrl: "../images/products/da-lat-highlands.png",
    unitPriceCents: 210000,
    form: CoffeeForm.whole_bean,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.medium,
    flavours: ["Hạt dẻ", "Hạnh nhân", "Cân bằng"],
  },
  {
    id: "cau-dat-farm",
    name: "Cầu Đất Farm",
    description: "Light Roast",
    imageUrl: "../images/products/cau-dat-farm.png",
    unitPriceCents: 210000,
    form: CoffeeForm.whole_bean,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.light,
    flavours: ["Cam quýt", "Mật ong", "Thanh nhẹ"],
  },
  {
    id: "espresso-blend",
    name: "Espresso Blend",
    description: "Medium Dark Roast",
    imageUrl: "../images/products/espresso-blend.png",
    unitPriceCents: 220000,
    form: CoffeeForm.ground,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.medium,
    grindSize: 2,
    flavours: ["Socola", "Hậu đậm", "Cân bằng"],
  },
  {
    id: "robusta-reserve",
    name: "Robusta Reserve",
    description: "Bold Roast",
    imageUrl: "../images/products/robusta-reserve.png",
    unitPriceCents: 195000,
    form: CoffeeForm.whole_bean,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.dark,
    flavours: ["Đậm đà", "Mạnh mẽ", "Hậu kéo dài"],
  },
  {
    id: "arabica-heritage",
    name: "Arabica Heritage",
    description: "Floral Roast",
    imageUrl: "../images/products/arabica-heritage.png",
    unitPriceCents: 235000,
    form: CoffeeForm.whole_bean,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.light,
    flavours: ["Hoa nhài", "Trà xanh", "Thanh tao"],
  },
  {
    id: "phin-house-blend",
    name: "Phin House Blend",
    description: "Medium Roast",
    imageUrl: "../images/products/phin-house-blend.png",
    unitPriceCents: 205000,
    form: CoffeeForm.ground,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.medium,
    grindSize: 3,
    flavours: ["Cân bằng", "Dễ uống", "Hậu ngọt"],
  },
  {
    id: "limited-lotus-edition",
    name: "Limited Lotus Edition",
    description: "Special Release",
    imageUrl: "../images/products/limited-lotus-edition.png",
    unitPriceCents: 245000,
    form: CoffeeForm.ground,
    weightGrams: 250,
    roastLevel: CoffeeRoastLevel.light,
    grindSize: 3,
    flavours: ["Sen", "Trà", "Hậu thanh thoát"],
  },
]

async function resetDb() {
  await prisma.bundleItem.deleteMany()
  await prisma.bundle.deleteMany()
  await prisma.coffee.deleteMany()
  await prisma.merch.deleteMany()
  await prisma.product.deleteMany()
}

async function main() {
  await resetDb()
  console.log("Cleared the db.")

  await prisma.product.createMany({
    data: coffees.map((coffee) => ({
      id: coffee.id,
      name: coffee.name,
      description: coffee.description,
      imageUrl: coffee.imageUrl,
      unitPriceCents: coffee.unitPriceCents,
      category: ProductCategory.coffee,
    })),
  })

  await prisma.coffee.createMany({
    data: coffees.map((coffee) => ({
      productId: coffee.id,
      flavours: JSON.stringify(coffee.flavours),
      form: coffee.form,
      weightGrams: coffee.weightGrams,
      roastLevel: coffee.roastLevel,
      grindSize: coffee.form === CoffeeForm.ground ? coffee.grindSize : null,
    })),
  })

  console.log(`Seeded ${coffees.length} coffee products.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
