import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
  })
  return NextResponse.json(services)
}

export async function POST(req: Request) {
  const data = await req.json()
  const { name, category, price, duration } = data

  if (!name || !category || !price || !duration)
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 },
    )

  const service = await prisma.service.create({
    data: { name, category, price, duration: Number(duration) },
  })
  return NextResponse.json(service)
}

export async function PUT(req: Request) {
  const data = await req.json()
  const { id, name, category, price, duration } = data

  const updated = await prisma.service.update({
    where: { id },
    data: {
      name,
      category,
      price,
      duration: duration ? Number(duration) : undefined,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
