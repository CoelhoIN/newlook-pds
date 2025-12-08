import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

type Service = {
  id: number
  name: string
  category: string
  price: number
}

type ClientData = {
  name?: string
  email?: string
  phone?: string
  password?: string
}

type PostBody = {
  services: Service[]
  professionals: Record<number, number>
  date: string
  time: string
  client: ClientData
  accountType: "admin" | "existing" | "new"
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")

    if (date) {
      const bookings = await prisma.booking.findMany({
        where: {
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lt: new Date(`${date}T23:59:59.000Z`),
          },
        },
        select: { date: true },
      })

      const times = bookings.map((b) => b.date.toISOString().substring(11, 16))

      return NextResponse.json(times)
    }

    const bookings = await prisma.booking.findMany({
      orderBy: { date: "asc" },
      include: {
        user: true,
        employee: true,
        bookingServices: { include: { service: true, employee: true } },
      },
    })
    const formatted = bookings.map((b) => {
      const services = b.bookingServices.map((bs) => ({
        id: bs.serviceId,
        name: bs.service.name,
        price: Number(bs.price),
        userId: b.userId,
        professionalId: bs.employee?.id,
        professionalName: bs.employee?.name ?? "—",
      }))
      const professionals = Array.from(
        new Set(
          b.bookingServices.map((bs) => bs.employee?.name).filter(Boolean),
        ),
      )
      const totalPrice = services.reduce((s, it) => s + it.price, 0)
      return {
        id: b.id,
        date: b.date,
        costumerName: b.user?.name ?? b.costumerName ?? "",
        costumerPhone: b.user?.phone ?? b.costumerPhone ?? "",
        service: services
          .map((s) => s.name || "")
          .filter(Boolean)
          .join(", "),
        professional: professionals.filter(Boolean).join(", "),
        services,
        price: totalPrice,
      }
    })
    return NextResponse.json(formatted, { status: 200 })
  } catch (err) {
    console.error("GET /api/booking error:", err)
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos." },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const {
      services,
      professionals,
      date,
      time,
      client,
      accountType,
    }: PostBody = await req.json()

    const isAdminCreating = accountType === "admin"

    let userId: number | null = null
    let user: {
      id: number
      name: string
      email: string
      phone: string
    } | null = null

    if (!isAdminCreating) {
      if (!client.email) {
        return NextResponse.json(
          { error: "Email é obrigatório para clientes comuns." },
          { status: 400 },
        )
      }

      user = await prisma.user.findUnique({
        where: { email: client.email },
      })

      if (!user) {
        if (accountType === "existing") {
          return NextResponse.json(
            { error: "Usuário não encontrado." },
            { status: 400 },
          )
        }

        const hashedPassword = await hash(client.password!, 10)

        user = await prisma.user.create({
          data: {
            name: client.name || "",
            email: client.email,
            phone: client.phone || "",
            password: hashedPassword,
          },
        })
      }

      userId = user.id
    }

    if (!date || !time) {
      return NextResponse.json(
        { error: "Data e hora são obrigatórias." },
        { status: 400 },
      )
    }

    const parsedDate = new Date(`${date}T${time}:00`)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Data ou hora inválida." },
        { status: 400 },
      )
    }

    const firstEmployeeId = Object.values(professionals)[0]
    const existingBooking = await prisma.booking.findFirst({
      where: { employeeId: Number(firstEmployeeId), date: parsedDate },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: "Este horário já está reservado." },
        { status: 400 },
      )
    }
    const costumerName = isAdminCreating ? client.name : (user?.name ?? null)
    const costumerPhone = isAdminCreating ? client.phone : (user?.phone ?? null)

    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        employeeId: Number(firstEmployeeId),
        date: parsedDate,
        costumerName: costumerName,
        costumerPhone: costumerPhone,
      },
    })

    await Promise.all(
      services.map((service: Service) =>
        prisma.bookingService.create({
          data: {
            bookingId: booking.id,
            serviceId: Number(service.id),
            employeeId: Number(professionals[service.id]),
            price: Number(service.price) || 0,
          },
        }),
      ),
    )
    const complete = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        user: true,
        bookingServices: {
          include: { service: true, employee: true },
        },
      },
    })
    const servicesFormatted = complete!.bookingServices.map((bs) => ({
      id: bs.serviceId,
      name: bs.service?.name ?? "",
      price: Number(bs.price),
      professional: bs.employee?.name ?? null,
    }))

    const professionalsFormatted = Array.from(
      new Set(
        complete!.bookingServices
          .map((bs) => bs.employee?.name)
          .filter(Boolean),
      ),
    )

    const totalPrice = servicesFormatted.reduce(
      (sum, item) => sum + (item.price || 0),
      0,
    )

    const responseData = {
      id: complete!.id,
      date: complete!.date,
      costumerName: complete!.user?.name ?? complete!.costumerName ?? "",
      costumerPhone: complete!.user?.phone ?? complete!.costumerPhone ?? "",
      professional: professionalsFormatted.join(", "),
      service: servicesFormatted
        .map((s) => s.name)
        .filter(Boolean)
        .join(", "),
      services: servicesFormatted,
      price: totalPrice,
    }

    return NextResponse.json(responseData, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 },
    )
  }
}
