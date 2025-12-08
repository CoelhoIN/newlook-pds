"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Plus, X, Scissors } from "lucide-react"
import { useEffect, useState } from "react"

export type DefaultDataProfessional = {
  id?: number
  name?: string
}

export type DefaultDataService = {
  id: number
  professionalId: number
  professional?: DefaultDataProfessional
}

export type DefaultData = {
  id: number
  date: string
  userId?: number
  client?: {
    name?: string
    phone?: string
  }
  services?: DefaultDataService[]
}

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

interface NewAppointment {
  costumerName: string
  costumerPhone: string
  services: number[]
  serviceProfessionals: Record<number, number>
  date: string
  time: string
  userId: number | null
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: Service[]
  professionals: Professional[]
  newAppointment: NewAppointment
  setNewAppointment: React.Dispatch<React.SetStateAction<NewAppointment>>
  handleToggleService: (id: number) => void
  handleRemoveService: (id: number) => void
  handleServiceProfessionalChange: (serviceId: number, empId: string) => void
  getTotalPrice: () => number
  getTotalDuration: () => number
  isFormValid: () => boolean
  handleSaveAppointment?: () => void
  handleEditAppointment?: () => Promise<void>
  isEditing?: boolean
  defaultData?: DefaultData
}

const NewBookingDialog = ({
  open,
  onOpenChange,
  services,
  professionals,
  newAppointment,
  setNewAppointment,
  handleToggleService,
  handleRemoveService,
  handleServiceProfessionalChange,
  getTotalDuration,
  getTotalPrice,
  isFormValid,
  handleSaveAppointment,
  handleEditAppointment,
  isEditing,
  defaultData,
}: Props) => {
  const isLinkedToUser = Boolean(isEditing && defaultData?.userId)
  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([])
  const [time, setTime] = useState<string | undefined>()

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

    if (defaultData && t === time) {
      return true
    }

    return false
  })

  useEffect(() => {
    async function fetchUnavailableTimes() {
      if (!newAppointment.date) {
        setUnavailableTimes([])
        return
      }

      try {
        const res = await fetch(
          `/api/booking?date=${newAppointment.date.split("T")[0]}`,
        )
        const data = await res.json()

        const formatedTimeData = data.map((t: string) => subtractHours(t, 3))

        setUnavailableTimes(formatedTimeData)
      } catch (error) {
        console.error("Erro ao buscar horários ocupados:", error)
        setUnavailableTimes([])
      }
    }

    fetchUnavailableTimes()
  }, [newAppointment.date])

  useEffect(() => {
    if (
      isEditing &&
      defaultData &&
      services.length > 0 &&
      professionals.length > 0
    ) {
      const isoDate = defaultData.date
        ? new Date(defaultData.date).toISOString()
        : ""
      const [datePart, timePart] = isoDate.includes("T")
        ? isoDate.split("T")
        : [isoDate, ""]

      const timeToUse = subtractHours(timePart.slice(0, 5), 3)

      setTime(timeToUse)

      const servicesArray = defaultData.services ?? []

      const serviceIds = servicesArray.map((s) => s.id)

      const serviceProfessionals: Record<number, number> = {}
      servicesArray.forEach((s) => {
        const profId = s.professionalId ?? s.professional?.id ?? 0

        if (profId) serviceProfessionals[s.id] = profId
      })

      setNewAppointment((prev) => ({
        ...prev,
        costumerName: defaultData.client?.name ?? "",
        costumerPhone: defaultData.client?.phone ?? "",
        services: serviceIds,
        serviceProfessionals,
        date: datePart,
        time: timeToUse,
        userId: defaultData.userId ?? null,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, defaultData, services, professionals])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-[#2A2A2A] bg-[#1A1A1A] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#D4A574]">
            {isEditing ? "Editar Agendamento" : "Novo Agendamento"}
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
                disabled={isLinkedToUser}
                readOnly={isLinkedToUser}
                type="text"
                placeholder="Nome do Cliente"
                value={newAppointment.costumerName}
                onChange={(e) => {
                  if (isLinkedToUser) return
                  setNewAppointment((prev) => ({
                    ...prev,
                    costumerName: e.target.value,
                  }))
                }}
                className="border-[#2A2A2A] bg-black/50 text-white"
              />
              <Input
                disabled={isLinkedToUser}
                readOnly={isLinkedToUser}
                type="text"
                placeholder="Telefone"
                value={newAppointment.costumerPhone}
                onChange={(e) => {
                  if (isLinkedToUser) return
                  setNewAppointment((prev) => ({
                    ...prev,
                    costumerPhone: e.target.value,
                  }))
                }}
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
              <Select
                value={newAppointment.time}
                onValueChange={(value) =>
                  setNewAppointment({ ...newAppointment, time: value })
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

          {/* Botões de Ação */}
          <div className="flex items-center gap-3 border-t border-[#2A2A2A] pt-4">
            <Button
              variant="outline"
              className="flex-1 border-[#2A2A2A] text-white hover:border-[#D4A574]/30 hover:bg-[#D4A574]/10"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
              onClick={
                isEditing ? handleEditAppointment : handleSaveAppointment
              }
              disabled={!isFormValid()}
            >
              {isEditing ? (
                <>
                  <Scissors className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Agendamento
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewBookingDialog
