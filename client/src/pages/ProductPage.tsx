import { ShoppingBag } from "lucide-react"
import { useState, useEffect } from "react"
import type { Product, ProductListResponse } from "contract"


export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/products")
      const data: ProductListResponse = await res.json()
      setProducts(data.items)
    }
    loadProducts()
  }, [])
  return (
    <main>
      <header className="grid grid-cols-3 items-center bg-cream px-15 h-25">
        <BrandLogo />
        <Nav />
        <CheckoutLink />
      </header>
      <ProductGrid products={products} />
    </main>
  )
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const price = product.unitPriceCents.toLocaleString("vi-VN")
  const flavourText = product.category === "coffee" ? product.flavours.join(", ") : product.description

  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <a href={`/products/${product.id}`} className="block bg-stone-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-3/4 w-full object-cover"
        />
      </a>

      <div className="px-5 py-4 text-center">
        <a href={`/products/${product.id}`} className="font-serif text-xl text-stone-900 hover:underline">
          {product.name}
        </a>

        {product.description && (
          <p className="mt-1 text-sm text-stone-500">{product.description}</p>
        )}

        {flavourText && (
          <p className="mt-3 min-h-10 text-sm leading-5 text-stone-600">{flavourText}</p>
        )}

        <p className="mt-4 font-serif text-xl font-semibold text-stone-950">{price}đ</p>

        <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-stone-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-stone-900">
          Thêm vào giỏ
          <ShoppingBag size={15} strokeWidth={1.8} />
        </button>
      </div>
    </article>
  )
}

function CheckoutLink() {
  return (
    <a href="/checkout" className="justify-self-end p-5">
      <ShoppingBag size={30} strokeWidth={2} />
    </a>
  )
}

function Nav() {
  return (
    <nav className="justify-self-center">
      <ul className="flex items-center text-xl font-light whitespace-nowrap select-none">
        <li><a href="/coffee" className="px-4 py-8">COFFEE</a></li>
        <li><a href="/recipes" className="px-4 py-6">REPICES</a></li>
        <li><a href="/about" className="px-4 py-6">ABOUT</a></li>
        <li><a href="/contact-us" className="px-4 py-6">CONTACT US</a></li>
      </ul>
    </nav>
  )
}

function BrandLogo() {
  return (
    <a className="justify-self-start inline-flex flex-col items-center select-none m-3 whitespace-nowrap" href="/">
      <div className="font-serif font-bold text-4xl">Phin Kahvi</div>
      <div className="font-serif text-l">SAIGON COFFEE ROASTER</div>
    </a>
  )
}
