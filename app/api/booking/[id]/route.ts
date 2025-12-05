import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

type BookingUpdateBody = {
  costumerName?: string
  costumerPhone?: string
  date?: string
  services?: {
    id: number
    price: number
  }[]
  professionals?: Record<number, number>
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id)
    const body: BookingUpdateBody = await req.json()

    const existing = await prisma.booking.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 },
      )
    }

    const canEditClientInfo = !existing.userId

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        costumerName: canEditClientInfo ? body.costumerName : undefined,
        costumerPhone: canEditClientInfo ? body.costumerPhone : undefined,

        date: body.date ? new Date(body.date) : undefined,
        bookingServices: body.services
          ? {
              deleteMany: {},
              create: body.services.map((s) => ({
                serviceId: s.id,
                price: s.price,
                employeeId: body.professionals?.[s.id] ?? undefined,
              })),
            }
          : undefined,
      },
      include: {
        user: true,
        employee: true,
        bookingServices: {
          include: {
            service: true,
            employee: true,
          },
        },
      },
    })

    const formatted = {
      id: updated.id,
      costumerName: updated.costumerName,
      costumerPhone: updated.costumerPhone,
      date: updated.date,
      userId: updated.userId,
      price: updated.bookingServices.reduce(
        (sum, b) => sum + Number(b.price),
        0,
      ),
      services: updated.bookingServices.map((bs) => ({
        id: bs.serviceId,
        name: bs.service.name,
        duration: bs.service.duration,
        price: Number(bs.price),
        professionalId: bs.employee?.id ?? 0,
        professionalName: bs.employee?.name ?? "—",
      })),
    }

    return NextResponse.json(formatted)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id)

    const existing = await prisma.booking.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 },
      )
    }
    await prisma.bookingService.deleteMany({
      where: { bookingId: id },
    })

    await prisma.booking.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao excluir agendamento" },
      { status: 500 },
    )
  }
}
