"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  targetType: "service" | "professional" | null
}
const DeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  targetType,
}: DeleteDialogProps) => {
  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="border-[#2A2A2A] bg-[#1A1A1A]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Tem certeza que deseja excluir este{" "}
              {targetType === "service" ? "serviço" : "profissional"}? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteDialog
