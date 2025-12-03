"use client"

import { CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SuccessBookingDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#2A2A2A] bg-[#1A1A1A] text-white">
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-[#D4A574]/20 blur-xl" />
            <div className="relative rounded-full border-2 border-[#D4A574] bg-[#D4A574]/10 p-4">
              <CheckCircle2 className="h-16 w-16 text-[#D4A574]" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle className="text-2xl text-[#D4A574]">
              Agendamento Criado!
            </DialogTitle>
            <p className="text-white/60">
              O agendamento foi salvo com sucesso no sistema.
            </p>
          </div>
          <div className="w-full">
            <Button
              className="w-full bg-[#D4A574] text-black hover:bg-[#D4A574]/90"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessBookingDialog
