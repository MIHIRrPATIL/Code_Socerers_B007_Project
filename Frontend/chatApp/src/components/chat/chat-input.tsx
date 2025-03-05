"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Paperclip, Send, Mic, X } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onSendFile: (file: File) => Promise<void>
  onTyping: (isTyping: boolean) => void
}

export default function ChatInput({ onSendMessage, onSendFile, onTyping }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [previewFile, setPreviewFile] = useState<{ file: File; preview: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      if (previewFile) {
        URL.revokeObjectURL(previewFile.preview)
      }

      stopRecording()
    }
  }, [previewFile])

  const handleTyping = () => {
    onTyping(true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false)
    }, 2000)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
      onTyping(false)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setPreviewFile({ file, preview })
    }
  }

  const handleSendFile = async () => {
    if (previewFile) {
      await onSendFile(previewFile.file)
      URL.revokeObjectURL(previewFile.preview)
      setPreviewFile(null)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioFile = new File([audioBlob], "voice-message.wav", { type: "audio/wav" })
        await onSendFile(audioFile)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="p-4 border-t border-white/10">
      {previewFile && (
        <div className="mb-4 relative">
          <div className="glass-card p-3 flex items-center">
            {previewFile.file.type.startsWith("image/") ? (
              <img src={previewFile.preview || "/placeholder.svg"} alt="Preview" className="h-20 w-auto rounded-md" />
            ) : (
              <div className="flex items-center">
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
                <span>{previewFile.file.name}</span>
              </div>
            )}

            <div className="ml-auto flex space-x-2">
              <button
                onClick={() => {
                  URL.revokeObjectURL(previewFile.preview)
                  setPreviewFile(null)
                }}
                className="p-1 rounded-full hover:bg-secondary/50 transition-colors"
                aria-label="Cancel"
              >
                <X size={18} />
              </button>

              <button
                onClick={handleSendFile}
                className="p-1 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              handleTyping()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="glass-input w-full py-2 px-4 pr-10 resize-none h-12 max-h-32"
            rows={1}
            disabled={isRecording}
          />
        </div>

        {message.trim() ? (
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        ) : (
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-2 rounded-full transition-colors ${isRecording ? "bg-destructive" : "hover:bg-secondary/50"}`}
            aria-label={isRecording ? "Recording..." : "Record voice message"}
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

