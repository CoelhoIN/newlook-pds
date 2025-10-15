"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const IntroductionSection = () => {
  const router = useRouter()

  const handleBookingClick = () => {
    router.push("/bookings")
  }
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid min-h-[70vh] grid-cols-1 items-center gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <p className="mb-4 uppercase tracking-[0.2em] text-[#D4A574]">
            Salão New Look
          </p>
          <h1 className="mb-6 text-4xl leading-tight text-[#D4A574] md:text-5xl lg:text-6xl">
            Realce a beleza <span className="text-white">dentro de você</span>
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-white/80">
            Agende seu horário e viva essa experiência única de cuidado e
            transformação.
          </p>

          <Button
            size="lg"
            className="bg-[#D4A574] px-8 py-4 text-lg tracking-wide text-black transition-all duration-300 hover:scale-105 hover:bg-[#D4A574]/90 hover:shadow-lg hover:shadow-[#D4A574]/25"
            onClick={handleBookingClick}
          >
            AGENDAR HORÁRIO
          </Button>
        </div>
        <div className="relative lg:col-span-1">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              alt="imagem inicio"
              src="/imagem-inicio.jpg"
              height={18}
              width={400}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroductionSection
