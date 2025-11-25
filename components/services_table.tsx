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
import { Plus, Edit, Trash2 } from "lucide-react"
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
  duration: number
}

const ServicesTable = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "service" | "professional"
    id: number
  } | null>(null)

  const [services, setServices] = useState<Service[]>([])
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const res = await fetch("/api/services")
    const data = await res.json()
    setServices(data)
  }

  const handleAddService = () => {
    setEditingService(null)
    setServiceForm({ name: "", category: "", price: "", duration: "" })
    setIsServiceDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setServiceForm({
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration?.toString(),
    })
    setIsServiceDialogOpen(true)
  }

  const handleSaveService = async () => {
    const method = editingService ? "PUT" : "POST"
    const body = editingService
      ? { id: editingService.id, ...serviceForm }
      : serviceForm

    await fetch("/api/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setIsServiceDialogOpen(false)
    fetchServices()
  }

  const confirmDelete = async () => {
    if (deleteTarget?.type === "service") {
      await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      fetchServices()
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
              <h1 className="text-3xl text-[#D4A574] md:text-4xl">Serviços</h1>
              <p className="mt-1 text-white/70">
                Gerencie os serviços do salão
              </p>
            </div>
          </div>
        </div>
        <div>
          {/* Tabela Serviços */}
          <Card className="border-[#2A2A2A] bg-black/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Lista de Serviços</CardTitle>
                <Button
                  onClick={handleAddService}
                  className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Serviço
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-[#2A2A2A]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#2A2A2A] hover:bg-[#1A1A1A]">
                      <TableHead className="text-white">Nome</TableHead>
                      <TableHead className="text-white">Categoria</TableHead>
                      <TableHead className="text-white">Duração</TableHead>
                      <TableHead className="text-white">Preço</TableHead>
                      <TableHead className="text-right text-white">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-[#D4A574]/30 text-xs text-[#D4A574]"
                          >
                            {service.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{service.duration} min</TableCell>
                        <TableCell>
                          R${" "}
                          {Number(service.price).toFixed(2).replace(".", ",")}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditService(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setDeleteTarget({
                                  type: "service",
                                  id: service.id,
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

        {/* Dialog Serviços */}
        <Dialog
          open={isServiceDialogOpen}
          onOpenChange={setIsServiceDialogOpen}
        >
          <DialogContent className="max-w-md border-[#2A2A2A] bg-[#1A1A1A] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingService ? "Editar Serviço" : "Adicionar Serviço"}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Preencha as informações do serviço abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-white">Nome do Serviço</Label>
                <Input
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="text-white">Categoria</Label>
                <Select
                  value={serviceForm.category}
                  onValueChange={(value) =>
                    setServiceForm({ ...serviceForm, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cabelo">Cabelo</SelectItem>
                    <SelectItem value="Manicure/Pedicure">
                      Manicure/Pedicure
                    </SelectItem>
                    <SelectItem value="Massagem">Massagem</SelectItem>
                    <SelectItem value="Depilação Corporal">
                      Depilação Corporal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Duração (minutos)</Label>
                <Input
                  type="number"
                  value={serviceForm.duration}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, duration: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="text-white">Preço (R$)</Label>
                <Input
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, price: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsServiceDialogOpen(false)}
                className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveService}
                className="bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
                disabled={!serviceForm.name || !serviceForm.price}
              >
                {editingService ? "Salvar Alterações" : "Adicionar Serviço"}
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

export default ServicesTable
