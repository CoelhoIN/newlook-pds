"use client"

import { LucideIcon, Scissors, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import React from "react"
import ProfessinalCard from "./professional_card"

type Professional = {
  id: number
  name: string
  experience: string
  description: string
  status: string
  services?: Service[]
  specialties: number[]
}

type Service = {
  id: number | string
  name: string
  price: number
  category: string
}

type Step2ProfessionalsProps = {
  professionals: Professional[]
  selectedProfessionals: Record<string, string>
  selectedServiceDetails: Service[]
  handleProfessionalSelect: (serviceId: string, professionalId: string) => void
  serviceIcons: Record<string, LucideIcon>
}

const Step2Professionals = ({
  professionals,
  selectedProfessionals,
  selectedServiceDetails,
  handleProfessionalSelect,
  serviceIcons,
}: Step2ProfessionalsProps) => {
  return (
    <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Users className="h-5 w-5 text-[#D4A574]" />
          <span>Escolha os profissionais</span>
        </CardTitle>
        <p className="mt-2 text-white/60">
          Selecione um profissional para cada serviço
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {selectedServiceDetails.map((service) => {
          const availableProfessionals = professionals.filter((prof) =>
            prof.specialties.includes(Number(service.id)),
          )
          const selectedProfessional = selectedProfessionals[service.id]

          return (
            <div key={service.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-[#D4A574]/10 p-2">
                    {serviceIcons[service.category] ? (
                      React.createElement(serviceIcons[service.category], {
                        className: "h-5 w-5 text-[#D4A574]",
                      })
                    ) : (
                      <Scissors className="h-5 w-5 text-[#D4A574]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg text-white">{service.name}</h3>
                    <p className="text-sm text-white/60">
                      {Number(service.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {availableProfessionals.map((professional) => {
                  return (
                    <ProfessinalCard
                      key={professional.id}
                      professional={professional}
                      isSelected={
                        selectedProfessional === professional.id.toString()
                      }
                      onSelect={() =>
                        handleProfessionalSelect(
                          service.id.toString(),
                          professional.id.toString(),
                        )
                      }
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default Step2Professionals
