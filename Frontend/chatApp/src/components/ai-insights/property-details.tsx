"use client"

import { MapPin, Home, Maximize, Bed, Bath, Car } from "lucide-react"

interface PropertyDetailsProps {
  insights: {
    address: string
    type: string
    size: string
    bedrooms: number
    bathrooms: number
    parking: number
    features: string[]
    description: string
    imageUrl?: string
  }
}

export default function PropertyDetails({ insights }: PropertyDetailsProps) {
  return (
    <div className="space-y-6 animate-in">
      <div className="relative rounded-lg overflow-hidden h-48">
        <img
          src={insights.imageUrl || "/placeholder.svg?height=400&width=600"}
          alt="Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center text-white">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm">{insights.address}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-3 flex items-center">
          <Home size={18} className="mr-2 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p>{insights.type}</p>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center">
          <Maximize size={18} className="mr-2 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Size</p>
            <p>{insights.size}</p>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center">
          <Bed size={18} className="mr-2 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Bedrooms</p>
            <p>{insights.bedrooms}</p>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center">
          <Bath size={18} className="mr-2 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Bathrooms</p>
            <p>{insights.bathrooms}</p>
          </div>
        </div>

        <div className="glass-card p-3 flex items-center">
          <Car size={18} className="mr-2 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Parking</p>
            <p>{insights.parking} spaces</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Features</h3>
        <div className="flex flex-wrap gap-2">
          {insights.features.map((feature, index) => (
            <span key={index} className="bg-secondary/30 px-3 py-1 rounded-full text-sm">
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Description</h3>
        <p className="text-muted-foreground">{insights.description}</p>
      </div>
    </div>
  )
}

