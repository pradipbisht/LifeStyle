"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  MapPin,
  Clock,
  Users,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EVENT_CATEGORIES,
  EVENT_STATUS_OPTIONS,
  type CalendarEvent,
  type EventCategory,
} from "@/types/event";

interface EventListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function EventList({ events, onEventClick }: EventListProps) {
  const getCategoryColor = (category: EventCategory) => {
    const categoryConfig = EVENT_CATEGORIES.find((c) => c.value === category);
    return categoryConfig?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const statusConfig = EVENT_STATUS_OPTIONS.find((s) => s.value === status);
    return statusConfig?.color || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getLocationDisplay = (location: CalendarEvent["location"]) => {
    if (location.type === "online") {
      return "Online";
    } else if (location.type === "physical") {
      return location.address || "Physical Location";
    } else {
      return "Hybrid";
    }
  };

  const handleAction = (
    action: string,
    event: CalendarEvent,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    switch (action) {
      case "view":
        onEventClick(event);
        break;
      case "edit":
        // TODO: Implement edit functionality
        console.log("Edit event:", event.id);
        break;
      case "duplicate":
        // TODO: Implement duplicate functionality
        console.log("Duplicate event:", event.id);
        break;
      case "delete":
        // TODO: Implement delete functionality
        console.log("Delete event:", event.id);
        break;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          Events List
        </CardTitle>
        <CardDescription className="text-base">
          Manage all your events in a detailed table view
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-3">No events found</h3>
            <p className="text-muted-foreground text-base mb-6">
              Create your first event or adjust your filters
            </p>
            <Button size="lg">Create Event</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground">
                    Event
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Date & Time
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Location
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Registrations
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">
                    Attendance
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow
                    key={event.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors h-20"
                    onClick={() => onEventClick(event)}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="shrink-0">
                          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                            <CalendarIcon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-base text-foreground leading-tight">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {event.featured && (
                              <Badge
                                variant="secondary"
                                className="text-xs font-medium">
                                ⭐ Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="text-sm space-y-1">
                        <p className="font-medium text-foreground">
                          {formatDate(event.date)}
                        </p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {getLocationDisplay(event.location)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`${getCategoryColor(
                          event.category
                        )} font-medium`}>
                        {
                          EVENT_CATEGORIES.find(
                            (c) => c.value === event.category
                          )?.label
                        }
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(
                          event.status
                        )} font-medium`}>
                        {
                          EVENT_STATUS_OPTIONS.find(
                            (s) => s.value === event.status
                          )?.label
                        }
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="font-semibold">
                            {event.registered}
                          </span>
                          <span className="text-muted-foreground">
                            / {event.capacity}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(
                            (event.registered / event.capacity) * 100
                          )}
                          % capacity
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-green-600">
                            {event.attended}
                          </span>
                          <span className="text-muted-foreground">
                            / {event.registered}
                          </span>
                        </div>
                        {event.registered > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {Math.round(
                              (event.attended / event.registered) * 100
                            )}
                            % attended
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-9 w-9 p-0 hover:bg-muted"
                            onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={(e) => handleAction("view", event, e)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleAction("edit", event, e)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) =>
                              handleAction("duplicate", event, e)
                            }>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => handleAction("delete", event, e)}
                            className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
