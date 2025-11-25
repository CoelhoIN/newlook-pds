"use client"

import React, { useEffect, useState } from "react"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Scissors,
  Check,
  Users,
  Sparkles,
  Heart,
  Flower2,
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ptBR } from "date-fns/locale"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"

type Service = {
  id: number
  name: string
  category: string
  price: number
}

type Professional = {
  id: number
  name: string
  experience: string
  description: string
  status: string
  services?: Service[]
  specialties: number[]
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]
const serviceIcons: Record<string, LucideIcon> = {
  Cabelo: Scissors,
  "Manicure/Pedicure": Sparkles,
  Massagem: Heart,
  "Depilação Corporal": Flower2,
}

const Bookings = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])

  const handleHomePage = () => {
    router.push("/")
  }
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedProfessionals, setSelectedProfessionals] = useState<{
    [serviceId: string]: string
  }>({})
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [accountType, setAccountType] = useState<"existing" | "new">("existing")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, professionalsRes] = await Promise.all([
          fetch("/api/services"),
          fetch("/api/employees"),
        ])
        const servicesData = await servicesRes.json()
        const professionalsData = await professionalsRes.json()
        setServices(servicesData)
        setProfessionals(professionalsData)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      }
    }
    fetchData()
  }, [])

  const selectedServiceDetails = services.filter((service) =>
    selectedServices.includes(service.id.toString()),
  )

  const totalPrice = selectedServiceDetails.reduce((total, service) => {
    return (
      total +
      parseFloat(service.price.toString().replace("R$ ", "").replace(",", "."))
    )
  }, 0)

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    )
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = React.useCallback(async () => {
    try {
      const clientData = isAuthenticated
        ? {
            name: session?.user?.name,
            email: session?.user?.email,
            phone: session?.user?.phone || "",
          }
        : formData

      if (!isAuthenticated && accountType === "existing") {
        const loginResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (loginResult?.error) throw new Error("Email ou senha incorretos")
        router.refresh()
      }

      if (!selectedDate || !selectedTime) {
        alert("Por favor, selecione uma data e um horário válidos.")
        return
      }

      const formattedDate = selectedDate.toISOString().split("T")[0]
      const formattedTime = selectedTime

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: selectedServiceDetails,
          professionals: selectedProfessionals,
          date: formattedDate,
          time: formattedTime,
          client: clientData,
          accountType: isAuthenticated ? "existing" : accountType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar agendamento.")
      }

      alert("✅ " + data.message)
      router.push("/")
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Erro desconhecido"
      alert("❌ " + error)
    }
  }, [
    isAuthenticated,
    accountType,
    router,
    selectedServiceDetails,
    selectedProfessionals,
    selectedDate,
    selectedTime,
    formData,
    session?.user?.name,
    session?.user?.email,
    session?.user?.phone,
  ])

  useEffect(() => {
    if (isAuthenticated && currentStep === 4) {
      handleSubmit()
    }
  }, [isAuthenticated, currentStep, handleSubmit])

  const handleProfessionalSelect = (
    serviceId: string,
    professionalId: string,
  ) => {
    setSelectedProfessionals((prev) => ({
      ...prev,
      [serviceId]: professionalId,
    }))
  }

  const canProceedStep1 = selectedServices.length > 0
  const canProceedStep2 = selectedServices.every(
    (serviceId) => selectedProfessionals[serviceId],
  )
  const canProceedStep3 = selectedDate && selectedTime
  const canSubmit =
    accountType === "existing"
      ? formData.email && formData.password
      : formData.name && formData.phone && formData.email && formData.password

  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([])

  useEffect(() => {
    async function fetchUnavailableTimes() {
      if (!selectedDate) {
        setUnavailableTimes([])
        return
      }

      try {
        const dateStr = selectedDate.toISOString().split("T")[0]
        const res = await fetch(`/api/booking?date=${dateStr}`)

        const data: { date: string }[] = await res.json()

        console.log("Horários retornados do banco:", data)

        const filtered = data.filter(
          (b) => b.date && b.date.startsWith(dateStr),
        )

        const bookedTimes = filtered.map((b) => {
          const timePart = new Date(b.date!).toTimeString().slice(0, 5)
          return timePart
        })

        console.log("Horários ocupados normalizados:", bookedTimes)
        setUnavailableTimes(bookedTimes)
      } catch (error) {
        console.error("Erro ao buscar horários ocupados:", error)
        setUnavailableTimes([])
      }
    }

    fetchUnavailableTimes()
  }, [selectedDate])

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] pb-12 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHomePage}
              className="text-white hover:bg-[#D4A574]/10 hover:text-[#D4A574]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl text-[#D4A574] md:text-4xl">
                Agendamento
              </h1>
              <p className="mt-1 text-white/70">
                Reserve seu horário em 4 passos simples
              </p>
            </div>
          </div>

          {/* Etapas */}
          <div className="hidden items-center space-x-4 md:flex">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
                    step <= currentStep
                      ? "bg-[#D4A574] text-black"
                      : "bg-[#2A2A2A] text-white/50"
                  }`}
                >
                  {step < currentStep ? <Check className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`mx-2 h-0.5 w-12 transition-colors duration-300 ${
                      step < currentStep ? "bg-[#D4A574]" : "bg-[#2A2A2A]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Etapa 1: Selecionar Serviço */}
            {currentStep === 1 && (
              <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Scissors className="h-5 w-5 text-[#D4A574]" />
                    <span>Escolha seus serviços</span>
                  </CardTitle>
                  <p className="mt-2 text-white/60">
                    Selecione os serviços que deseja agendar
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    "Cabelo",
                    "Manicure/Pedicure",
                    "Massagem",
                    "Depilação Corporal",
                  ].map((category) => (
                    <div key={category}>
                      <h3 className="mb-4 text-[#D4A574]">{category}</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {services
                          .filter((service) => service.category === category)
                          .map((service) => {
                            const IconComponent =
                              serviceIcons[service.category] || Scissors
                            const isSelected = selectedServices.includes(
                              service.id.toString(),
                            )

                            return (
                              <div
                                key={service.id}
                                className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
                                  isSelected
                                    ? "border-[#D4A574] bg-[#D4A574]/10"
                                    : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#D4A574]/30"
                                }`}
                                onClick={() =>
                                  handleServiceToggle(service.id.toString())
                                }
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div
                                      className={`rounded-full p-2 ${
                                        isSelected
                                          ? "bg-[#D4A574]"
                                          : "bg-[#2A2A2A]"
                                      }`}
                                    >
                                      <IconComponent
                                        className={`h-4 w-4 ${
                                          isSelected
                                            ? "text-black"
                                            : "text-[#D4A574]"
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <h4 className="text-white">
                                        {service.name}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[#D4A574]">
                                      {Number(service.price).toLocaleString(
                                        "pt-BR",
                                        {
                                          style: "currency",
                                          currency: "BRL",
                                        },
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Etapa 2: Selecionar Profissional */}
            {currentStep === 2 && (
              <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Users className="h-5 w-5 text-[#D4A574]" />
                    <span>Escolha os profissionais</span>
                  </CardTitle>
                  <p className="mt-2 text-white/60">
                    Selecione um profissional para cada serviço
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {selectedServiceDetails.map((service) => {
                    const availableProfessionals = professionals.filter(
                      (prof) => prof.specialties.includes(service.id),
                    )
                    const selectedProfessional =
                      selectedProfessionals[service.id]

                    return (
                      <div key={service.id} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                          <div className="flex items-center space-x-3">
                            <div className="rounded-full bg-[#D4A574]/10 p-2">
                              {serviceIcons[service.category] ? (
                                React.createElement(
                                  serviceIcons[service.category],
                                  {
                                    className: "h-5 w-5 text-[#D4A574]",
                                  },
                                )
                              ) : (
                                <Scissors className="h-5 w-5 text-[#D4A574]" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg text-white">
                                {service.name}
                              </h3>
                              <p className="text-sm text-white/60">
                                {Number(service.price).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {availableProfessionals.map((professional) => {
                            const isSelected =
                              selectedProfessional ===
                              professional.id.toString()

                            return (
                              <div
                                key={professional.id}
                                className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
                                  isSelected
                                    ? "border-[#D4A574] bg-[#D4A574]/10"
                                    : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#D4A574]/30"
                                }`}
                                onClick={() =>
                                  handleProfessionalSelect(
                                    service.id.toString(),
                                    professional.id.toString(),
                                  )
                                }
                              >
                                <div className="flex items-start space-x-4">
                                  <div className="flex-1">
                                    <div className="mb-2 flex items-center justify-between">
                                      <h4 className="text-white">
                                        {professional.name}
                                      </h4>
                                    </div>

                                    <p className="mb-2 text-sm text-white/60">
                                      {professional.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <Badge
                                        variant="outline"
                                        className="border-[#D4A574]/30 text-[#D4A574]"
                                      >
                                        <p>
                                          {professional.experience} de
                                          experiência
                                        </p>
                                      </Badge>
                                      {isSelected && (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A574]">
                                          <Check className="h-4 w-4 text-black" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Etapa 3: Selecionar Dia e Hora */}
            {currentStep === 3 && (
              <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <CalendarIcon className="h-5 w-5 text-[#D4A574]" />
                    <span>Escolha data e horário</span>
                  </CardTitle>
                  <p className="mt-2 text-white/60">
                    Selecione quando deseja ser atendido
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <Label className="mb-4 block text-white">Data</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        locale={ptBR}
                        className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]"
                      />
                    </div>
                    <div>
                      <Label className="mb-4 block text-white">
                        Horário disponível
                      </Label>
                      <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto">
                        {timeSlots.map((time) => {
                          const isUnavailable = unavailableTimes.includes(time)
                          const isSelected = selectedTime === time

                          return (
                            <Button
                              key={time}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              disabled={isUnavailable}
                              className={`${
                                isUnavailable
                                  ? "cursor-not-allowed opacity-50"
                                  : isSelected
                                    ? "bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                                    : "border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                              }`}
                              onClick={() => {
                                if (!isUnavailable) setSelectedTime(time)
                              }}
                            >
                              {time}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isAuthenticated && currentStep === 4 && (
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
            )}

            {/* Botões de Navegação */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 disabled:opacity-50"
              >
                Voltar
              </Button>

              {currentStep < 4 || isAuthenticated ? (
                <Button
                  onClick={
                    currentStep === 3 && isAuthenticated
                      ? handleSubmit
                      : handleNext
                  }
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2) ||
                    (currentStep === 3 && !canProceedStep3)
                  }
                  className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90 disabled:opacity-50"
                >
                  {currentStep === 3 && isAuthenticated
                    ? "Confirmar Agendamento"
                    : "Continuar"}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90 disabled:opacity-50"
                >
                  Confirmar Agendamento
                </Button>
              )}
            </div>
          </div>

          {/* Resumo do Agendamento */}
          <div className="space-y-6">
            <Card className="top-24 border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Resumo do Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedServiceDetails.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {selectedServiceDetails.map((service) => {
                        const selectedProfessional = professionals.find(
                          (p) =>
                            p.id.toString() ===
                            selectedProfessionals[service.id],
                        )

                        return (
                          <div key={service.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white">{service.name}</span>
                              <span className="text-[#D4A574]">
                                {Number(service.price).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </span>
                            </div>
                            {selectedProfessional && (
                              <div className="flex items-center space-x-2 text-xs text-white/60">
                                <span>com {selectedProfessional.name}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <Separator className="bg-[#2A2A2A]" />

                    {selectedDate && selectedTime && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Data:</span>
                          <span className="text-white">
                            {selectedDate?.toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Horário:</span>
                          <span className="text-white">{selectedTime}</span>
                        </div>
                      </div>
                    )}

                    <Separator className="bg-[#2A2A2A]" />

                    <div className="flex items-center justify-between">
                      <span className="text-white">Total:</span>
                      <span className="text-xl text-[#D4A574]">
                        R$ {totalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="py-8 text-center text-white/60">
                    Nenhum serviço selecionado
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Infos para Contato */}
            <Card className="border-[#2e2e2e] bg-black/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-[#ededed]">
                  Precisa de ajuda?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-[#8d6e3d]" />
                  <span className="text-[#ededed]">(51) 99501-1950</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-[#8d6e3d]" />
                  <span className="text-[#ededed]">
                    newlook.2004@outlook.com
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Bookings
