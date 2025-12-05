import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { User, Phone, Scissors, Clock } from "lucide-react"
import type { SelectedEvent, EditingData } from "./schedule"

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedEvent: SelectedEvent | null
  setEditingData: (data: EditingData | null) => void
  setIsEditing: (v: boolean) => void
  handleDeleteAppointment: () => void
}

const BookingDetailsDialog = ({
  open,
  onOpenChange,
  selectedEvent,
  setEditingData,
  setIsEditing,
  handleDeleteAppointment,
}: AppointmentDetailsDialogProps) => {
  function selectedEventToEditingData(
    event: SelectedEvent | null,
  ): EditingData | null {
    if (!event) return null

    const services =
      event.services?.map((s) => ({
        id: s.id,
        professionalId: s.professionalId,
        professionalName: s.professionalName,
      })) ?? []

    const serviceProfessionals: Record<number, number> = {}
    services.forEach((s) => (serviceProfessionals[s.id] = s.professionalId))

    return {
      id: Number(event.id),
      costumerName: event.costumerName ?? "",
      costumerPhone: event.costumerPhone ?? "",
      services,
      professionals: serviceProfessionals,
      date: event.start ? event.start.toISOString() : "",
      userId: event.userId,
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                      {selectedEvent.services &&
                      selectedEvent.services.length > 0
                        ? selectedEvent.services.map((s) => s.name).join(", ")
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
                    {selectedEvent.services && selectedEvent.services.length > 0
                      ? selectedEvent.services
                          .map((s) =>
                            s.professionalName ? s.professionalName : "—",
                          )
                          .join(", ")
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
            onClick={() => {
              onOpenChange(false)
              setEditingData(selectedEventToEditingData(selectedEvent))
              setIsEditing(true)
            }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-red-500 text-white hover:bg-red-600"
            onClick={handleDeleteAppointment}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingDetailsDialog
