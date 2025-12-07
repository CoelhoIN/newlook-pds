import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const userId = Number(params.id)

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      include: {
        bookingServices: {
          select: {
            serviceId: true,
            employeeId: true,
            price: true,
            service: {
              select: {
                id: true,
                name: true,
                category: true,
                duration: true,
                price: true,
              },
            },
            employee: {
              select: {
                id: true,
                name: true,
                experience: true,
                status: true,
              },
            },
          },
        },
      },
    })

    const now = new Date()

    const formatted = bookings.map((b) => ({
      id: b.id,
      status: "confirmed",
      date: b.date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: b.date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),

      services: b.bookingServices.map((bs) => ({
        serviceId: bs.serviceId,
        name: bs.service.name,
        price: Number(bs.price),
        duration: bs.service.duration,
        professionalId: bs.employeeId,
        professionalName: bs.employee?.name || null,
      })),
    }))

    const upcoming = formatted.filter(
      (b) => new Date(b.date.split("/").reverse().join("-")) >= now,
    )

    const past = formatted.filter(
      (b) => new Date(b.date.split("/").reverse().join("-")) < now,
    )

    return NextResponse.json({
      user,
      upcoming,
      past,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao carregar informações" },
      { status: 500 },
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const userId = Number(params.id)

  try {
    const body = await req.json()
    const { name, email, phone } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Nome, email e telefone são obrigatórios" },
        { status: 400 },
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id)

    await prisma.booking.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Erro ao excluir agendamento" },
      { status: 500 },
    )
  }
}
