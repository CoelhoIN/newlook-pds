"use client"

import { Flower2, Heart, Scissors, Sparkles } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"
import { useEffect, useState } from "react"

type Service = {
  id: number
  name: string
  category: string
  price: number
}

const categories = [
  {
    id: "cabelo",
    title: "Procedimentos Capilares",
    icon: Scissors,
    description:
      "Transformações completas com cortes modernos, coloração profissional, tratamentos reconstructivos e finalizações impecáveis.",
  },
  {
    id: "manicure/pedicure",
    title: "Unhas",
    icon: Sparkles,
    description:
      "Cuidados completos para suas mãos e pés com técnicas profissionais e produtos de alta qualidade.",
  },
  {
    id: "massagem",
    title: "Massagem",
    icon: Heart,
    description:
      "Momentos de relaxamento e bem-estar com massagens terapêuticas que renovam corpo e mente.",
  },
  {
    id: "depilação corporal",
    title: "Depilação Corporal",
    icon: Flower2,
    description:
      "Depilação profissional com cera quente e técnicas que garantem resultados duradouros e pele macia.",
  },
]

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    async function loadServices() {
      const res = await fetch("/api/services", { cache: "no-store" })
      const data = await res.json()
      setServices(data)
    }
    loadServices()
  }, [])

  return (
    <section
      id="servicos"
      className="bg-gradient-to-b from-black to-[#111111] py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block">
            <h2 className="text-4xl tracking-wide text-[#8d6e3d] md:text-5xl">
              Serviços
            </h2>
            <div className="mt-4 h-1 bg-[#8d6e3d]" />
          </div>
          <p className="mx-auto max-w-2xl text-lg text-[#ededed]/80">
            Descubra nossos serviços especializados em beleza e bem-estar
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {categories.map((cat) => {
            const IconComponent = cat.icon
            const filtered = services.filter(
              (s) => s.category.toLowerCase() === cat.id.toLowerCase(),
            )

            return (
              <AccordionItem
                key={cat.id}
                value={cat.id}
                className="overflow-hidden rounded-lg border border-[#2e2e2e] bg-black/50 backdrop-blur-sm transition-all duration-300 hover:border-[#8d6e3d]/30"
              >
                <AccordionTrigger className="group px-6 py-6 hover:no-underline">
                  <div className="flex items-center space-x-4 text-left">
                    <div className="rounded-full bg-[#8d6e3d]/10 p-3 transition-colors duration-300 group-hover:bg-[#8d6e3d]/20">
                      <IconComponent className="h-6 w-6 text-[#8d6e3d]" />
                    </div>
                    <div>
                      <h3 className="text-xl text-[#ededed] transition-colors duration-300 group-hover:text-[#8d6e3d]">
                        {cat.title}
                      </h3>
                      <p className="mt-1 hidden text-sm text-[#ededed]/60 md:block">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="mt-4 rounded-lg bg-[#8d6e3d]/5 p-6">
                    <p className="mb-4 text-[#ededed]/80 md:hidden">
                      {cat.description}
                    </p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {filtered.length > 0 ? (
                        filtered.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center space-x-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-[#8d6e3d]" />
                            <span className="text-[#ededed]/90">
                              {service.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[#ededed]/50">
                          Nenhum serviço cadastrado.
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}

export default ServicesSection
