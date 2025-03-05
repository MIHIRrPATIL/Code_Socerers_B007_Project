"use client"

import type { User } from "@/types/user"
import { ChevronLeft, Info, UserIcon } from "lucide-react"

interface ChatHeaderProps {
  client: User
  onViewInsights: () => void
  onBack?: () => void
  isMobile?: boolean
}

export default function ChatHeader({ client, onViewInsights, onBack, isMobile = false }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="mr-2 p-2 rounded-full hover:bg-secondary/50 transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
          <UserIcon size={20} />
        </div>

        <div className="ml-3">
          <h2 className="font-medium">{client.name}</h2>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </div>
      </div>

      <button
        onClick={onViewInsights}
        className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
        aria-label="View Insights"
      >
        <Info size={20} />
      </button>
    </div>
  )
}

