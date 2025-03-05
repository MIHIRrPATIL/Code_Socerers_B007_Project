"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "../../hooks/use-auth"
import type { Message } from "../../types/messages"

interface SocketContextType {
  socket: Socket | null
  connected: boolean
  messages: Record<string, Message[]>
  sendMessage: (recipientId: string, content: string, type?: string) => void
  sendFile: (recipientId: string, file: File) => Promise<void>
  typingStatus: Record<string, boolean>
  setTyping: (recipientId: string, isTyping: boolean) => void
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  messages: {},
  sendMessage: () => {},
  sendFile: async () => {},
  typingStatus: {},
  setTyping: () => {},
})

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({})
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to WebSocket server
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        auth: {
          token: localStorage.getItem("token"),
        },
      })

      socketInstance.on("connect", () => {
        setConnected(true)
      })

      socketInstance.on("disconnect", () => {
        setConnected(false)
      })

      socketInstance.on("message", (message: Message) => {
        setMessages((prev) => {
          const senderId = message.senderId
          const prevMessages = prev[senderId] || []
          return {
            ...prev,
            [senderId]: [...prevMessages, message],
          }
        })
      })

      socketInstance.on("typing", ({ userId, isTyping }) => {
        setTypingStatus((prev) => ({
          ...prev,
          [userId]: isTyping,
        }))
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [isAuthenticated, user])

  const sendMessage = (recipientId: string, content: string, type = "text") => {
    if (socket && user) {
      const message: Partial<Message> = {
        senderId: user.id,
        recipientId,
        content,
        type,
        timestamp: new Date().toISOString(),
      }

      socket.emit("message", message)

      // Optimistically add to messages
      setMessages((prev) => {
        const prevMessages = prev[recipientId] || []
        return {
          ...prev,
          [recipientId]: [...prevMessages, message as Message],
        }
      })
    }
  }

  const sendFile = async (recipientId: string, file: File) => {
    if (socket && user) {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          resolve(base64)
        }
        reader.readAsDataURL(file)
      })

      const type = file.type.startsWith("image/") ? "image" : "file"

      const message: Partial<Message> = {
        senderId: user.id,
        recipientId,
        content: base64,
        type,
        filename: file.name,
        timestamp: new Date().toISOString(),
      }

      socket.emit("message", message)

      // Optimistically add to messages
      setMessages((prev) => {
        const prevMessages = prev[recipientId] || []
        return {
          ...prev,
          [recipientId]: [...prevMessages, message as Message],
        }
      })
    }
  }

  const setTyping = (recipientId: string, isTyping: boolean) => {
    if (socket && user) {
      socket.emit("typing", { recipientId, isTyping })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        messages,
        sendMessage,
        sendFile,
        typingStatus,
        setTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

