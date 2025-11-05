"use client";

import { useState } from "react";
import { CalendarIcon, MapPin, Clock, Users, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EVENT_CATEGORIES, type Event } from "@/types/event";
import { eventService } from "@/lib/services/eventService";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  event?: Event;
  onEventCreated?: () => void; // Add callback for refreshing data
}

export default function EventFormDialog({
  open,
  onOpenChange,
  mode,
  event,
  onEventCreated,
}: EventFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>(event?.tags || []);
  const [newTag, setNewTag] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    category: event?.category || "wellness",
    type: event?.type || "single",
    startDate: event?.startDate || new Date(),
    endDate: event?.endDate || new Date(),
    startTime: event?.startTime || "09:00",
    endTime: event?.endTime || "10:00",
    locationType: event?.location?.type || "physical",
    address: event?.location?.address || "",
    city: event?.location?.city || "",
    country: event?.location?.country || "",
    url: event?.location?.url || "",
    capacity: event?.capacity || 20,
    price: event?.price || 0,
    currency: event?.currency || "USD",
    status: event?.status || "draft",
    featured: event?.featured || false,
    image: event?.image || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        type: formData.type as any,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: {
          type: formData.locationType as any,
          ...(formData.locationType === "physical" ||
          formData.locationType === "hybrid"
            ? {
                address: formData.address,
                city: formData.city,
                country: formData.country,
              }
            : {}),
          ...(formData.locationType === "online" ||
          formData.locationType === "hybrid"
            ? {
                url: formData.url,
              }
            : {}),
        },
        capacity: formData.capacity,
        price: formData.price,
        currency: formData.currency,
        status: formData.status as any,
        featured: formData.featured,
        tags,
        createdBy: "admin",
        ...(formData.image ? { image: formData.image } : {}),
      };

      console.log("Creating event with data:", eventData);

      if (mode === "create") {
        await eventService.createEvent(eventData, "admin");
        console.log("Event created successfully!");

        // Call the callback to refresh the events list
        if (onEventCreated) {
          onEventCreated();
        }
      } else {
        // TODO: Implement edit functionality
        await eventService.updateEvent(event!.id, eventData);
        console.log("Event updated successfully!");

        if (onEventCreated) {
          onEventCreated();
        }
      }

      onOpenChange(false);

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "wellness",
        type: "single",
        startDate: new Date(),
        endDate: new Date(),
        startTime: "09:00",
        endTime: "10:00",
        locationType: "physical",
        address: "",
        city: "",
        country: "",
        url: "",
        capacity: 20,
        price: 0,
        currency: "USD",
        status: "draft",
        featured: false,
        image: "",
      });
      setTags([]);
    } catch (error) {
      console.error("Error submitting event:", error);
      alert(
        `Error ${mode === "create" ? "creating" : "updating"} event: ${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <CalendarIcon className="h-7 w-7 text-blue-600" />
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {mode === "create"
              ? "Fill out the form below to create a new event."
              : "Update the event details below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12 mb-8">
              <TabsTrigger value="basic" className="text-sm font-medium py-2">
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="text-sm font-medium py-2">
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className="text-sm font-medium py-2">
                Location
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="text-sm font-medium py-2">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">
                    Event Details
                  </CardTitle>
                  <CardDescription className="text-base">
                    Basic information about your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-medium">
                      Event Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a compelling event title"
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-base font-medium">
                      Event Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your event, including what attendees can expect..."
                      className="min-h-[120px] text-base resize-none"
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData("description", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          updateFormData("category", value)
                        }>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}>
                              <div className="flex items-center gap-2">
                                {/* <span>{category.icon}</span> */}
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          updateFormData("type", value)
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single Event</SelectItem>
                          <SelectItem value="recurring">
                            Recurring Event
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Schedule Details
                  </CardTitle>
                  <CardDescription>
                    Set the date and time for your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !formData.startDate && "text-muted-foreground"
                            )}>
                            {formData.startDate ? (
                              format(formData.startDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) =>
                              date && updateFormData("startDate", date)
                            }
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !formData.endDate && "text-muted-foreground"
                            )}>
                            {formData.endDate ? (
                              format(formData.endDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) =>
                              date && updateFormData("endDate", date)
                            }
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          updateFormData("startTime", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          updateFormData("endTime", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                  <CardDescription>
                    Specify where your event will take place
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Location Type</Label>
                    <Select
                      value={formData.locationType}
                      onValueChange={(value) =>
                        updateFormData("locationType", value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="physical">
                          Physical Location
                        </SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.locationType === "physical" ||
                    formData.locationType === "hybrid") && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter full address"
                          value={formData.address}
                          onChange={(e) =>
                            updateFormData("address", e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) =>
                              updateFormData("city", e.target.value)
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={(e) =>
                              updateFormData("country", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {(formData.locationType === "online" ||
                    formData.locationType === "hybrid") && (
                    <div className="space-y-2">
                      <Label htmlFor="url">Meeting URL</Label>
                      <Input
                        id="url"
                        placeholder="https://..."
                        value={formData.url}
                        onChange={(e) => updateFormData("url", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Zoom, Google Meet, or other video conferencing link
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Event Settings
                  </CardTitle>
                  <CardDescription>
                    Configure capacity, pricing, and visibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        placeholder="Maximum attendees"
                        value={formData.capacity}
                        onChange={(e) =>
                          updateFormData(
                            "capacity",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          updateFormData("status", value)
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          updateFormData(
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) =>
                          updateFormData("currency", value)
                        }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Cover Image URL</Label>
                    <Input
                      id="image"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => updateFormData("image", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional: Add a cover image for your event
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        updateFormData("featured", checked)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="featured">Featured Event</Label>
                      <p className="text-sm text-muted-foreground">
                        Feature this event prominently on the calendar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Event"
                : "Update Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
