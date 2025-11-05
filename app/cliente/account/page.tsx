"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Edit2,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Dados mock do usuário
const userData = {
  name: "Maria Silva",
  email: "maria.silva@email.com",
  phone: "+55 11 98765-4321",
  address: "São Paulo, SP",
  memberSince: "Janeiro 2024",
}

// Dados mock de agendamentos
const upcomingBookings = [
  {
    id: 1,
    service: "Corte + Escova",
    professional: "Ana Carolina",
    date: "15 de Outubro, 2025",
    time: "14:00",
    price: "R$ 150,00",
    status: "confirmed",
  },
  {
    id: 2,
    service: "Manicure e Pedicure",
    professional: "Juliana Santos",
    date: "20 de Outubro, 2025",
    time: "10:30",
    price: "R$ 80,00",
    status: "confirmed",
  },
  {
    id: 3,
    service: "Coloração Completa",
    professional: "Patricia Mendes",
    date: "25 de Outubro, 2025",
    time: "15:00",
    price: "R$ 320,00",
    status: "confirmed",
  },
]

const pastBookings = [
  {
    id: 4,
    service: "Hidratação Profunda",
    professional: "Ana Carolina",
    date: "01 de Outubro, 2025",
    time: "16:00",
    price: "R$ 180,00",
    status: "completed",
  },
  {
    id: 5,
    service: "Design de Sobrancelhas",
    professional: "Carla Rodrigues",
    date: "22 de Setembro, 2025",
    time: "11:00",
    price: "R$ 60,00",
    status: "completed",
  },
  {
    id: 6,
    service: "Corte + Escova",
    professional: "Ana Carolina",
    date: "10 de Setembro, 2025",
    time: "14:30",
    price: "R$ 150,00",
    status: "completed",
  },
  {
    id: 7,
    service: "Massagem Relaxante",
    professional: "Beatriz Lima",
    date: "05 de Setembro, 2025",
    time: "09:00",
    price: "R$ 200,00",
    status: "completed",
  },
]

const Account = () => {
  const router = useRouter()

  const handleHomePage = () => {
    router.push("/")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="border border-green-700 bg-green-900/30 text-green-400 hover:bg-green-900/40">
            <Check className="mr-1 h-3 w-3" />
            Confirmado
          </Badge>
        )
      case "completed":
        return (
          <Badge className="border border-[#8d6e3d] bg-[#8d6e3d]/20 text-[#D4A574] hover:bg-[#8d6e3d]/30">
            <Check className="mr-1 h-3 w-3" />
            Finalizado
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="border border-red-700 bg-red-900/30 text-red-400 hover:bg-red-900/40">
            <X className="mr-1 h-3 w-3" />
            Cancelado
          </Badge>
        )
      default:
        return null
    }
  }
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
                Minha Conta
              </h1>
              <p className="mt-1 text-white/70">
                Gerencie suas informações e agendamentos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Coluna esquerda - Informações da conta */}
          <div className="lg:col-span-1">
            <Card className="border-[#8d6e3d]/20 bg-[#0A0A0A] p-6">
              <div className="mb-6 flex flex-col items-center">
                <Avatar className="mb-4 h-24 w-24 border-2 border-[#8d6e3d]">
                  <AvatarFallback className="bg-[#8d6e3d] text-2xl text-black">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mb-1 text-2xl text-[#ededed]">
                  {userData.name}
                </h2>
              </div>

              <Separator className="mb-6 bg-[#8d6e3d]/20" />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-[#8d6e3d]" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">E-mail</p>
                    <p className="text-[#ededed]">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-[#8d6e3d]" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p className="text-[#ededed]">{userData.phone}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-[#8d6e3d]/20" />

              <Button className="w-full border border-[#8d6e3d] bg-transparent text-[#8d6e3d] transition-all duration-300 hover:bg-[#8d6e3d] hover:text-black">
                <Edit2 className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </Card>
          </div>

          {/* Coluna direita - Agendamentos */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-6 w-full border border-[#8d6e3d]/20 bg-[#0A0A0A] p-1">
                <TabsTrigger
                  value="upcoming"
                  className="flex-1 text-gray-400 data-[state=active]:bg-[#8d6e3d] data-[state=active]:text-black"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Próximos Agendamentos ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="flex-1 text-gray-400 data-[state=active]:bg-[#8d6e3d] data-[state=active]:text-black"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Histórico ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              {/* Agendamentos Futuros */}
              <TabsContent value="upcoming" className="mt-0">
                <div className="space-y-3">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                      <div key={booking.id}>
                        <Card className="mb-6 border-[#8d6e3d]/20 bg-[#0A0A0A] p-4 transition-all duration-300 hover:border-[#8d6e3d]/40">
                          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                              <h3 className="mb-0.5 text-lg text-[#ededed]">
                                {booking.service}
                              </h3>
                              <p className="flex items-center gap-1.5 text-sm text-gray-400">
                                <User className="h-3.5 w-3.5 text-[#8d6e3d]" />
                                {booking.professional}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#8d6e3d]" />
                              <span className="text-[#ededed]">
                                {booking.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-[#8d6e3d]" />
                              <span className="text-[#ededed]">
                                {booking.time}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[#8d6e3d]">R$</span>
                              <span className="text-[#ededed]">
                                {booking.price}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="h-8 flex-1 border border-[#8d6e3d] bg-transparent text-[#8d6e3d] transition-all duration-300 hover:bg-[#8d6e3d] hover:text-black"
                            >
                              Remarcar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 flex-1 border-red-700 text-red-400 hover:bg-red-900/20 hover:text-red-400"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <Card className="border-[#8d6e3d]/20 bg-[#0A0A0A] p-8 text-center">
                      <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                      <p className="text-gray-400">
                        Você não tem agendamentos futuros
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Agendamentos Passados */}
              <TabsContent value="past" className="mt-0">
                <div className="space-y-3">
                  {pastBookings.length > 0 ? (
                    pastBookings.map((booking) => (
                      <div key={booking.id}>
                        <Card className="mb-6 border-[#8d6e3d]/20 bg-[#0A0A0A] p-4 transition-all duration-300 hover:border-[#8d6e3d]/40">
                          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                              <h3 className="mb-0.5 text-lg text-[#ededed]">
                                {booking.service}
                              </h3>
                              <p className="flex items-center gap-1.5 text-sm text-gray-400">
                                <User className="h-3.5 w-3.5 text-[#8d6e3d]" />
                                {booking.professional}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>

                          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#8d6e3d]" />
                              <span className="text-[#ededed]">
                                {booking.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-[#8d6e3d]" />
                              <span className="text-[#ededed]">
                                {booking.time}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="text-[#8d6e3d]">R$</span>
                              <span className="text-[#ededed]">
                                {booking.price}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <Card className="border-[#8d6e3d]/20 bg-[#0A0A0A] p-8 text-center">
                      <Check className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                      <p className="text-gray-400">
                        Você ainda não tem histórico de agendamentos
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Account
