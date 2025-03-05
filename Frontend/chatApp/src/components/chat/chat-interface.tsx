"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { UserType } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mic, Send, Paperclip, Smile, Calendar } from "lucide-react"
import { useSocket } from "@/context/socket-context"
import ChatMessage from "@/components/chat-message"
import ScheduleMaker from "@/components/schedule-maker"

interface ChatInterfaceProps {
  userType: UserType
  userId: string
  selectedChat: string | null
  messages: any[]
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
}

export default function ChatInterface({ userType, userId, selectedChat, messages, setMessages }: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { socket } = useSocket()
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

  // Speech recognition setup
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition: SpeechRecognitionStatic =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setMessage(transcript)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setIsRecording(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleRecording = () => {
    if (!recognition) return

    if (isRecording) {
      recognition.stop()
    } else {
      setMessage("")
      recognition.start()
    }

    setIsRecording(!isRecording)
  }

  const sendMessage = () => {
    if (!message.trim() || !selectedChat || !socket) return

    const newMessage = {
      id: Date.now().toString(),
      chatId: selectedChat,
      sender: userId,
      senderType: userType,
      text: message,
      timestamp: new Date().toISOString(),
    }

    socket.emit("send-message", newMessage)
    setMessages((prev) => [...prev, newMessage])
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Predefined messages to simulate a conversation about the flat
  useEffect(() => {
    if (selectedChat && messages.length === 0) {
      const initialMessages = [
        {
          id: "1",
          chatId: selectedChat,
          sender: "client",
          senderType: "client",
          text: "Hi, I'm interested in the 3BHK apartment in Bandra West. Can you tell me more about it?",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          chatId: selectedChat,
          sender: userId,
          senderType: userType,
          text: "Sure! It's a 1500 sq ft apartment with modern amenities like a swimming pool, gym, and 24/7 security.",
          timestamp: new Date().toISOString(),
        },
        {
          id: "3",
          chatId: selectedChat,
          sender: "client",
          senderType: "client",
          text: "That sounds great! What's the asking price?",
          timestamp: new Date().toISOString(),
        },
        {
          id: "4",
          chatId: selectedChat,
          sender: userId,
          senderType: userType,
          text: "The asking price is ₹1.5 Cr, but we're currently negotiating around ₹1.4 Cr.",
          timestamp: new Date().toISOString(),
        },
        {
          id: "5",
          chatId: selectedChat,
          sender: "client",
          senderType: "client",
          text: "I'd like to schedule a site visit. Is that possible?",
          timestamp: new Date().toISOString(),
        },
        {
          id: "6",
          chatId: selectedChat,
          sender: userId,
          senderType: userType,
          text: "Absolutely! How about March 10th at 11:00 AM?",
          timestamp: new Date().toISOString(),
        },
      ]

      setMessages(initialMessages)
    }
  }, [selectedChat])

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900/50 backdrop-blur-md">
        <div className="text-center p-6">
          <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Send className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No conversation selected</h3>
          <p className="text-gray-400 max-w-md">
            Select a contact from the list to start chatting or view conversation details.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900/30 backdrop-blur-md">
      <div className="flex-1 flex flex-col p-0 m-0 h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length > 0 ? (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} isOwnMessage={msg.sender === userId} />)
          ) : (
            <div className="text-center py-8 text-gray-500">No messages yet. Start the conversation!</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Smile className="h-5 w-5" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="bg-gray-800/50 border-gray-700 text-white"
            />
            <Button
              variant="ghost"
              size="icon"
              className={`${isRecording ? "text-red-500" : "text-gray-400 hover:text-white"}`}
              onClick={toggleRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-white">Schedule Meeting</DialogTitle>
                </DialogHeader>
                <ScheduleMaker chatId={selectedChat} onScheduled={() => setIsScheduleOpen(false)} />
              </DialogContent>
            </Dialog>
            <Button onClick={sendMessage} size="icon" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

