"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Scissors, X } from "lucide-react"
import { Checkbox } from "../ui/checkbox"

export type BookingServiceItem = {
  id: number
  serviceId: number
  name: string
  price: number
  duration: number
  professionalId: number
  professionalName: string | null
}

export type BookingItem = {
  id: number
  date: string
  time: string
  services: BookingServiceItem[]
  costumerName: string
  costumerPhone: string
}

export type Service = {
  id: number
  name: string
  price: number
  duration: number
  category: string
}

export type Professional = {
  id: number
  name: string
  services?: Service[]
}

export type DefaultData = {
  id: number
  date: string
  time: string
  client?: { name?: string; phone?: string }
  services?: BookingServiceItem[]
}

export interface EditAppointment {
  id: number
  costumerName: string
  costumerPhone: string
  services: number[]
  serviceProfessionals: Record<number, number>
  date: string
  time: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: Service[]
  professionals: Professional[]
  editingData: EditAppointment
  setEditingData: React.Dispatch<React.SetStateAction<EditAppointment>>
  handleEditAppointment: () => Promise<void>
  defaultData?: DefaultData
}

const EditBookingDialog = ({
  open,
  onOpenChange,
  services,
  professionals,
  editingData,
  setEditingData,
  handleEditAppointment,
  defaultData,
}: Props) => {
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([])

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

  const generateTimes = () => {
    const times = []
    for (let hour = 9; hour < 18; hour++) {
      times.push(`${String(hour).padStart(2, "0")}:00`)
      times.push(`${String(hour).padStart(2, "0")}:30`)
    }
    return times
  }

  const timeSlots = generateTimes()

  const availableTimes = timeSlots.filter((t) => {
    if (!unavailableTimes.includes(t)) return true

    if (defaultData && t === subtractHours(defaultData.time, 3)) {
      return true
    }

    return false
  })

  useEffect(() => {
    if (!defaultData) return

    let isoDate = ""
    if (defaultData.date) {
      const parsed = new Date(
        defaultData.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"),
      )
      if (!isNaN(parsed.getTime())) {
        isoDate = parsed.toISOString().split("T")[0]
      }
    }

    const datePart = isoDate

    const timeToUse = subtractHours(defaultData.time, 3)

    const servicesArray = defaultData.services ?? []
    const serviceIds = servicesArray.map((s) => s.serviceId)

    const serviceProfessionals: Record<number, number> = {}
    servicesArray.forEach((s) => {
      const profId = s.professionalId ?? 0
      if (profId) serviceProfessionals[s.serviceId] = profId
    })

    setEditingData({
      id: defaultData.id,
      costumerName: defaultData.client?.name ?? "",
      costumerPhone: defaultData.client?.phone ?? "",
      services: serviceIds,
      serviceProfessionals,
      date: datePart,
      time: timeToUse,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultData])

  useEffect(() => {
    if (!editingData.date) return setUnavailableTimes([])
    const fetchUnavailableTimes = async () => {
      try {
        const res = await fetch(`/api/booking?date=${editingData.date}`)
        const data = await res.json()
        setUnavailableTimes(data.map((t: string) => subtractHours(t, 3)))
      } catch (err) {
        console.error(err)
        setUnavailableTimes([])
      }
    }
    fetchUnavailableTimes()
  }, [editingData.date])

  function handleRemoveService(id: number) {
    setEditingData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== id),
      serviceProfessionals: (() => {
        const copy = { ...prev.serviceProfessionals }
        delete copy[id]
        return copy
      })(),
    }))
  }

  function handleServiceProfessionalChange(serviceId: number, empId: string) {
    setEditingData((prev) => ({
      ...prev,
      serviceProfessionals: {
        ...prev.serviceProfessionals,
        [serviceId]: Number(empId),
      },
    }))
  }

  function handleToggleService(id: number) {
    setEditingData((prev) => {
      const already = prev.services.includes(id)
      return {
        ...prev,
        services: already
          ? prev.services.filter((s) => s !== id)
          : [...prev.services, id],
        serviceProfessionals: already
          ? (() => {
              const copy = { ...prev.serviceProfessionals }
              delete copy[id]
              return copy
            })()
          : { ...prev.serviceProfessionals, [id]: 0 },
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-[#2A2A2A] bg-[#1A1A1A] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#D4A574]">
            Editar Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Serviços */}
          <div className="rounded-lg bg-black/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm text-white/60">Serviços</h3>
              {editingData.services.length > 0 && (
                <div className="text-xs text-white/60">
                  {editingData.services.length}{" "}
                  {editingData.services.length === 1
                    ? "selecionado"
                    : "selecionados"}
                </div>
              )}
            </div>

            {editingData.services.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 rounded-lg bg-black/30 p-3">
                {editingData.services.map((serviceId) => {
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
                            checked={editingData.services.includes(service.id)}
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
          </div>

          {/* Profissionais */}
          {editingData.services.length > 0 && (
            <div className="mt-4 rounded-lg bg-black/30 p-4">
              <h3 className="mb-3 text-sm text-white/60">
                Atribuir Profissionais aos Serviços
              </h3>
              <p className="mb-4 text-xs text-white/50">
                Selecione um profissional para cada serviço escolhido
              </p>
              <div className="space-y-3">
                {editingData.services.map((serviceId) => {
                  const service = services.find((s) => s.id === serviceId)
                  if (!service) return null
                  const availableProfessionals = professionals.filter((pro) =>
                    pro.services?.some((s) => s.id === serviceId),
                  )
                  return (
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
                            editingData.serviceProfessionals[serviceId] || "",
                          )}
                          onValueChange={(value) =>
                            handleServiceProfessionalChange(serviceId, value)
                          }
                        >
                          <SelectTrigger className="border-[#2A2A2A] bg-black/50 text-white">
                            <SelectValue placeholder="Selecionar profissional" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/80 text-white">
                            {availableProfessionals.length > 0 ? (
                              availableProfessionals.map((pro) => (
                                <SelectItem
                                  key={pro.id}
                                  value={String(pro.id)}
                                  className="text-white hover:bg-white/10"
                                >
                                  {pro.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-white/50">
                                Nenhum profissional disponível
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Data e hora */}
          <div className="rounded-lg bg-black/30 p-4">
            <h3 className="mb-3 text-sm text-white/60">Data e Horário</h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                type="date"
                value={editingData.date}
                onChange={(e) =>
                  setEditingData((p) => ({ ...p, date: e.target.value }))
                }
                className="border-[#2A2A2A] bg-black/50 text-white"
              />

              <Select
                value={editingData.time}
                onValueChange={(value) =>
                  setEditingData({ ...editingData, time: value })
                }
              >
                <SelectTrigger className="border-[#2A2A2A] bg-black/50 text-white">
                  <SelectValue placeholder="Selecionar horário" />
                </SelectTrigger>

                <SelectContent className="bg-black/80 text-white">
                  {availableTimes.length === 0 && (
                    <div className="p-2 text-sm text-white/60">
                      Nenhum horário disponível
                    </div>
                  )}

                  {availableTimes.map((time) => (
                    <SelectItem
                      key={time}
                      value={time}
                      className="text-white hover:bg-white/10"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 border-t border-[#2A2A2A] pt-4">
            <Button
              variant="outline"
              className="flex-1 border-[#2A2A2A] text-white hover:bg-[#D4A574]/10"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button
              className="flex-1 bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
              onClick={handleEditAppointment}
              disabled={
                editingData.services.length === 0 ||
                !editingData.date ||
                !editingData.time ||
                editingData.services.some(
                  (serviceId) => !editingData.serviceProfessionals[serviceId],
                )
              }
            >
              <Scissors className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditBookingDialog
