import { Check } from "lucide-react"
import { Badge } from "../ui/badge"

type Professional = {
  id: number
  name: string
  experience: string
  description: string
  status: string
  specialties: number[]
}

const ProfessinalCard = ({
  professional,
  isSelected,
  onSelect,
}: {
  professional: Professional
  isSelected: boolean
  onSelect: () => void
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
        isSelected
          ? "border-[#D4A574] bg-[#D4A574]/10"
          : "border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#D4A574]/30"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-white">{professional.name}</h4>
          </div>

          <p className="mb-2 text-sm text-white/60">
            {professional.description}
          </p>

          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-[#D4A574]/30 text-[#D4A574]"
            >
              <p>{professional.experience} de experiência</p>
            </Badge>
            {isSelected && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A574]">
                <Check className="h-4 w-4 text-black" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessinalCard
