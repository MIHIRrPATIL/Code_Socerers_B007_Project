export const fetchAIInsights = async (prompt: string) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const response = await fetch("https://api.example.com/endpoint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data;
};
