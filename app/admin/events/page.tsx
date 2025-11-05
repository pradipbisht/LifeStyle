"use client";

import { useState, useEffect } from "react";

import {
  CalendarIcon,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  EVENT_CATEGORIES,
  EVENT_STATUS_OPTIONS,
  type CalendarEvent,
  type EventCategory,
} from "@/types/event";
import { eventService } from "@/lib/services/eventService";
import EventStatsCards from "./components/EventStatsCards";
import EventList from "./components/EventList";
import EventFormDialog from "./components/EventFormDialog";
import EventDetailDialog from "./components/EventDetailDialog";

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "cancelled" | "completed"
  >("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Real events data from Firebase
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load events from Firebase
  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getEvents();
      // Map the events to include the date field for compatibility
      const mappedEvents = eventsData.map((event) => ({
        ...event,
        date: event.startDate, // Use startDate as date for calendar compatibility
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh events without full page reload
  const refreshEvents = async () => {
    try {
      setRefreshing(true);
      const eventsData = await eventService.getEvents();
      // Map the events to include the date field for compatibility
      const mappedEvents = eventsData.map((event) => ({
        ...event,
        date: event.startDate, // Use startDate as date for calendar compatibility
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error refreshing events:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filter events based on current filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get events for selected date
  const selectedDateEvents = filteredEvents.filter(
    (event) =>
      selectedDate && event.date.toDateString() === selectedDate.toDateString()
  );

  // Get calendar modifiers for styling days with events
  const eventDates = filteredEvents.reduce((acc, event) => {
    const dateKey = event.date.toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const dayModifiers = {
    hasEvents: Object.keys(eventDates).map((dateStr) => new Date(dateStr)),
    featured: filteredEvents.filter((e) => e.featured).map((e) => e.date),
  };

  const dayClassNames = {
    hasEvents: "bg-blue-50 border-blue-200 font-semibold",
    featured: "bg-purple-100 border-purple-300 text-purple-800",
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailDialogOpen(true);
  };

  const getCategoryColor = (category: EventCategory) => {
    const categoryConfig = EVENT_CATEGORIES.find((c) => c.value === category);
    return categoryConfig?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const statusConfig = EVENT_STATUS_OPTIONS.find((s) => s.value === status);
    return statusConfig?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 ml-4 mr-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Event Management
          </h1>
          <p className="text-muted-foreground">
            Manage events, track attendance, and monitor registrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refreshEvents}
            disabled={refreshing}
            className="flex items-center gap-2">
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading events...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <EventStatsCards events={events} />

          {/* Filters and Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) =>
                      setCategoryFilter(value as EventCategory | "all")
                    }>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {EVENT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {EVENT_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Tabs
                  value={viewMode}
                  onValueChange={(value) =>
                    setViewMode(value as "calendar" | "list")
                  }>
                  <TabsList>
                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewMode} className="w-full">
                <TabsContent value="calendar" className="mt-0">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Event Calendar
                          </CardTitle>
                          <CardDescription>
                            Click on a date to view events. Purple dates have
                            featured events.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            modifiers={dayModifiers}
                            modifiersClassNames={dayClassNames}
                            className="rounded-md border"
                          />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Selected Date Events */}
                    <div>
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {selectedDate
                              ? selectedDate.toLocaleDateString()
                              : "Select a Date"}
                          </CardTitle>
                          <CardDescription>
                            {selectedDateEvents.length} event(s) scheduled
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedDateEvents.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-8">
                                No events scheduled for this date
                              </p>
                            ) : (
                              selectedDateEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                  onClick={() => handleEventClick(event)}>
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-sm">
                                      {event.title}
                                    </h4>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleEventClick(event)
                                          }>
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                          Cancel Event
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <span>
                                      {event.startTime} - {event.endTime}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className={getCategoryColor(
                                        event.category
                                      )}>
                                      {
                                        EVENT_CATEGORIES.find(
                                          (c) => c.value === event.category
                                        )?.label
                                      }
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <Badge
                                      variant="outline"
                                      className={getStatusColor(event.status)}>
                                      {
                                        EVENT_STATUS_OPTIONS.find(
                                          (s) => s.value === event.status
                                        )?.label
                                      }
                                    </Badge>
                                    <span className="text-muted-foreground">
                                      {event.registered}/{event.capacity}{" "}
                                      registered
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <EventList
                    events={filteredEvents}
                    onEventClick={handleEventClick}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Create Event Dialog */}
          <EventFormDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            mode="create"
            onEventCreated={loadEvents}
          />

          {/* Event Detail Dialog */}
          {selectedEvent && (
            <EventDetailDialog
              event={selectedEvent}
              open={isDetailDialogOpen}
              onOpenChange={setIsDetailDialogOpen}
            />
          )}
        </>
      )}
    </div>
  );
}
