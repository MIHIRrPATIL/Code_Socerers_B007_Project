import type { User } from "@/types/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchClients(): Promise<User[]> {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/api/users/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch clients");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch clients error:", error);
    throw error;
  }
}
