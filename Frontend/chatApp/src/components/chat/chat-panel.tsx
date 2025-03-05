"use client"

import { useState, useEffect, useRef } from "react"
import type { User } from "../../types/user"
import { useSocket } from "../../hooks/use-socket"
import { useAuth } from "../../hooks/use-auth"
import { fetchChatHistory } from "../../services/chat-service"
import ChatHeader from "./chat-header"
import ChatMessages from "./chat-message"
import ChatInput from "./chat-input"
import type { Message } from "../../types/messages"

interface ChatPanelProps {
  selectedClient: User | null
  onViewInsights: () => void
  onBack?: () => void
  isMobile?: boolean
}

export default function ChatPanel({ selectedClient, onViewInsights, onBack, isMobile = false }: ChatPanelProps) {
  const { user } = useAuth()
  const { messages: socketMessages, sendMessage, sendFile, setTyping, typingStatus } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedClient && user) {
      setLoading(true)
      fetchChatHistory(selectedClient.id)
        .then((history) => {
          setMessages(history)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Failed to fetch chat history:", error)
          setLoading(false)
        })
    } else {
      setMessages([])
    }
  }, [selectedClient, user])

  useEffect(() => {
    if (selectedClient && socketMessages[selectedClient.id]) {
      setMessages(socketMessages[selectedClient.id])
    }
  }, [socketMessages, selectedClient])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleSendMessage = (content: string) => {
    if (selectedClient && content.trim()) {
      sendMessage(selectedClient.id, content)
    }
  }

  const handleSendFile = async (file: File) => {
    if (selectedClient) {
      await sendFile(selectedClient.id, file)
    }
  }

  const handleTyping = (isTyping: boolean) => {
    if (selectedClient) {
      setTyping(selectedClient.id, isTyping)
    }
  }

  if (!selectedClient) {
    return (
      <div className="glass-card flex flex-col h-full items-center justify-center text-center p-8">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold mb-4">Select a client to start chatting</h2>
          <p className="text-muted-foreground">
            Choose a client from the list to view your conversation and exchange messages.
          </p>
        </div>
      </div>
    )
  }

  const isClientTyping = selectedClient ? typingStatus[selectedClient.id] : false

  return (
    <div className="glass-card flex flex-col h-full">
      <ChatHeader client={selectedClient} onViewInsights={onViewInsights} onBack={onBack} isMobile={isMobile} />

      <ChatMessages
        messages={messages}
        loading={loading}
        currentUserId={user?.id || ""}
        isTyping={isClientTyping}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput onSendMessage={handleSendMessage} onSendFile={handleSendFile} onTyping={handleTyping} />
    </div>
  )
}

