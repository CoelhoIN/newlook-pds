"use client"

import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Calendar } from "../ui/calendar"
import { Button } from "../ui/button"
import { Locale } from "date-fns"

type Step3Props = {
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void

  selectedTime: string
  setSelectedTime: (time: string) => void

  timeSlots: string[]
  unavailableTimes: string[]

  ptBR: Locale
}

const Step3DateTime = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  timeSlots,
  unavailableTimes,
  ptBR,
}: Step3Props) => {
  return (
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
              disabled={(date) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                return date < today
              }}
              locale={ptBR}
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]"
            />
          </div>
          <div>
            <Label className="mb-4 block text-white">
              Horários disponíveis
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
  )
}

export default Step3DateTime
