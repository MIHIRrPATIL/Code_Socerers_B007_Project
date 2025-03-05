"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../hooks/use-auth"
import ClientsList from "../clients-list/clients-list"
import ChatPanel from "../chat/chat-panel"
import AIInsightsPanel from "../ai-insights/ai-insights-panel"
import type { User } from "../../types/user"
import { fetchClients } from "../../services/user-service"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [clients, setClients] = useState<User[]>([])
  const [selectedClient, setSelectedClient] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activePanel, setActivePanel] = useState<"clients" | "chat" | "insights">("clients")

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const loadClients = async () => {
      try {
        const fetchedClients = await fetchClients()
        setClients(fetchedClients)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load clients:", error)
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  const handleClientSelect = (client: User) => {
    setSelectedClient(client)
    if (isMobile) {
      setActivePanel("chat")
    }
  }

  const handleBackToClients = () => {
    setActivePanel("clients")
  }

  const handleViewInsights = () => {
    if (isMobile) {
      setActivePanel("insights")
    }
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-background to-secondary overflow-hidden">
      <div className="flex w-full h-full">
        {/* Desktop Layout */}
        {!isMobile ? (
          <>
            <div className="w-1/4 h-full p-4">
              <ClientsList
                clients={clients}
                loading={loading}
                onSelectClient={handleClientSelect}
                selectedClient={selectedClient}
                onLogout={logout}
                currentUser={user}
              />
            </div>

            <div className="w-2/4 h-full p-4">
              <ChatPanel selectedClient={selectedClient} onViewInsights={handleViewInsights} />
            </div>

            <div className="w-1/4 h-full p-4">
              <AIInsightsPanel selectedClient={selectedClient} />
            </div>
          </>
        ) : (
          // Mobile Layout
          <div className="w-full h-full">
            {activePanel === "clients" && (
              <div className="w-full h-full p-4">
                <ClientsList
                  clients={clients}
                  loading={loading}
                  onSelectClient={handleClientSelect}
                  selectedClient={selectedClient}
                  onLogout={logout}
                  currentUser={user}
                />
              </div>
            )}

            {activePanel === "chat" && (
              <div className="w-full h-full p-4">
                <ChatPanel
                  selectedClient={selectedClient}
                  onViewInsights={handleViewInsights}
                  onBack={handleBackToClients}
                  isMobile={true}
                />
              </div>
            )}

            {activePanel === "insights" && (
              <div className="w-full h-full p-4">
                <AIInsightsPanel
                  selectedClient={selectedClient}
                  onBack={() => setActivePanel("chat")}
                  isMobile={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

