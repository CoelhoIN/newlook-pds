import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { name, phone, email, password } = await req.json()

    if (!name || !phone || !email || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos." },
        { status: 400 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "E-mail já cadastrado." },
        { status: 400 },
      )
    }

    const hashedPassword = await hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role: "CLIENT",
      },
    })

    return NextResponse.json({
      message: "Usuário criado com sucesso.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Erro ao registrar:", error)
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 },
    )
  }
}
