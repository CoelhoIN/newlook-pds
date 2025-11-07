import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { services: true },
      orderBy: { name: "asc" },
    })
    const formatted = employees.map((emp) => ({
      ...emp,
      specialties: emp.services.map((s) => s.id),
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("Erro ao listar funcionários:", error)
    return NextResponse.json(
      { error: "Erro ao listar funcionários" },
      { status: 500 },
    )
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, experience, status, serviceIds } = body

    if (
      !name ||
      !experience ||
      !status ||
      !Array.isArray(serviceIds) ||
      serviceIds.length === 0
    ) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        experience,
        status,
        services: {
          connect: serviceIds.map((id: number) => ({ id })),
        },
      },
      include: { services: true },
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Erro ao criar funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao criar funcionário" },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, experience, status, serviceIds } = body

    if (!id || !name || !experience || !status || !Array.isArray(serviceIds)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        experience,
        status,
        services: {
          set: serviceIds.map((id: number) => ({ id })),
        },
      },
      include: { services: true },
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar funcionário" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id)
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })

    await prisma.employee.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error)
    return NextResponse.json(
      { error: "Erro ao excluir funcionário" },
      { status: 500 },
    )
  }
}
