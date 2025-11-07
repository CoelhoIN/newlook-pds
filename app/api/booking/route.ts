import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

type Service = {
  id: number
  name: string
  category: string
  price: number
}

export async function POST(req: Request) {
  try {
    const { services, professionals, date, time, client, accountType } =
      await req.json()

    let user = await prisma.user.findUnique({
      where: { email: client.email },
    })

    if (!user) {
      if (accountType === "existing") {
        return NextResponse.json(
          { error: "Usuário não encontrado." },
          { status: 400 },
        )
      }

      user = await prisma.user.create({
        data: {
          name: client.name,
          email: client.email,
          phone: client.phone,
          password: await hash(client.password, 10),
        },
      })
    }

    const parsedDate = new Date(date)
    const [hours, minutes] = time.split(":")
    parsedDate.setHours(Number(hours), Number(minutes), 0, 0)

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

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        employeeId: Number(firstEmployeeId),
        date: parsedDate,
      },
    })

    await Promise.all(
      services.map((service: Service) =>
        prisma.bookingService.create({
          data: {
            bookingId: booking.id,
            serviceId: Number(service.id),

            price: parseFloat(
              service.price.toString().replace("R$ ", "").replace(",", "."),
            ),
          },
        }),
      ),
    )

    return NextResponse.json(
      { success: true, message: "Agendamento realizado com sucesso!" },
      { status: 201 },
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 },
    )
  }
}
