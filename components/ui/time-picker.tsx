"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  time?: string;
  onTimeChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  time,
  onTimeChange,
  placeholder = "Select time",
  disabled = false,
  className,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Generate time options in 15-minute intervals
  const timeOptions = React.useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeValue = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = formatTime(timeValue);
        options.push({ value: timeValue, label: displayTime });
      }
    }
    return options;
  }, []);

  const formatTime = (timeValue: string) => {
    const [hour, minute] = timeValue.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const selectedTimeLabel = time ? formatTime(time) : placeholder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground",
            className
          )}>
          <Clock className="mr-2 h-4 w-4" />
          {selectedTimeLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <ScrollArea className="h-60">
          <div className="p-2">
            {timeOptions.map((option) => (
              <Button
                key={option.value}
                variant={time === option.value ? "secondary" : "ghost"}
                className="w-full justify-start text-sm h-8 px-2 py-1 mb-1"
                onClick={() => {
                  onTimeChange(option.value);
                  setIsOpen(false);
                }}>
                {option.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
