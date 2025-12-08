"use client"

import React, { useEffect, useState } from "react"
import {
  ArrowLeft,
  Phone,
  Mail,
  Scissors,
  Check,
  Sparkles,
  Heart,
  Flower2,
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Step1Services from "@/components/booking/step1_services"
import Step2Professionals from "@/components/booking/step2_professionals"
import Step3DateTime from "@/components/booking/step3_datetime"
import Step4Account from "@/components/booking/step4_account"
import Summary from "@/components/booking/summary"
import SuccessBookingDialog from "@/components/booking/success_booking_dialog"

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
  "17:30",
]
const serviceIcons: Record<string, LucideIcon> = {
  Cabelo: Scissors,
  "Manicure/Pedicure": Sparkles,
  Massagem: Heart,
  "Depilação Corporal": Flower2,
}

const Bookings = () => {
  const router = useRouter()
  const { data: session, status, update } = useSession()
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
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })
  function subtractHoursFromTime(time: string, hours: number = 3) {
    const [h, m] = time.split(":").map(Number)

    const date = new Date()
    date.setHours(h)
    date.setMinutes(m)

    date.setHours(date.getHours() - hours)

    const newH = String(date.getHours()).padStart(2, "0")
    const newM = String(date.getMinutes()).padStart(2, "0")

    return `${newH}:${newM}`
  }

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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = React.useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const clientData = session?.user
        ? {
            id: session?.user?.id,
            name: session?.user?.name,
            email: session?.user?.email,
            phone: session?.user?.phone,
          }
        : formData

      if (!isAuthenticated && accountType === "existing") {
        const loginResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (loginResult?.error) throw new Error("Email ou senha incorretos")

        await update()
      }

      if (!selectedDate || !selectedTime) {
        alert("Por favor, selecione uma data e um horário válidos.")
        return
      }

      const formattedDate = selectedDate.toISOString().split("T")[0]
      const formattedTime = selectedTime

      const accountTypeToSend = accountType

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: selectedServiceDetails,
          professionals: selectedProfessionals,
          date: formattedDate,
          time: formattedTime,
          client: clientData,
          accountType: accountTypeToSend,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao realizar agendamento.")
      }

      setSuccessDialogOpen(true)
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : "Erro desconhecido"
      alert("❌ " + error)
    }
  }, [
    isSubmitting,
    update,
    isAuthenticated,
    accountType,
    selectedServiceDetails,
    selectedProfessionals,
    selectedDate,
    selectedTime,
    formData,
    session?.user,
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

        const data: string[] = await res.json()

        const bookedTimes = data.map((t) => {
          return subtractHoursFromTime(t, 3)
        })

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
              <Step1Services
                services={services}
                selectedServices={selectedServices}
                handleServiceToggle={handleServiceToggle}
                serviceIcons={serviceIcons}
              />
            )}

            {/* Etapa 2: Selecionar Profissional */}
            {currentStep === 2 && (
              <Step2Professionals
                professionals={professionals}
                selectedProfessionals={selectedProfessionals}
                selectedServiceDetails={selectedServiceDetails}
                handleProfessionalSelect={handleProfessionalSelect}
                serviceIcons={serviceIcons}
              />
            )}

            {/* Etapa 3: Selecionar Dia e Hora */}
            {currentStep === 3 && (
              <Step3DateTime
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                timeSlots={timeSlots}
                unavailableTimes={unavailableTimes}
                ptBR={ptBR}
              />
            )}

            {!isAuthenticated && currentStep === 4 && (
              <Step4Account
                accountType={accountType}
                setAccountType={setAccountType}
                formData={formData}
                setFormData={setFormData}
              />
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
            <Summary
              selectedServiceDetails={selectedServiceDetails}
              professionals={professionals}
              selectedProfessionals={selectedProfessionals}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              totalPrice={totalPrice}
            />

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

      <SuccessBookingDialog
        open={successDialogOpen}
        onOpenChange={(open) => {
          setSuccessDialogOpen(open)
          if (!open) router.push("/")
        }}
        title="Agendamento Criado!"
        content="O agendamento foi salvo com sucesso no sistema."
      />
    </section>
  )
}

export default Bookings
