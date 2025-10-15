"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [accountType, setAccountType] = useState<"existing" | "new">("existing")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })
  const navigationItems = [
    { name: "SOBRE NÓS", href: "#sobre" },
    { name: "SERVIÇOS", href: "#servicos" },
    { name: "CONTATO", href: "#contato" },
    // { name: "MINHA CONTA", href: "/account" },
  ]

  const canSubmit =
    accountType === "existing"
      ? formData.email && formData.password
      : formData.name && formData.phone && formData.email && formData.password

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
            <Dialog>
              <form>
                <DialogTrigger asChild>
                  <Button className="primary">ENTRAR</Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] space-y-4">
                  <DialogHeader>
                    <DialogTitle>Faça Login/Cadastro para entrar</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3 space-y-4">
                      <RadioGroup
                        value={accountType}
                        onValueChange={(value) =>
                          setAccountType(value as "existing" | "new")
                        }
                        className="flex items-center"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="existing"
                            id="existing"
                            className="border-[#D4A574] text-[#D4A574]"
                          />
                          <Label
                            htmlFor="existing"
                            className="cursor-pointer text-white"
                          >
                            Já tenho uma conta
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="new"
                            id="new"
                            className="border-[#D4A574] text-[#D4A574]"
                          />
                          <Label
                            htmlFor="new"
                            className="cursor-pointer text-white"
                          >
                            Não tenho uma conta
                          </Label>
                        </div>
                      </RadioGroup>
                      {accountType === "existing" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                              placeholder="seu@email.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">
                              Senha
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                              placeholder="Digite sua senha"
                            />
                          </div>
                        </>
                      )}

                      {/* New Account Form */}
                      {accountType === "new" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">
                              Nome completo
                            </Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                              placeholder="Seu nome completo"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-white">
                              Telefone
                            </Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                              placeholder="(51) 99999-9999"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-white">
                              E-mail
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                              placeholder="seu@email.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">
                              Senha
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                              placeholder="Crie uma senha"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={!canSubmit}>
                      ENTRAR
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
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
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button className="primary">ENTRAR</Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90%] space-y-4">
                    <DialogHeader>
                      <DialogTitle>Faça Login/Cadastro para entrar</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3 space-y-4">
                        <RadioGroup
                          value={accountType}
                          onValueChange={(value) =>
                            setAccountType(value as "existing" | "new")
                          }
                          className="flex items-center"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="existing"
                              id="existing"
                              className="border-[#D4A574] text-[#D4A574]"
                            />
                            <Label
                              htmlFor="existing"
                              className="cursor-pointer text-white"
                            >
                              Já tenho uma conta
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="new"
                              id="new"
                              className="border-[#D4A574] text-[#D4A574]"
                            />
                            <Label
                              htmlFor="new"
                              className="cursor-pointer text-white"
                            >
                              Não tenho uma conta
                            </Label>
                          </div>
                        </RadioGroup>
                        {accountType === "existing" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-white">
                                Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                                placeholder="seu@email.com"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="password" className="text-white">
                                Senha
                              </Label>
                              <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                  }))
                                }
                                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                                placeholder="Digite sua senha"
                              />
                            </div>
                          </>
                        )}

                        {/* New Account Form */}
                        {accountType === "new" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="name" className="text-white">
                                Nome completo
                              </Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                                placeholder="Seu nome completo"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone" className="text-white">
                                Telefone
                              </Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                  }))
                                }
                                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                                placeholder="(51) 99999-9999"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-white">
                                E-mail
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                                placeholder="seu@email.com"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="password" className="text-white">
                                Senha
                              </Label>
                              <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                  }))
                                }
                                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                                placeholder="Crie uma senha"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={!canSubmit}>
                        ENTRAR
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Header
