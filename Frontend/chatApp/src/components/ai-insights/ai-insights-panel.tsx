"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, MapPin, Calendar, DollarSign, Clock, RefreshCw } from "lucide-react"
import TodoList from "@/components/todo-list"

interface ChatInsightsProps {
  selectedChat: string | null
  messages: any[]
}

export default function ChatInsights({ selectedChat, messages }: ChatInsightsProps) {
  const [insights, setInsights] = useState<any>({
    property: null,
    price: null,
    location: null,
    meetings: [],
    summary: "",
    loading: false,
  })

  useEffect(() => {
    if (!selectedChat || messages.length === 0) return

    // In a real app, this would be an API call to an AI service
    // For demo purposes, we'll simulate AI analysis with mock data
    analyzeChat(messages)
  }, [selectedChat, messages])

  const analyzeChat = (messages: any[]) => {
    setInsights((prev) => ({ ...prev, loading: true }))

    // Simulate API delay
    setTimeout(() => {
      // Mock AI analysis results
      const mockInsights = {
        property: {
          type: "3BHK Apartment",
          size: "1500 sq ft",
          amenities: ["Swimming Pool", "Gym", "24/7 Security"],
        },
        price: {
          asking: "₹1.5 Cr",
          negotiated: "₹1.4 Cr",
          status: "Under negotiation",
        },
        location: {
          area: "Bandra West",
          landmarks: ["Near Bandstand", "5 min from station"],
        },
        meetings: [{ date: "2025-03-10", time: "11:00 AM", location: "Property Site" }],
        summary:
          "Client is interested in the 3BHK apartment in Bandra West. They've requested a site visit and are negotiating on the price. The client prefers a property with modern amenities and good connectivity.",
        loading: false,
      }

      setInsights(mockInsights)
    }, 1500)
  }

  if (!selectedChat) {
    return (
      <div className="w-80 border-l border-gray-800 bg-black/20 backdrop-blur-md hidden md:block">
        <div className="flex items-center justify-center h-full text-gray-500">Select a chat to view insights</div>
      </div>
    )
  }

  return (
    <div className="w-80 border-l border-gray-800 bg-black/20 backdrop-blur-md overflow-y-auto hidden md:flex md:flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Conversation Insights</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => analyzeChat(messages)}
            disabled={insights.loading}
            className="text-purple-400 hover:text-purple-300"
          >
            <RefreshCw className={`h-4 w-4 ${insights.loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {insights.loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-2" />
              <p className="text-gray-400">Analyzing conversation...</p>
            </div>
          </div>
        ) : (
          <>
            {insights.summary && (
              <Card className="mb-4 bg-gray-800/50 border-gray-700 shadow-lg hover:shadow-purple-900/10 transition-all rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300">{insights.summary}</p>
                </CardContent>
              </Card>
            )}

            {insights.property && (
              <Card className="mb-4 bg-gray-800/50 border-gray-700 shadow-lg hover:shadow-purple-900/10 transition-all rounded-xl">
                <CardHeader className="pb-2 flex flex-row items-center">
                  <Home className="h-4 w-4 text-purple-400 mr-2" />
                  <CardTitle className="text-sm font-medium text-gray-300">Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Type</span>
                      <span className="text-xs text-white">{insights.property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Size</span>
                      <span className="text-xs text-white">{insights.property.size}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Amenities</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {insights.property.amenities.map((amenity: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-purple-900/30 text-purple-300 border-purple-800"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {insights.price && (
              <Card className="mb-4 bg-gray-800/50 border-gray-700 shadow-lg hover:shadow-purple-900/10 transition-all rounded-xl">
                <CardHeader className="pb-2 flex flex-row items-center">
                  <DollarSign className="h-4 w-4 text-green-400 mr-2" />
                  <CardTitle className="text-sm font-medium text-gray-300">Price Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Asking</span>
                      <span className="text-xs text-white">{insights.price.asking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Negotiated</span>
                      <span className="text-xs text-white">{insights.price.negotiated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Status</span>
                      <Badge variant="outline" className="text-xs bg-purple-900/30 text-purple-300 border-purple-800">
                        {insights.price.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {insights.location && (
              <Card className="mb-4 bg-gray-800/50 border-gray-700 shadow-lg hover:shadow-purple-900/10 transition-all rounded-xl">
                <CardHeader className="pb-2 flex flex-row items-center">
                  <MapPin className="h-4 w-4 text-red-400 mr-2" />
                  <CardTitle className="text-sm font-medium text-gray-300">Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Area</span>
                      <span className="text-xs text-white">{insights.location.area}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Landmarks</span>
                      <ul className="mt-1 space-y-1">
                        {insights.location.landmarks.map((landmark: string, index: number) => (
                          <li key={index} className="text-xs text-white flex items-center">
                            <span className="h-1 w-1 rounded-full bg-purple-500 mr-2"></span>
                            {landmark}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {insights.meetings && insights.meetings.length > 0 && (
              <Card className="mb-4 bg-gray-800/50 border-gray-700 shadow-lg hover:shadow-purple-900/10 transition-all rounded-xl">
                <CardHeader className="pb-2 flex flex-row items-center">
                  <Calendar className="h-4 w-4 text-purple-400 mr-2" />
                  <CardTitle className="text-sm font-medium text-gray-300">Scheduled Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.meetings.map((meeting: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-900/50 p-2 rounded-lg border border-gray-700 hover:border-purple-700 transition-all shadow-md"
                      >
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 text-purple-400 mr-1" />
                          <span className="text-xs text-white">{new Date(meeting.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <Clock className="h-3 w-3 text-purple-400 mr-1" />
                          <span className="text-xs text-white">{meeting.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 text-red-400 mr-1" />
                          <span className="text-xs text-white">{meeting.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {selectedChat && (
        <div className="border-t border-gray-800 p-4">
          <TodoList chatId={selectedChat} compact={true} />
        </div>
      )}
    </div>
  )
}

