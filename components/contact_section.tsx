import { Clock, Mail, MapPin, Phone } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "Telefone",
    value: "+55 51 99501-1950",
    href: "tel:+5551995011950",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "newlook.2004@outlook.com",
    href: "mailto:newlook.2004@outlook.com",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: "Rua Borges de Medeiros, 209 - Centro\nTorres - RS",
    href: "https://maps.google.com",
  },
  {
    icon: Clock,
    label: "Horário",
    value: "Segunda à Sexta: 9h às 18h\nSábado: 9h às 17h",
    href: null,
  },
]

const ContactSection = () => {
  return (
    <section
      id="contato"
      className="bg-gradient-to-b from-black to-[#0a0a0a] py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl text-[#8d6e3d] md:text-5xl">
            Entre em Contato
          </h2>
          <div className="mx-auto h-1 w-32 bg-[#8d6e3d]" />
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#ededed]/80">
            Estamos aqui para cuidar de você. Entre em contato e agende seu
            horário.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {contactInfo.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div
                key={index}
                className="flex items-start space-x-4 rounded-xl border border-[#2e2e2e] bg-black/50 p-6 backdrop-blur-sm"
              >
                <div className="rounded-full bg-[#8d6e3d]/10 p-3">
                  <IconComponent className="h-6 w-6 text-[#8d6e3d]" />
                </div>
                <div>
                  <h3 className="mb-1 text-[#ededed]">{item.label}</h3>
                  <p className="whitespace-pre-line text-[#ededed]/70">
                    {item.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ContactSection
