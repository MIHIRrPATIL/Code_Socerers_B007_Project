"use client"

import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { format } from "date-fns"

interface MeetingScheduleProps {
  insights: {
    upcomingMeetings: Array<{
      id: string
      title: string
      date: string
      time: string
      location: string
      participants: string[]
      notes?: string
    }>
    pastMeetings: Array<{
      id: string
      title: string
      date: string
      time: string
      location: string
      participants: string[]
      notes?: string
    }>
  }
}

export default function MeetingSchedule({ insights }: MeetingScheduleProps) {
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h3 className="text-lg font-medium mb-4">Upcoming Meetings</h3>
        {insights.upcomingMeetings.length === 0 ? (
          <div className="glass-card p-4 text-center text-muted-foreground">No upcoming meetings scheduled</div>
        ) : (
          <div className="space-y-4">
            {insights.upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="glass-card p-4">
                <h4 className="font-medium mb-2">{meeting.title}</h4>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="mr-2 text-primary" />
                    <span>{format(new Date(meeting.date), "MMMM d, yyyy")}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock size={16} className="mr-2 text-primary" />
                    <span>{meeting.time}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2 text-primary" />
                    <span>{meeting.location}</span>
                  </div>

                  <div className="flex items-start text-sm">
                    <Users size={16} className="mr-2 text-primary mt-1" />
                    <div>
                      <span className="block text-muted-foreground mb-1">Participants:</span>
                      <div className="flex flex-wrap gap-1">
                        {meeting.participants.map((participant, index) => (
                          <span key={index} className="bg-secondary/30 px-2 py-0.5 rounded-full text-xs">
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {meeting.notes && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-sm text-muted-foreground">{meeting.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Past Meetings</h3>
        {insights.pastMeetings.length === 0 ? (
          <div className="glass-card p-4 text-center text-muted-foreground">No past meetings</div>
        ) : (
          <div className="space-y-4">
            {insights.pastMeetings.map((meeting) => (
              <div key={meeting.id} className="glass-card p-4 opacity-80">
                <h4 className="font-medium mb-2">{meeting.title}</h4>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="mr-2 text-primary" />
                    <span>{format(new Date(meeting.date), "MMMM d, yyyy")}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock size={16} className="mr-2 text-primary" />
                    <span>{meeting.time}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-2 text-primary" />
                    <span>{meeting.location}</span>
                  </div>

                  {meeting.notes && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-sm text-muted-foreground">{meeting.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

