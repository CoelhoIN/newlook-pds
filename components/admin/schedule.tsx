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
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  CalendarDays,
  DollarSign,
  Plus,
} from "lucide-react"
import type { EventClickArg, EventInput } from "@fullcalendar/core"
import "./schedule.css"
import BookingDetailsDialog from "./booking_details_dialog"

import SuccessBookingDialog from "../booking/success_booking_dialog"
import ConfirmDeleteDialog from "./confirm_delete_dialog"
import NewBookingDialog from "./newbooking_dialog"

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
export interface AppointmentService {
  id: number
  name: string
  price: number
  duration: number
  professionalId: number
  professionalName: string
}

interface Appointment {
  id: string
  costumerName: string
  costumerPhone: string
  services: {
    id: number
    name: string
    price: number | string
    duration: number
    professionalId: number
    professionalName: string
  }[]
  professionals?: Record<number, number>
  price: string
  date: Date
  status?: "confirmed" | "completed"
}

export interface EditingData {
  id: number
  costumerName: string
  costumerPhone: string
  userId?: number
  serviceId?: number
  services?: {
    id: number
    professionalId: number
    professionalName: string
  }[]

  professionals?: Record<number, number>
  date: string
  client?: {
    name?: string
    phone?: string
  }
}

export interface SelectedEvent {
  id: string
  title: string
  start: Date | null
  end: Date | null
  userId?: number
  costumerName?: string
  costumerPhone?: string
  price?: number
  services?: {
    id: number
    name: string
    duration: number
    price: number
    professionalId: number
    professionalName: string
  }[]
}

const Schedule = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  )
  const [isEditing, setIsEditing] = useState(false)
  const [editingData, setEditingData] = useState<EditingData | null>(null)
  const [currentTitle, setCurrentTitle] = useState("")
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successDialogData, setSuccessDialogData] = useState({
    title: "",
    content: "",
  })
  const calendarRef = useRef<FullCalendar>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [newAppointment, setNewAppointment] = useState({
    costumerName: "",
    costumerPhone: "",
    services: [] as number[],
    serviceProfessionals: {} as Record<number, number>,
    date: "",
    time: "",
    userId: null as number | null,
  })

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
    return Boolean(
      newAppointment.costumerName &&
        newAppointment.costumerPhone &&
        newAppointment.date &&
        newAppointment.time &&
        newAppointment.services.length > 0,
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

  function resetForm() {
    setNewAppointment({
      costumerName: "",
      costumerPhone: "",
      services: [],
      serviceProfessionals: {},
      date: "",
      time: "",
      userId: null,
    })
    setEditingData(null)
    setIsEditing(false)
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

      const createdWithProfessionals = {
        ...created,
        services: (created.services as Service[]).map((s) => {
          const professionalId = newAppointment.serviceProfessionals[s.id]
          const professional = professionals.find(
            (p) => p.id === professionalId,
          )
          return {
            ...s,
            professionalId,
            professionalName: professional?.name || "",
          }
        }),
      }

      setAppointments((prev) => [...prev, createdWithProfessionals])
      addEventToCalendar(createdWithProfessionals)

      setSuccessDialogData({
        title: "Agendamento Criado!",
        content: "O agendamento foi salvo com sucesso no sistema.",
      })
      setIsSuccessModalOpen(true)
      setIsNewAppointmentOpen(false)
    } catch (error) {
      console.error(error)
      alert("Erro ao salvar agendamento!")
    }
  }

  async function handleEditAppointment() {
    if (!editingData) return

    try {
      const dateValue = newAppointment.date
      const timeValue = newAppointment.time

      if (!dateValue || !timeValue) {
        alert("Data ou horário inválido!")
        return
      }

      const isLinkedToUser = Boolean(editingData?.userId)

      const servicesBody: { id?: number; price?: number | string }[] =
        newAppointment.services.map((serviceId) => {
          const service = services.find((s) => s.id === serviceId)
          return {
            id: service?.id,
            price: service?.price,
            professionalId: newAppointment.serviceProfessionals[serviceId],
          }
        })
      const body: {
        date: string
        time: string
        services: { id?: number; price?: number | string }[]
        professionals: Record<number, number>
        costumerName?: string
        costumerPhone?: string
      } = {
        date: newAppointment.date,
        time: newAppointment.time,
        services: servicesBody,
        professionals: newAppointment.serviceProfessionals,
      }

      if (!isLinkedToUser) {
        body.costumerName = newAppointment.costumerName
        body.costumerPhone = newAppointment.costumerPhone
      }

      const res = await fetch(`/api/booking/${editingData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const updated = await res.json()
      if (!res.ok) {
        alert(updated.error)
        return
      }

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === updated.id ? updated : apt)),
      )

      updateEventInCalendar(updated)
      setSuccessDialogData({
        title: "Agendamento Atualizado!",
        content: "O agendamento foi editado com sucesso.",
      })
      setIsSuccessModalOpen(true)
      setIsNewAppointmentOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar agendamento!")
    }
  }

  function askToDeleteAppointment() {
    if (!selectedEvent) return
    setAppointmentToDelete(selectedEvent.id)
    setIsConfirmDeleteOpen(true)
  }

  async function handleDeleteAppointment() {
    if (!appointmentToDelete) return

    try {
      const res = await fetch(`/api/booking/${appointmentToDelete}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorData = await res.json()
        alert(errorData.error || "Erro ao excluir o agendamento")
        return
      }

      setAppointments((prev) =>
        prev.filter((a) => a.id !== appointmentToDelete),
      )

      setTimeout(() => {
        const calendarApi = calendarRef.current?.getApi()
        const event = calendarApi?.getEventById(appointmentToDelete)
        if (event) event.remove()

        setIsDialogOpen(false)
        setEditingData(null)
        setIsEditing(false)
        setIsConfirmDeleteOpen(false)
      }, 300)
    } catch (error) {
      console.error(error)
      alert("Erro ao excluir o agendamento")
    }
  }

  function addEventToCalendar(appointment: Appointment) {
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.addEvent({
      id: appointment.id,
      title: `${appointment.costumerName} - ${appointment.services}`,
      start: new Date(appointment.date),
      backgroundColor: "#D4A574",
      borderColor: "#D4A574",
      extendedProps: { ...appointment },
    })
  }

  function updateEventInCalendar(appointment: Appointment) {
    const calendarApi = calendarRef.current?.getApi()
    const event = calendarApi?.getEventById(appointment.id)
    if (event) {
      event.setProp(
        "title",
        `${appointment.costumerName} - ${appointment.services}`,
      )
      event.setStart(new Date(appointment.date))
      event.setExtendedProp("costumerName", appointment.costumerName)
      event.setExtendedProp("costumerPhone", appointment.costumerPhone)
      event.setExtendedProp("service", appointment.services)
      event.setExtendedProp("professional", appointment.professionals)
      event.setExtendedProp("price", appointment.price)
    }
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event
    const booking = event.extendedProps as Appointment

    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      costumerName: booking.costumerName,
      costumerPhone: booking.costumerPhone,
      price: Number(booking.price),
      services: booking.services.map((s) => ({
        id: s.id,
        name: s.name,
        duration: s.duration,
        price: Number(s.price),
        professionalId: s.professionalId,
        professionalName: s.professionalName,
      })),
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

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/booking")
        if (!res.ok) throw new Error("Erro ao buscar agendamentos")
        const data = await res.json()
        const normalized: Appointment[] = data.map((d: Appointment) => ({
          ...d,
          date: d.date ? new Date(d.date) : null,
          services: d.services ?? [],
        }))
        setAppointments(normalized)
      } catch (err) {
        console.error(err)
      }
    }

    fetchAppointments()
  }, [])

  useEffect(() => {
    const eventsMapped = appointments.map((apt) => {
      const date = new Date(apt.date)

      return {
        id: String(apt.id),
        title: `${apt.costumerName} - ${apt.services.map((s) => s.name).join(", ")}`,
        start: date,
        backgroundColor: "#D4A574",
        borderColor: "#D4A574",
        extendedProps: { ...apt },
      }
    })

    setCalendarEvents(eventsMapped)
  }, [appointments])

  useEffect(() => {
    setCalendarEvents(
      appointments.map((apt) => ({
        id: String(apt.id),
        title: `${apt.costumerName} - ${apt.services.map((s) => s.name).join(", ")}`,
        start: apt.date,
        backgroundColor: "#D4A574",
        borderColor: "#D4A574",
        extendedProps: { ...apt },
      })),
    )
  }, [appointments])

  useEffect(() => {
    fetchServices()
    fetchProfessionals()
  }, [])

  useEffect(() => {
    if (isEditing && editingData) {
      const dateObj = editingData.date ? new Date(editingData.date) : null

      setNewAppointment({
        costumerName: editingData.costumerName,
        costumerPhone: editingData.costumerPhone,
        services: editingData.services?.map((s) => s.id) ?? [],
        serviceProfessionals: editingData.professionals ?? {},
        date: dateObj ? dateObj.toISOString().split("T")[0] : "",
        time: dateObj
          ? dateObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        userId: editingData.userId ?? null,
      })
    }
  }, [editingData, isEditing])

  const month = currentMonth.getMonth()
  const year = currentMonth.getFullYear()

  const monthlyAppointments = appointments.filter((a) => {
    const date = new Date(a.date)
    return date.getMonth() === month && date.getFullYear() === year
  })

  const monthlyRevenue = monthlyAppointments.reduce((sum, appointment) => {
    const serviceTotal = appointment.services.reduce(
      (s, svc) => s + parseFloat(String(svc.price)),
      0,
    )
    return sum + serviceTotal
  }, 0)

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
                      <p className="text-xs text-white/60 sm:text-sm">
                        Total de Agendamentos
                      </p>
                      <p className="mt-1 text-xl text-white sm:text-2xl">
                        {monthlyAppointments.length}
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
                        Receita
                      </p>
                      <p className="mt-1 text-xl text-white sm:text-2xl">
                        R$ {monthlyRevenue.toFixed(2).replace(".", ",")}
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
                    setCurrentMonth(dateInfo.view.currentStart)
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Detalhes do Agendamento */}
      <BookingDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedEvent={selectedEvent}
        setEditingData={(event) => {
          if (!event) return

          setEditingData(event)

          const services = event.services ?? []

          setNewAppointment({
            costumerName: event.costumerName,
            costumerPhone: event.costumerPhone,
            services: services.map((s) => s.id),
            serviceProfessionals: services.reduce(
              (acc, s) => {
                acc[s.id] = s.professionalId
                return acc
              },
              {} as Record<number, number>,
            ),
            date: event.date,
            time: "",
            userId: event.userId ?? null,
          })

          setIsEditing(true)
          setIsNewAppointmentOpen(true)
        }}
        setIsEditing={setIsEditing}
        handleDeleteAppointment={askToDeleteAppointment}
      />

      {/* Dialog Novo Agendamento */}
      <NewBookingDialog
        open={isNewAppointmentOpen}
        onOpenChange={(open) => {
          setIsNewAppointmentOpen(open)
          if (!open) resetForm()
        }}
        isEditing={isEditing}
        defaultData={editingData ?? undefined}
        services={services}
        professionals={professionals}
        newAppointment={newAppointment}
        setNewAppointment={setNewAppointment}
        handleToggleService={handleToggleService}
        handleRemoveService={handleRemoveService}
        handleServiceProfessionalChange={handleServiceProfessionalChange}
        getTotalDuration={getTotalDuration}
        getTotalPrice={getTotalPrice}
        isFormValid={isFormValid}
        handleSaveAppointment={handleSaveAppointment}
        handleEditAppointment={handleEditAppointment}
      />

      {/* Dialog Agendamento Concluido */}
      <SuccessBookingDialog
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        title={successDialogData.title}
        content={successDialogData.content}
      />

      <ConfirmDeleteDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        onConfirm={handleDeleteAppointment}
      />
    </section>
  )
}

export default Schedule
