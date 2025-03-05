export interface Message {
    id?: string
    senderId: string
    recipientId: string
    content: string
    type: "text" | "image" | "file" | "audio"
    filename?: string
    timestamp: string
    read?: boolean
  }
  
  