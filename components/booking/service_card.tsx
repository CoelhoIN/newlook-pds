import { LucideIcon } from "lucide-react"

type Service = {
  id: number
  name: string
  category: string
  price: number
}

const ServiceCard = ({
  service,
  icon: Icon,
  isSelected,
  onSelect,
}: {
  service: Service
  icon: LucideIcon
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
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div
            className={`rounded-full p-2 ${
              isSelected ? "bg-[#D4A574]" : "bg-[#2A2A2A]"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                isSelected ? "text-black" : "text-[#D4A574]"
              }`}
            />
          </div>
          <div>
            <h4 className="text-white">{service.name}</h4>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#D4A574]">
            {Number(service.price).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
