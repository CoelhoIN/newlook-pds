"use client"

import Link from "next/link"
import { Button } from "./ui/button"
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
import { useSession, signIn, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useRouter } from "next/navigation"

const LoginDialog = () => {
  const { data: session } = useSession()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [accountType, setAccountType] = useState<"existing" | "new">("existing")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })

  const canSubmit =
    accountType === "existing"
      ? formData.email && formData.password
      : formData.name && formData.phone && formData.email && formData.password

  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="uppercase text-[#ededed] hover:text-[#8d6e3d]"
                >
                  {session.user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {session.user.role === "ADMIN" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/dashboard"
                        className="cursor-pointer !text-inherit transition-colors hover:!text-[#8d6e3d]"
                      >
                        Painel de Controle
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/agenda"
                        className="cursor-pointer !text-inherit transition-colors hover:!text-[#8d6e3d]"
                      >
                        Agenda
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/cliente/bookings"
                        className="cursor-pointer !text-inherit transition-colors hover:!text-[#8d6e3d]"
                      >
                        Marcar Agendamento
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/cliente/account"
                        className="cursor-pointer !text-inherit transition-colors hover:!text-[#8d6e3d]"
                      >
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer !text-inherit transition-colors hover:!text-[#8d6e3d]"
                >
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="primary">ENTRAR</Button>
          )}
        </DialogTrigger>

        {!session?.user && (
          <DialogContent className="w-[90%] space-y-4">
            <DialogHeader>
              <DialogTitle>Faça Login ou Cadastre-se</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setIsLoading(true)
                setError("")

                try {
                  if (accountType === "new") {
                    const res = await fetch("/api/register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(formData),
                    })

                    const data = await res.json()
                    if (!res.ok)
                      throw new Error(data.error || "Erro ao cadastrar")

                    const loginResult = await signIn("credentials", {
                      email: formData.email,
                      password: formData.password,
                      redirect: false,
                    })

                    if (loginResult?.error)
                      throw new Error("Erro ao fazer login")
                    router.refresh()
                  } else {
                    const result = await signIn("credentials", {
                      email: formData.email,
                      password: formData.password,
                      redirect: false,
                    })

                    if (result?.error)
                      throw new Error("Email ou senha incorretos")
                    router.refresh()
                  }
                } catch (err: unknown) {
                  if (err instanceof Error) {
                    setError(err.message)
                  } else {
                    setError("Erro inesperado")
                  }
                } finally {
                  setIsLoading(false)
                }
              }}
              className="space-y-4"
            >
              <RadioGroup
                value={accountType}
                onValueChange={(value) =>
                  setAccountType(value as "existing" | "new")
                }
                className="flex items-center gap-4"
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
                  <Label htmlFor="new" className="cursor-pointer text-white">
                    Não tenho uma conta
                  </Label>
                </div>
              </RadioGroup>

              {/* Campos de formulário */}
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
                        setFormData((p) => ({
                          ...p,
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
                        setFormData((p) => ({
                          ...p,
                          phone: e.target.value,
                        }))
                      }
                      className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                      placeholder="(51) 99999-9999"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
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
                    setFormData((p) => ({
                      ...p,
                      password: e.target.value,
                    }))
                  }
                  className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                  placeholder={
                    accountType === "existing"
                      ? "Digite sua senha"
                      : "Crie uma senha"
                  }
                />
              </div>

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <DialogFooter>
                <Button type="submit" disabled={!canSubmit || isLoading}>
                  {isLoading
                    ? "Entrando..."
                    : accountType === "new"
                      ? "Cadastrar"
                      : "Entrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}

export default LoginDialog
