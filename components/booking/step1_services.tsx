"use client"

import { LucideIcon, Scissors } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import ServiceCard from "./service_card"

type Service = {
  id: number
  name: string
  category: string
  price: number
}

type Step1ServicesProps = {
  services: Service[]
  selectedServices: string[]
  handleServiceToggle: (id: string) => void
  serviceIcons: Record<string, LucideIcon>
}

const Step1Services = ({
  services,
  selectedServices,
  handleServiceToggle,
  serviceIcons,
}: Step1ServicesProps) => {
  const categories = [
    "Cabelo",
    "Manicure/Pedicure",
    "Massagem",
    "Depilação Corporal",
  ]
  return (
    <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Scissors className="h-5 w-5 text-[#D4A574]" />
          <span>Escolha seus serviços</span>
        </CardTitle>
        <p className="mt-2 text-white/60">
          Selecione os serviços que deseja agendar
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-4 text-[#D4A574]">{category}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {services
                .filter((service) => service.category === category)
                .map((service) => {
                  const IconComponent =
                    serviceIcons[service.category] || Scissors
                  const isSelected = selectedServices.includes(
                    service.id.toString(),
                  )

                  return (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      icon={IconComponent}
                      isSelected={isSelected}
                      onSelect={() =>
                        handleServiceToggle(service.id.toString())
                      }
                    />
                  )
                })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default Step1Services
