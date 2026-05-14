import { ShoppingBag } from "lucide-react"

export default function ProductPage() {
  return (
    <header className="grid grid-cols-3 items-center bg-cream px-15 h-25">
      <BrandLogo />
      <Nav />
      <CheckoutLink />
    </header>
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