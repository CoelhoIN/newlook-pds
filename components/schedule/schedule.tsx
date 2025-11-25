"use client"
import React, { useState, useRef, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar as CalendarIcon,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  CalendarDays,
  DollarSign,
  User,
  Scissors,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react"
import type { EventClickArg, EventInput } from "@fullcalendar/core"
import "./schedule.css"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"

type Service = {
  id: number
  name: string
  category: string
  price: number
  duration: number
}

type Professional = {
  id: number
  name: string
  experience: string
  status: string
  services?: Service[]
}

interface Appointment {
  id: string
  costumerName: string
  costumerPhone: string
  service: string
  professional?: string
  price: string
  date: Date
  status?: "confirmed" | "completed"
}

interface SelectedEvent {
  id: string
  title: string
  start: Date | null
  end: Date | null
  costumerName?: string
  costumerPhone?: string
  service?: string
  professional?: string
  price?: string
}

const Schedule = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const calendarRef = useRef<FullCalendar>(null)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [currentTitle, setCurrentTitle] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  async function fetchServices() {
    const res = await fetch("/api/services")
    const data = await res.json()
    setServices(data)
  }

  async function fetchProfessionals() {
    const res = await fetch("/api/employees")
    const data = await res.json()
    setProfessionals(data)
  }

  const [newAppointment, setNewAppointment] = useState({
    costumerName: "",
    costumerPhone: "",
    services: [] as number[],
    serviceProfessionals: {} as Record<number, number>,
    date: "",
    time: "",
  })

  function handleToggleService(id: number) {
    setNewAppointment((prev) => {
      const already = prev.services.includes(id)
      return {
        ...prev,
        services: already
          ? prev.services.filter((s) => s !== id)
          : [...prev.services, id],
      }
    })
  }

  function handleRemoveService(id: number) {
    setNewAppointment((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== id),
    }))
  }

  function handleServiceProfessionalChange(serviceId: number, empId: string) {
    setNewAppointment((prev) => ({
      ...prev,
      serviceProfessionals: {
        ...prev.serviceProfessionals,
        [serviceId]: Number(empId),
      },
    }))
  }

  function isFormValid() {
    return (
      newAppointment.costumerName &&
      newAppointment.costumerPhone &&
      newAppointment.date &&
      newAppointment.time &&
      newAppointment.services.length > 0
    )
  }

  const getTotalPrice = () => {
    return newAppointment.services.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        const price = parseFloat(
          service.price.toString().replace("R$ ", "").replace(",", "."),
        )
        return total + price
      }
      return total
    }, 0)
  }

  const getTotalDuration = () => {
    return newAppointment.services.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        return total + service.duration
      }
      return total
    }, 0)
  }

  async function handleSaveAppointment() {
    try {
      const body = {
        client: {
          name: newAppointment.costumerName,
          phone: newAppointment.costumerPhone,
        },
        accountType: "admin",
        services: newAppointment.services.map((id) => {
          const s = services.find((srv) => srv.id === id)
          return {
            id: s?.id,
            price: s?.price,
          }
        }),
        professionals: newAppointment.serviceProfessionals,
        date: newAppointment.date,
        time: newAppointment.time,
      }

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const created = await res.json()

      if (!res.ok) {
        alert(created.error)
        return
      }

      setAppointments((prev) => [...prev, created])

      const calendarApi = calendarRef.current?.getApi()
      calendarApi?.addEvent({
        id: created.id,
        title: `${created.costumerName} - ${created.service}`,
        start: new Date(created.date),
        backgroundColor: "#D4A574",
        borderColor: "#D4A574",
        extendedProps: {
          costumerName: created.costumerName,
          costumerPhone: created.costumerPhone,
          service: created.service,
          professional: created.professional,
          price: created.price,
        },
      })

      setIsSuccessModalOpen(true)
      setIsNewAppointmentOpen(false)
    } catch (error) {
      console.error(error)
      alert("Erro ao salvar agendamento!")
    }
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/booking")
        if (!res.ok) throw new Error("Erro ao buscar agendamentos")
        const data = await res.json()
        const normalized: Appointment[] = data.map((d: Appointment) => ({
          ...d,
          date: d.date ? new Date(d.date) : null,
        }))
        setAppointments(normalized)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAppointments()
  }, [])

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi()
    if (!calendarApi) return

    calendarApi.removeAllEvents()

    appointments.forEach((apt) => {
      calendarApi.addEvent({
        id: apt.id.toString(),
        title: `${apt.costumerName} - ${apt.service}`,
        start: apt.date,
        backgroundColor: "#D4A574",
        borderColor: "#D4A574",
        extendedProps: {
          ...apt,
        },
      })
    })
  }, [appointments])

  useEffect(() => {
    fetchServices()
    fetchProfessionals()
  }, [])

  useEffect(() => {
    const eventsMapped = appointments.map((apt) => {
      const date = new Date(apt.date)

      return {
        id: String(apt.id),
        title: `${apt.costumerName} - ${apt.service}`,
        start: date,
        backgroundColor: "#D4A574",
        borderColor: "#D4A574",
        extendedProps: {
          costumerName: apt.costumerName,
          costumerPhone: apt.costumerPhone,
          service: apt.service,
          professional: apt.professional,
          price: apt.price,
        },
      }
    })

    setCalendarEvents(eventsMapped)
  }, [appointments])

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      ...event.extendedProps,
    })
    setIsDialogOpen(true)
  }

  const handlePrevious = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.prev()
  }

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.next()
  }

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.today()
  }

  const handleViewChange = (view: string) => {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.changeView(view)
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] pb-12 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-12">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl text-[#D4A574] md:text-4xl">
                Calendário de Agendamentos
              </h1>
              <p className="mt-1 text-white/70">
                Visualize todos os agendamentos
              </p>
            </div>
          </div>

          {/* Dashboard */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div>
              <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 sm:text-sm">Total</p>
                      <p className="mt-1 text-xl text-white sm:text-2xl">
                        {appointments.length}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#D4A574]/10 p-2 sm:p-3">
                      <CalendarIcon className="h-4 w-4 text-[#D4A574] sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 sm:text-sm">
                        Confirmados
                      </p>
                      <p className="mt-1 text-xl text-white sm:text-2xl">
                        {appointments.length}
                      </p>
                    </div>
                    <div className="rounded-full bg-green-500/10 p-2 sm:p-3">
                      <CalendarDays className="h-4 w-4 text-green-500 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 sm:text-sm">
                        Pendentes
                      </p>
                      <p className="mt-1 text-xl text-white sm:text-2xl">
                        {appointments.length}
                      </p>
                    </div>
                    <div className="rounded-full bg-yellow-500/10 p-2 sm:p-3">
                      <Clock className="h-4 w-4 text-yellow-500 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/60 sm:text-sm">
                        Receita
                      </p>
                      <p className="mt-1 text-xl text-white sm:text-2xl">
                        R${" "}
                        {appointments
                          .filter(
                            (a) =>
                              a.status === "confirmed" ||
                              a.status === "completed",
                          )
                          .reduce(
                            (sum, a) =>
                              sum +
                              parseFloat(
                                a.price.replace("R$ ", "").replace(",", "."),
                              ),
                            0,
                          )
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#D4A574]/10 p-2 sm:p-3">
                      <DollarSign className="h-4 w-4 text-[#D4A574] sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Calendário */}
        <div>
          <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToday}
                    className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="text-xl font-semibold text-[#D4A574]">
                  {currentTitle || "Calendário"}
                </h2>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChange("dayGridMonth")}
                    className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                  >
                    <Grid3x3 className="mr-2 h-4 w-4" />
                    Mês
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChange("timeGridWeek")}
                    className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Semana
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChange("timeGridDay")}
                    className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Dia
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChange("listWeek")}
                    className="border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                  >
                    <List className="mr-2 h-4 w-4" />
                    Lista
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                    onClick={() => setIsNewAppointmentOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agendar
                  </Button>
                </div>
              </div>

              {/* FullCalendar */}
              <div className="calendar-container">
                <FullCalendar
                  timeZone="local"
                  ref={calendarRef}
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                  ]}
                  initialView="dayGridMonth"
                  locale={ptBrLocale}
                  headerToolbar={false}
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  height="auto"
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  allDaySlot={false}
                  expandRows={true}
                  nowIndicator={true}
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  eventContent={(arg) => {
                    const eventDate = arg.event.start
                      ? new Date(arg.event.start)
                      : null
                    const isPast = eventDate ? eventDate < new Date() : false

                    const bgColor = isPast ? "#4a4a4a" : "#8d6e3d"
                    const textColor = isPast ? "#CECECE" : "white"
                    return {
                      html: `
                        <div class="fc-event-main-frame" style="padding: 2px 4px; background-color:${bgColor}; color: ${textColor}; border-radius: 6px;">
                          <div class="fc-event-time" style="font-size: 0.75rem;">${arg.timeText}</div>
                          <div class="fc-event-title-container">
                            <div class="fc-event-title" style="font-size: 0.75rem; white-space: normal;">${arg.event.title}</div>
                          </div>
                        </div>
                      `,
                    }
                  }}
                  datesSet={(dateInfo) => {
                    setCurrentTitle(dateInfo.view.title)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Detalhes do Agendamento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl border-[#2A2A2A] bg-[#1A1A1A] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#D4A574]">
              Detalhes do Agendamento
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[#D4A574]">
                  R${" "}
                  {Number(selectedEvent.price || 0)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>

              {/* Infos do Cliente */}
              <div className="space-y-3 rounded-lg bg-black/30 p-4">
                <h3 className="mb-3 text-sm text-white/60">
                  Informações do Cliente
                </h3>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#D4A574]/10 p-3">
                    <User className="h-5 w-5 text-[#D4A574]" />
                  </div>
                  <div>
                    <p className="text-white">{selectedEvent.costumerName}</p>
                    <p className="text-sm text-white/60">Cliente</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Phone className="h-4 w-4 text-[#D4A574]" />
                    <span>{selectedEvent.costumerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Infos Serviços e Hora */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-black/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#D4A574]/10 p-3">
                      <Scissors className="h-5 w-5 text-[#D4A574]" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-white/60">Serviço</p>
                      <p className="text-white">
                        {" "}
                        {(selectedEvent?.service ?? "").length > 0
                          ? selectedEvent.service
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-black/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-[#D4A574]/10 p-3">
                      <Clock className="h-5 w-5 text-[#D4A574]" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-white/60">Horário</p>
                      <p className="text-white">
                        {selectedEvent.start?.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infos Profissionais */}
              <div className="rounded-lg bg-black/30 p-4">
                <h3 className="mb-3 text-sm text-white/60">Profissional</h3>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-white">
                      {" "}
                      {(selectedEvent?.professional ?? "").length > 0
                        ? selectedEvent.professional
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center gap-2 border-t border-[#2A2A2A] pt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
            >
              Editar
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-red-500 text-white hover:bg-red-600"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Novo Agendamento */}
      <Dialog
        open={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
      >
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-[#2A2A2A] bg-[#1A1A1A] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#D4A574]">
              Novo Agendamento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Infos do Cliente */}
            <div className="space-y-3 rounded-lg bg-black/30 p-4">
              <h3 className="mb-3 text-sm text-white/60">
                Informações do Cliente
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  type="text"
                  placeholder="Nome do Cliente"
                  value={newAppointment.costumerName}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      costumerName: e.target.value,
                    })
                  }
                  className="border-[#2A2A2A] bg-black/50 text-white"
                />
                <Input
                  type="text"
                  placeholder="Telefone"
                  value={newAppointment.costumerPhone}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      costumerPhone: e.target.value,
                    })
                  }
                  className="border-[#2A2A2A] bg-black/50 text-white"
                />
              </div>
            </div>

            {/* Serviços */}
            <div className="rounded-lg bg-black/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm text-white/60">Serviços</h3>
                {newAppointment.services.length > 0 && (
                  <div className="text-xs text-white/60">
                    {newAppointment.services.length}{" "}
                    {newAppointment.services.length === 1
                      ? "selecionado"
                      : "selecionados"}
                  </div>
                )}
              </div>
              {newAppointment.services.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2 rounded-lg bg-black/30 p-3">
                  {newAppointment.services.map((serviceId) => {
                    const service = services.find((s) => s.id === serviceId)
                    return service ? (
                      <Badge
                        key={serviceId}
                        variant="outline"
                        className="border-[#D4A574]/30 bg-[#D4A574]/10 px-3 py-1 text-[#D4A574]"
                      >
                        {service.name}
                        <button
                          onClick={() => handleRemoveService(serviceId)}
                          className="ml-2 transition-colors hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
              <div className="max-h-60 space-y-4 overflow-y-auto pr-2">
                {[
                  "Cabelo",
                  "Manicure/Pedicure",
                  "Massagem",
                  "Depilação Corporal",
                ].map((category) => (
                  <div key={category}>
                    <h4 className="mb-2 text-sm text-[#D4A574]">{category}</h4>
                    <div className="space-y-2">
                      {services
                        .filter((s) => s.category === category)
                        .map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center gap-3 rounded p-2 transition-colors hover:bg-black/30"
                          >
                            <Checkbox
                              id={String(service.id)}
                              checked={newAppointment.services.includes(
                                service.id,
                              )}
                              onCheckedChange={() =>
                                handleToggleService(service.id)
                              }
                              className="border-[#D4A574]/30 data-[state=checked]:border-[#D4A574] data-[state=checked]:bg-[#D4A574]"
                            />
                            <Label
                              htmlFor={service.id.toString()}
                              className="flex flex-1 cursor-pointer items-center justify-between text-sm text-white/80"
                            >
                              <span>{service.name}</span>
                              <span className="text-xs text-white/60">
                                {service.price} • {service.duration}min
                              </span>
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumo Serviços */}
              {newAppointment.services.length > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-[#2A2A2A] pt-4">
                  <div>
                    <p className="text-xs text-white/60">Duração Total</p>
                    <p className="text-white">{getTotalDuration()} minutos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60">Total</p>
                    <p className="text-[#D4A574]">
                      R$ {getTotalPrice().toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profissionais */}
            {newAppointment.services.length > 0 && (
              <div className="rounded-lg bg-black/30 p-4">
                <h3 className="mb-3 text-sm text-white/60">
                  Atribuir Profissionais aos Serviços
                </h3>
                <p className="mb-4 text-xs text-white/50">
                  Selecione um profissional para cada serviço escolhido
                </p>
                <div className="space-y-3">
                  {newAppointment.services.map((serviceId) => {
                    const service = services.find((s) => s.id === serviceId)
                    return service ? (
                      <div
                        key={serviceId}
                        className="flex flex-col gap-3 rounded-lg bg-black/30 p-3 sm:flex-row sm:items-center"
                      >
                        <div className="flex flex-1 items-center gap-2">
                          <div className="rounded-full bg-[#D4A574]/10 p-2">
                            <Scissors className="h-4 w-4 text-[#D4A574]" />
                          </div>
                          <div>
                            <p className="text-sm text-white">{service.name}</p>
                            <p className="text-xs text-white/60">
                              {service.duration} min • {service.price}
                            </p>
                          </div>
                        </div>
                        <div className="sm:w-48">
                          <Select
                            value={String(
                              newAppointment.serviceProfessionals[serviceId] ||
                                "",
                            )}
                            onValueChange={(value) =>
                              handleServiceProfessionalChange(serviceId, value)
                            }
                          >
                            <SelectTrigger className="border-[#2A2A2A] bg-black/50 text-white">
                              <SelectValue placeholder="Selecionar profissional" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/80 text-white">
                              {professionals
                                .filter((pro) =>
                                  pro.services?.some((s) => s.id === serviceId),
                                )
                                .map((pro) => (
                                  <SelectItem
                                    key={pro.id}
                                    value={String(pro.id)}
                                    className="text-white hover:bg-white/10"
                                  >
                                    {pro.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {/* Data e horário */}
            <div className="rounded-lg bg-black/30 p-4">
              <h3 className="mb-3 text-sm text-white/60">Data e Horário</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      date: e.target.value,
                    })
                  }
                  className="border-[#2A2A2A] bg-black/50 text-white"
                />
                <Input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      time: e.target.value,
                    })
                  }
                  className="border-[#2A2A2A] bg-black/50 text-white"
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex items-center gap-3 border-t border-[#2A2A2A] pt-4">
              <Button
                variant="outline"
                className="flex-1 border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
                onClick={() => setIsNewAppointmentOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                onClick={handleSaveAppointment}
                disabled={!isFormValid()}
              >
                <Plus className="mr-2 h-4 w-4" />
                Salvar Agendamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Agendamento Concluido */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="max-w-md border-[#2A2A2A] bg-[#1A1A1A] text-white">
          <div className="flex flex-col items-center justify-center space-y-6 py-6">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#D4A574]/20 blur-xl" />
              <div className="relative rounded-full border-2 border-[#D4A574] bg-[#D4A574]/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-[#D4A574]" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl text-[#D4A574]">Agendamento Criado!</h2>
              <p className="text-white/60">
                O agendamento foi salvo com sucesso no sistema.
              </p>
            </div>
            <div className="w-full">
              <Button
                className="w-full bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default Schedule
