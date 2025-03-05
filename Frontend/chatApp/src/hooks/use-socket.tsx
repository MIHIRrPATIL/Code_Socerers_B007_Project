"use client"

import { useContext } from "react"
import { SocketContext } from "../components/contexts/socket-context"

export const useSocket = () => {
  const context = useContext(SocketContext)

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }

  return context
}

