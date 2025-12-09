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
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ConfirmDeleteDialog from "@/components/admin/confirm_delete_dialog"
import EditBookingDialog, {
  BookingItem,
  EditAppointment,
  Service,
  Professional,
} from "@/components/booking/editbooking_dialog"

interface User {
  id: number
  name: string
  email: string
  phone: string
}

const Account = () => {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<User | null>(null)
  const [upcomingBookings, setUpcomingBookings] = useState<BookingItem[]>([])
  const [pastBookings, setPastBookings] = useState<BookingItem[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editBookingOpen, setEditBookingOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(
    null,
  )
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  )
  const [openEdit, setOpenEdit] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "" })

  const [editingData, setEditingData] = useState<EditAppointment>({
    id: 0,
    services: [],
    serviceProfessionals: {},
    costumerName: "",
    costumerPhone: "",
    date: "",
    time: "",
  })

  const router = useRouter()

  const handleHomePage = () => router.push("/")

  function subtractHours(time: string, hours: number) {
    const [h, m] = time.split(":").map(Number)

    const date = new Date()
    date.setHours(h)
    date.setMinutes(m)

    date.setHours(date.getHours() - hours)

    const newH = String(date.getHours()).padStart(2, "0")
    const newM = String(date.getMinutes()).padStart(2, "0")

    return `${newH}:${newM}`
  }

  const fetchBookings = async () => {
    if (!session) return
    const res = await fetch(`/api/account/${session.user.id}`)
    const data = await res.json()
    setUpcomingBookings(data.upcoming)
    setPastBookings(data.past)
  }

  useEffect(() => {
    if (status !== "authenticated") return
    async function load() {
      const res = await fetch(`/api/account/${session!.user.id}`)
      const data = await res.json()
      setUserData(data.user)
      setUpcomingBookings(data.upcoming)
      setPastBookings(data.past)
    }
    load()
  }, [status, session])

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      })
    }
  }, [userData])

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/services")
      const data = await res.json()
      setServices(data)
    }
    fetchServices()
  }, [])

  useEffect(() => {
    async function fetchProfessionals() {
      const res = await fetch("/api/employees")
      const data = await res.json()
      setProfessionals(data)
    }
    fetchProfessionals()
  }, [])

  const handleSaveProfile = async () => {
    const res = await fetch(`/api/account/${session!.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.success) {
      setUserData(data.user)
      setOpenEdit(false)
    }
  }

  const handleSaveEditBooking = async () => {
    if (!selectedBooking) return
    await fetch(`/api/booking/${selectedBooking.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        services: editingData.services.map((id) => ({
          id,
          professionalId: editingData.serviceProfessionals[id],
        })),
        costumerName: editingData.costumerName,
        costumerPhone: editingData.costumerPhone,
        date: editingData.date,
        time: editingData.time,
      }),
    })
    setEditBookingOpen(false)
    fetchBookings()
  }

  const handleDeleteBooking = async (id: number) => {
    const res = await fetch(`/api/booking/${id}`, { method: "DELETE" })
    if (res.ok) {
      setUpcomingBookings((prev) => prev.filter((b) => b.id !== id))
    } else {
      alert("Erro ao excluir agendamento")
    }
  }

  const openDeleteModal = (id: number) => {
    setSelectedBookingId(id)
    setDeleteModalOpen(true)
  }

  const handleOpenEditBooking = (booking: BookingItem) => {
    setSelectedBooking(booking)
    setEditBookingOpen(true)
  }

  if (!userData) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <p className="text-white/70">Carregando...</p>
      </section>
    )
  }

  return (
    <>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="border border-[#8d6e3d]/30 bg-[#0A0A0A] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#D4A574]">
              Editar Perfil
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Atualize suas informações pessoais abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nome completo
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Telefone
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                placeholder="(51) 99999-9999"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="border-[#2A2A2A] bg-[#1A1A1A] text-white focus:border-[#D4A574]"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Footer com Botões */}
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              className="border-red-600 text-red-400 hover:bg-red-900/20"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSaveProfile}
              className="bg-[#8d6e3d] text-black hover:bg-[#b28a55]"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <EditBookingDialog
        open={editBookingOpen}
        onOpenChange={setEditBookingOpen}
        defaultData={selectedBooking ?? undefined}
        services={services}
        professionals={professionals}
        editingData={editingData}
        setEditingData={setEditingData}
        handleEditAppointment={handleSaveEditBooking}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (selectedBookingId !== null) handleDeleteBooking(selectedBookingId)
        }}
      />

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
                        .map((n: string) => n[0])
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

                <Button
                  className="w-full border border-[#8d6e3d] bg-transparent text-[#8d6e3d] transition-all duration-300 hover:bg-[#8d6e3d] hover:text-black"
                  onClick={() => setOpenEdit(true)}
                >
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
                                <div>
                                  <h3 className="mb-0.5 text-lg font-semibold text-[#ededed]">
                                    {booking.services
                                      .map((s) => s.name)
                                      .join(", ")}
                                  </h3>
                                  <p className="mb-2 flex items-center gap-1.5 text-sm text-gray-400">
                                    <User className="h-3.5 w-3.5 text-[#8d6e3d]" />
                                    {booking.services
                                      .map(
                                        (s) =>
                                          s.professionalName || "Não informado",
                                      )
                                      .join(", ")}
                                  </p>
                                </div>
                              </div>
                              <Badge className="border border-green-700 bg-green-900/30 text-green-400 hover:bg-green-900/40">
                                <Check className="mr-1 h-3 w-3" />
                                Confirmado
                              </Badge>
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
                                  {subtractHours(booking.time, 3)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#8d6e3d]">R$</span>
                                <span className="text-[#ededed]">
                                  {booking.services.reduce(
                                    (acc, s) => acc + Number(s.price),
                                    0,
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="h-8 flex-1 border border-[#8d6e3d] bg-transparent text-[#8d6e3d] transition-all duration-300 hover:bg-[#8d6e3d] hover:text-black"
                                onClick={() => handleOpenEditBooking(booking)}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 flex-1 border-red-700 text-red-400 hover:bg-red-900/20 hover:text-red-400"
                                onClick={() => openDeleteModal(booking.id)}
                              >
                                Excluir
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
                                <div>
                                  <h3 className="mb-0.5 text-lg font-semibold text-[#ededed]">
                                    {booking.services
                                      .map((s) => s.name)
                                      .join(", ")}
                                  </h3>
                                  <p className="mb-2 flex items-center gap-1.5 text-sm text-gray-400">
                                    <User className="h-3.5 w-3.5 text-[#8d6e3d]" />
                                    {booking.services
                                      .map(
                                        (s) =>
                                          s.professionalName || "Não informado",
                                      )
                                      .join(", ")}
                                  </p>
                                </div>
                              </div>
                              <Badge className="border border-[#8d6e3d] bg-[#8d6e3d]/20 text-[#D4A574] hover:bg-[#8d6e3d]/30">
                                <Check className="mr-1 h-3 w-3" />
                                Finalizado
                              </Badge>
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
                                  {subtractHours(booking.time, 3)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[#8d6e3d]">R$</span>
                                <span className="text-[#ededed]">
                                  {booking.services.reduce(
                                    (acc, s) => acc + Number(s.price),
                                    0,
                                  )}
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
    </>
  )
}

export default Account
