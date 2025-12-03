"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { User } from "lucide-react"

type Props = {
  accountType: "existing" | "new"
  setAccountType: React.Dispatch<React.SetStateAction<"existing" | "new">>
  formData: {
    name: string
    phone: string
    email: string
    password: string
  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string
      phone: string
      email: string
      password: string
    }>
  >
}

const Step4Account = ({
  accountType,
  setAccountType,
  formData,
  setFormData,
}: Props) => {
  return (
    <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <User className="h-5 w-5 text-[#D4A574]" />
          <span>Seus dados</span>
        </CardTitle>
        <p className="mt-2 text-white/60">
          Preencha suas informações para finalizar
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selecionar tipo de conta */}
        <RadioGroup
          value={accountType}
          onValueChange={(value) => setAccountType(value as "existing" | "new")}
          className="flex items-center"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="existing"
              id="existing"
              className="border-[#D4A574] text-[#D4A574]"
            />
            <Label htmlFor="existing" className="cursor-pointer text-white">
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

        <Separator className="bg-[#2A2A2A]" />

        {/* Formulário de Login */}
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

        {/* Formulário de Cadastro */}
        {accountType === "new" && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
      </CardContent>
    </Card>
  )
}

export default Step4Account
