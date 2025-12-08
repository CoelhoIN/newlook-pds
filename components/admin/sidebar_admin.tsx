"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LayoutList, LogOut, Scissors, User } from "lucide-react"
import { signOut } from "next-auth/react"

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  page: "services" | "agenda" | "employees"
}

interface SidebarAdminProps {
  currentPage: "services" | "agenda" | "employees"
  onNavigate: (page: "services" | "agenda" | "employees") => void
  isCollapsed?: boolean
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>
}

export function SidebarAdmin({
  currentPage,
  onNavigate,
  isCollapsed: externalCollapsed,
  setIsCollapsed: setExternalCollapsed,
}: SidebarAdminProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false)
  const isCollapsed = externalCollapsed ?? internalCollapsed
  const setIsCollapsed = setExternalCollapsed ?? setInternalCollapsed

  const handleNavigate = (page: "services" | "agenda" | "employees") => {
    onNavigate(page)
  }

  const menuItems = [
    {
      id: "agenda",
      label: "Agenda",
      icon: LayoutList,
      page: "agenda" as const,
    },
    {
      id: "services",
      label: "Serviços",
      icon: Scissors,
      page: "services" as const,
    },
    {
      id: "employees",
      label: "Profissionais",
      icon: User,
      page: "employees" as const,
    },
  ]

  return (
    <Sidebar
      collapsible="icon"
      className={`fixed bottom-0 left-0 top-20 z-40 flex h-[calc(100vh-5rem)] flex-col justify-between border-r border-[#2A2A2A] bg-black text-white transition-all duration-300 ${
        isCollapsed ? "!w-[80px]" : "w-[260px]"
      }`}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-[#2A2A2A] p-4">
        <div className="flex w-full items-center justify-between">
          <h2
            className={`text-lg font-medium text-[#D4A574] transition-all duration-300 ${
              isCollapsed
                ? "w-0 overflow-hidden opacity-0"
                : "w-auto opacity-100"
            }`}
          >
            Painel Admin
          </h2>

          <SidebarTrigger
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/60 transition-transform hover:bg-[#D4A574]/10 hover:text-[#D4A574]"
          />
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="flex-1 space-y-2 p-3">
        <SidebarGroup>
          <SidebarGroupLabel
            className={`${isCollapsed ? "hidden" : "pl-2 text-xs uppercase text-white/40"}`}
          >
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item: MenuItem) => {
                const Icon = item.icon
                const isActive = currentPage === item.page

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => handleNavigate(item.page)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 ${
                        isActive
                          ? "border border-[#D4A574]/30 bg-[#D4A574]/20 text-[#D4A574]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      } ${isCollapsed ? "justify-center" : ""}`}
                    >
                      <button className="flex w-full items-center">
                        <Icon
                          className={`${
                            isCollapsed ? "h-7 w-7" : "h-5 w-5"
                          } flex-shrink-0`}
                        />
                        {!isCollapsed && (
                          <span className="ml-2 text-sm">{item.label}</span>
                        )}
                        {isActive && !isCollapsed && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4A574]" />
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="space-y-3 border-t border-[#2A2A2A] p-4">
        {!isCollapsed ? (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:bg-[#D4A574]/10 hover:text-[#D4A574]"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center justify-center rounded-lg p-2 text-white/70 hover:bg-[#D4A574]/10 hover:text-[#D4A574]"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
