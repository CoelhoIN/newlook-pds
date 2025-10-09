import { Flower2, Heart, Scissors, Sparkles } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"

const services = [
  {
    id: "procedimentos",
    title: "Procedimentos Capilares",
    icon: Scissors,
    description:
      "Transformações completas com cortes modernos, coloração profissional, tratamentos reconstructivos e finalizações impecáveis.",
    details: [
      "Cortes femininos e masculinos",
      "Coloração e mechas",
      "Tratamentos capilares",
      "Escova e finalização",
    ],
  },
  {
    id: "manicure",
    title: "Manicure/Pedicure",
    icon: Sparkles,
    description:
      "Cuidados completos para suas mãos e pés com técnicas profissionais e produtos de alta qualidade.",
    details: [
      "Manicure tradicional e francesa",
      "Pedicure relaxante",
      "Esmaltação em gel",
      "Cuidados com cutículas",
    ],
  },
  {
    id: "massagem",
    title: "Massagem",
    icon: Heart,
    description:
      "Momentos de relaxamento e bem-estar com massagens terapêuticas que renovam corpo e mente.",
    details: [
      "Massagem relaxante",
      "Massagem terapêutica",
      "Drenagem linfática",
      "Massagem localizada",
    ],
  },
  {
    id: "depilacao",
    title: "Depilação Corporal",
    icon: Flower2,
    description:
      "Depilação profissional com cera quente e técnicas que garantem resultados duradouros e pele macia.",
    details: [
      "Depilação com cera quente",
      "Depilação facial",
      "Sobrancelha design",
      "Cuidados pós-depilação",
    ],
  },
]

const ServicesSection = () => {
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
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <div key={service.id}>
                <AccordionItem
                  value={service.id}
                  className="overflow-hidden rounded-lg border border-[#2e2e2e] bg-black/50 backdrop-blur-sm transition-all duration-300 hover:border-[#8d6e3d]/30"
                >
                  <AccordionTrigger className="group px-6 py-6 hover:no-underline">
                    <div className="flex items-center space-x-4 text-left">
                      <div className="rounded-full bg-[#8d6e3d]/10 p-3 transition-colors duration-300 group-hover:bg-[#8d6e3d]/20">
                        <IconComponent className="h-6 w-6 text-[#8d6e3d]" />
                      </div>
                      <div>
                        <h3 className="text-xl text-[#ededed] transition-colors duration-300 group-hover:text-[#8d6e3d]">
                          {service.title}
                        </h3>
                        <p className="mt-1 hidden text-sm text-[#ededed]/60 md:block">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="mt-4 rounded-lg bg-[#8d6e3d]/5 p-6">
                      <p className="mb-4 text-[#ededed]/80 md:hidden">
                        {service.description}
                      </p>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {service.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <div className="h-2 w-2 rounded-full bg-[#8d6e3d]" />
                            <span className="text-[#ededed]/90">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </div>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}

export default ServicesSection
