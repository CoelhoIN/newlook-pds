import Image from "next/image"

const AboutSection = () => {
  return (
    <section
      id="sobre"
      className="bg-gradient-to-b from-[#111111] to-black py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-4xl text-[#8d6e3d] md:text-5xl">
                Sobre Nós
              </h2>
              <div className="h-1 w-32 bg-[#8d6e3d]" />
            </div>

            <div className="space-y-6 leading-relaxed text-[#ededed]/90">
              <p className="text-lg">
                O nosso empreendimento nasceu em{" "}
                <span className="text-[#8d6e3d]">1996</span>, na cidade de
                Parobé/RS, e em 25 de maio de{" "}
                <span className="text-[#8d6e3d]">2004</span> o salão foi
                transferido para Torres/RS. Durante as temporadas de verão, a
                equipe passou a contar com profissionais comissionados, como
                manicures, massagistas e cabeleireiros, acompanhando a expansão
                da cidade e a alta demanda pelos serviços.
              </p>

              <p className="text-lg">
                Hoje, o salão se consolidou como um{" "}
                <span className="text-[#8d6e3d]">espaço de referência</span> em
                cuidados de beleza e bem-estar, unindo tradição, qualidade e
                inovação. Com uma equipe preparada e apaixonada pelo que faz,
                oferecemos um atendimento acolhedor e personalizado, sempre
                buscando realçar a beleza dentro de cada cliente.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="mb-2 text-3xl text-[#8d6e3d]">28+</div>
                <p className="text-sm text-[#ededed]/70">Anos de experiência</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl text-[#8d6e3d]">1000+</div>
                <p className="text-sm text-[#ededed]/70">
                  Clientes satisfeitos
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl text-[#8d6e3d]">20+</div>
                <p className="text-sm text-[#ededed]/70">Especialidades</p>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/newlook-atual.jpg"
                alt="Salão New Look - Interior elegante"
                height={18}
                width={700}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
