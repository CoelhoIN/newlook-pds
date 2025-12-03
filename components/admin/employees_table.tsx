"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DeleteDialog from "./delete_dialog"

type Service = {
  id: number
  name: string
  category: string
  price: number
}

type Professional = {
  id: number
  name: string
  experience: string
  status: string
  services?: Service[]
}

type ProfessionalForm = {
  name: string
  experience: string
  status: string
  serviceIds: number[]
}
const EmployeesTable = () => {
  const [services, setServices] = useState<Service[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])

  const [isProfessionalDialogOpen, setIsProfessionalDialogOpen] =
    useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [editingProfessional, setEditingProfessional] =
    useState<Professional | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "service" | "professional"
    id: number
  } | null>(null)

  const [professionalForm, setProfessionalForm] = useState<ProfessionalForm>({
    name: "",
    experience: "",
    status: "Ativo",
    serviceIds: [],
  })

  useEffect(() => {
    fetchProfessionals()
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const res = await fetch("/api/services")
    const data = await res.json()
    setServices(data)
  }
  const fetchProfessionals = async () => {
    const res = await fetch("/api/employees")
    const data = await res.json()
    setProfessionals(data)
  }

  const handleAddProfessional = () => {
    setEditingProfessional(null)
    setProfessionalForm({
      name: "",
      experience: "",
      status: "Ativo",
      serviceIds: [],
    })
    setIsProfessionalDialogOpen(true)
  }

  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional(professional)
    setProfessionalForm({
      name: professional.name,
      experience: professional.experience,
      status: professional.status,
      serviceIds: professional.services?.map((s) => s.id) || [],
    })
    setIsProfessionalDialogOpen(true)
  }

  const handleSaveProfessional = async () => {
    const method = editingProfessional ? "PUT" : "POST"
    const body = editingProfessional
      ? { id: editingProfessional.id, ...professionalForm }
      : professionalForm

    await fetch("/api/employees", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setIsProfessionalDialogOpen(false)
    fetchProfessionals()
  }

  const confirmDelete = async () => {
    if (deleteTarget?.type === "professional") {
      await fetch("/api/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      fetchProfessionals()
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-[#0A0A0A] pb-12 pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl text-[#D4A574] md:text-4xl">
                Profissionais
              </h1>
              <p className="mt-1 text-white/70">
                Gerencie os profissionais do salão
              </p>
            </div>
          </div>
        </div>
        <div>
          {/* Tabela Profissionais */}
          <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  Lista de Profissionais
                </CardTitle>
                <Button
                  onClick={handleAddProfessional}
                  className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Profissional
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-[#2A2A2A]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2A2A2A] hover:bg-[#1A1A1A]">
                      <TableHead className="text-white">
                        Nome Completo
                      </TableHead>
                      <TableHead className="text-white">Serviços</TableHead>
                      <TableHead className="text-white">Experiência</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-right text-white">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell>{professional.name}</TableCell>
                        <TableCell>
                          <div className="flex max-w-xs flex-wrap gap-1">
                            {professional.services?.map((s: Service) => (
                              <Badge
                                key={s.id}
                                variant="outline"
                                className="border-[#D4A574]/30 text-xs text-[#D4A574]"
                              >
                                {s.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{professional.experience}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              professional.status === "Ativo"
                                ? "border-green-500/30 text-green-500"
                                : "border-red-500/30 text-red-500"
                            }
                          >
                            {professional.status === "Ativo" ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {professional.status.charAt(0).toUpperCase() +
                              professional.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleEditProfessional(professional)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeleteTarget({
                                  type: "professional",
                                  id: professional.id,
                                })
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog Profissionais */}
        <Dialog
          open={isProfessionalDialogOpen}
          onOpenChange={setIsProfessionalDialogOpen}
        >
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-[#2A2A2A] bg-[#1A1A1A] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProfessional
                  ? "Editar Profissional"
                  : "Adicionar Profissional"}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Preencha as informações do profissional abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-white">Nome Completo</Label>
                <Input
                  value={professionalForm.name}
                  onChange={(e) =>
                    setProfessionalForm({
                      ...professionalForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Experiência</Label>
                  <Input
                    value={professionalForm.experience}
                    onChange={(e) =>
                      setProfessionalForm({
                        ...professionalForm,
                        experience: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label className="text-white">Status</Label>
                  <Select
                    value={professionalForm.status}
                    onValueChange={(value) =>
                      setProfessionalForm({
                        ...professionalForm,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-3 block text-white">Serviços</Label>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        const selected = professionalForm.serviceIds || []
                        const alreadySelected = selected.includes(service.id)
                        const updated = alreadySelected
                          ? selected.filter((id) => id !== service.id)
                          : [...selected, service.id]

                        setProfessionalForm({
                          ...professionalForm,
                          serviceIds: updated,
                        })
                      }}
                      className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                        professionalForm.serviceIds?.includes(service.id)
                          ? "border-[#D4A574] bg-[#D4A574]/10"
                          : "border-[#2A2A2A] bg-[#0A0A0A] hover:border-[#D4A574]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">
                          {service.name}
                        </span>
                        {professionalForm.serviceIds?.includes(service.id) && (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D4A574]">
                            <svg
                              className="h-3 w-3 text-black"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsProfessionalDialogOpen(false)}
                className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveProfessional}
                className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                disabled={!professionalForm.name}
              >
                {editingProfessional
                  ? "Salvar Alterações"
                  : "Adicionar Profissional"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Confirmação Deletar */}
        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          targetType={deleteTarget?.type || null}
        />
      </div>
    </section>
  )
}

export default EmployeesTable
