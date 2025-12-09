import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"

const currentYear = new Date().getFullYear()

const quickLinks = [
  { name: "Sobre Nós", href: "/#sobre" },
  { name: "Serviços", href: "/#servicos" },
  { name: "Contato", href: "/#contato" },
]

const contactInfo = [
  {
    icon: Phone,
    text: "+55 51 99501-1950",
  },
  {
    icon: Mail,
    text: "newlook.2004@outlook.com",
  },
  {
    icon: MapPin,
    text: "Rua Borges de Medeiros, 209 - Centro\nTorres - RS",
  },
]

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/salao__new_look?igsh=MWRoM3E3NzFxajVibQ==",
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/share/16jCPpSC7r/?mibextid=wwXIfr",
    label: "Facebook",
  },
]
const Footer = () => {
  return (
    <footer className="border-t border-[#2e2e2e] bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Image alt="logo" src="/logo.svg" height={18} width={140} />
              </div>
              <p className="leading-relaxed text-[#ededed]/70">
                Realçando a beleza dentro de você desde 1996. Tradição,
                qualidade e inovação em cada atendimento.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="rounded-full border border-[#2e2e2e] bg-[#1a1a1a] p-3 transition-all duration-300 hover:border-[#8d6e3d]/30 hover:bg-[#8d6e3d]/10"
                  >
                    <IconComponent className="h-5 w-5 text-[#ededed] transition-colors duration-300 hover:text-[#8d6e3d]" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl tracking-wide text-[#8d6e3d]">
              INFORMAÇÕES
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="block py-1 text-[#ededed]/80 transition-colors duration-300 hover:text-[#8d6e3d]"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="text-xl tracking-wide text-[#8d6e3d]">CONTATO</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon
                return (
                  <div key={index} className="group">
                    <div className="flex items-start space-x-3 text-[#ededed]/80">
                      <IconComponent className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#8d6e3d]" />
                      <span className="whitespace-pre-line">{info.text}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#2e2e2e] pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-[#ededed]/60">
              © {currentYear} New Look. Alguns direitos reservados.
            </p>

            <div className="flex items-center space-x-6 text-sm text-[#ededed]/60">
              <a
                href="#"
                className="transition-colors duration-300 hover:text-[#8d6e3d]"
              >
                Política de Privacidade
              </a>
              <a
                href="#"
                className="transition-colors duration-300 hover:text-[#8d6e3d]"
              >
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
