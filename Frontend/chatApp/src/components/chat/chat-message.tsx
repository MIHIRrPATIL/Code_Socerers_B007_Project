"use client"

import type React from "react"

import type { Message } from "../../types/messages"
import { formatDistanceToNow } from "date-fns"
import { Check, CheckCheck } from "lucide-react"

interface ChatMessagesProps {
  messages: Message[]
  loading: boolean
  currentUserId: string
  isTyping: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export default function ChatMessages({
  messages,
  loading,
  currentUserId,
  isTyping,
  messagesEndRef,
}: ChatMessagesProps) {
  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-center">
          <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUserId
            const showDate =
              index === 0 ||
              new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString()

            return (
              <div key={message.id || index}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs bg-secondary/50 px-2 py-1 rounded-full">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isCurrentUser ? "bg-primary/20 rounded-tr-none" : "bg-secondary/50 rounded-tl-none"
                    }`}
                  >
                    {message.type === "text" && <p>{message.content}</p>}

                    {message.type === "image" && (
                      <div className="mb-2">
                        <img
                          src={message.content || "/placeholder.svg"}
                          alt="Shared image"
                          className="max-w-full rounded-md"
                        />
                      </div>
                    )}

                    {message.type === "file" && (
                      <div className="flex items-center bg-secondary/30 p-2 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <a href={message.content} download={message.filename} className="text-primary hover:underline">
                          {message.filename || "Download file"}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </span>

                      {isCurrentUser && (
                        <span className="text-muted-foreground">
                          {message.read ? <CheckCheck size={14} /> : <Check size={14} />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-secondary/50 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}

