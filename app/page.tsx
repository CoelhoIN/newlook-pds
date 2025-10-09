import AboutSection from "@/components/about_section"
import ContactSection from "@/components/contact_section"
import IntroductionSection from "@/components/introduction_section"
import ServicesSection from "@/components/services_section"

export default function Home() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black pt-20">
      <IntroductionSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </section>
  )
}
