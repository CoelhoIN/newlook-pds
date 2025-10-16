"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import LoginDialog from "./login_dialog"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigationItems = [
    { name: "SOBRE NÓS", href: "#sobre" },
    { name: "SERVIÇOS", href: "#servicos" },
    { name: "CONTATO", href: "#contato" },
  ]

  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b border-[#8d6e3d]/20 bg-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="text-2xl tracking-wider text-[#ededed]">
            <Link href="/">
              <Image alt="logo" src="/logo.svg" height={18} width={140} />
            </Link>
          </div>
          <nav className="hidden items-center space-x-8 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="tracking-wide text-[#ededed] transition-colors duration-200 hover:text-[#8d6e3d]"
              >
                {item.name}
              </Link>
            ))}
            <LoginDialog />
          </nav>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#ededed] hover:text-[#8d6e3d]"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <section>
        {isMenuOpen && (
          <div className="border-t border-[#8d6e3d]/20 bg-black/95 backdrop-blur-md md:hidden">
            <div className="space-y-4 px-4 py-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 tracking-wide text-[#ededed] transition-colors duration-200 hover:text-[#8d6e3d]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <LoginDialog />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Header
