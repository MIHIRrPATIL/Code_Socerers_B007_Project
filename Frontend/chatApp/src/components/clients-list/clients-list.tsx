"use client"

import { useState } from "react"
import type { User } from "../../types/user"
import { Search, LogOut, UserIcon } from "lucide-react"

interface ClientsListProps {
  clients: User[]
  loading: boolean
  onSelectClient: (client: User) => void
  selectedClient: User | null
  onLogout: () => void
  currentUser: User | null
}

export default function ClientsList({
  clients,
  loading,
  onSelectClient,
  selectedClient,
  onLogout,
  currentUser,
}: ClientsListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Clients</h2>
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        {currentUser && (
          <div className="flex items-center mb-4 p-2 rounded-lg bg-secondary/30">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <div className="ml-3">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No clients found" : "No clients available"}
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredClients.map((client) => (
              <li key={client.id}>
                <button
                  onClick={() => onSelectClient(client)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    selectedClient?.id === client.id ? "bg-primary/20" : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <div className="ml-3 text-left">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

