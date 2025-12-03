import AboutSection from "@/components/home/about_section"
import ContactSection from "@/components/home/contact_section"
import IntroductionSection from "@/components/home/introduction_section"
import ServicesSection from "@/components/home/services_section"

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
