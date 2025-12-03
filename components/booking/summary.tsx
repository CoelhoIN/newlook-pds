"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

type Professional = {
  id: number | string
  name: string
  specialties: (string | number)[]
  image?: string
}

type Service = {
  id: number | string
  name: string
  price: number
  category: string
}

type StepSummaryProps = {
  selectedServiceDetails: Service[]
  professionals: Professional[]
  selectedProfessionals: Record<string, string>
  selectedDate: Date | undefined
  selectedTime: string | null
  totalPrice: number
}

const Summary = ({
  selectedServiceDetails,
  professionals,
  selectedProfessionals,
  selectedDate,
  selectedTime,
  totalPrice,
}: StepSummaryProps) => {
  return (
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
                  (p) => p.id.toString() === selectedProfessionals[service.id],
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
  )
}

export default Summary
