import type { Message } from "@/types/message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchChatHistory(userId: string): Promise<Message[]> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat history");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch chat history error:", error);
    throw error;
  }
}
