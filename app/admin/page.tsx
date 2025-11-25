"use client"

import { SidebarAdmin } from "@/components/sidebar_admin"
import React, { useState } from "react"
import Schedule from "../../components/schedule/schedule"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import ServicesTable from "@/components/services_table"
import EmployeesTable from "@/components/employees_table"

const AdminPage = () => {
  const [currentPage, setCurrentPage] = useState<
    "services" | "agenda" | "employees"
  >("agenda")
  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <div className="flex min-h-screen bg-[#111] text-white">
      <SidebarProvider>
        <SidebarTrigger
          className="fixed left-4 top-4 z-50 border border-[#2A2A2A] bg-[#0A0A0A]/80 text-white hover:bg-[#D4A574]/20 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        />

        {/* Sidebar fixa à esquerda */}
        <SidebarAdmin currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Conteúdo principal */}
        <main className="flex-1 transition-all duration-300">
          {currentPage === "agenda" && <Schedule />}
          {currentPage === "services" && <ServicesTable />}
          {currentPage === "employees" && <EmployeesTable />}
        </main>
      </SidebarProvider>
    </div>
  )
}

export default AdminPage
