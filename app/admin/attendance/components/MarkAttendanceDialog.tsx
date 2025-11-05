"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Clock,
  Save,
  X,
  Calendar,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  type Employee,
  type AttendanceRecord,
  type AttendanceStatus,
  ATTENDANCE_STATUS_CONFIG,
} from "@/types/attendance";

interface MarkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  selectedDate: Date;
  existingRecord?: AttendanceRecord;
  onUpdate: (employeeId: string, status: AttendanceStatus, data: any) => void;
}

export default function MarkAttendanceDialog({
  open,
  onOpenChange,
  employee,
  selectedDate,
  existingRecord,
  onUpdate,
}: MarkAttendanceDialogProps) {
  const [status, setStatus] = useState<AttendanceStatus>(
    existingRecord?.status || "present"
  );
  const [checkInTime, setCheckInTime] = useState(
    existingRecord?.checkInTime
      ? format(existingRecord.checkInTime, "HH:mm")
      : "09:00"
  );
  const [checkOutTime, setCheckOutTime] = useState(
    existingRecord?.checkOutTime
      ? format(existingRecord.checkOutTime, "HH:mm")
      : ""
  );
  const [notes, setNotes] = useState(existingRecord?.notes || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!employee) return;

    setIsLoading(true);
    try {
      const data: any = {
        status,
        notes: notes.trim(),
        date: selectedDate,
      };

      // Add time fields for present/late status
      if (status === "present" || status === "late") {
        if (checkInTime) {
          const [hours, minutes] = checkInTime.split(":");
          const checkIn = new Date(selectedDate);
          checkIn.setHours(parseInt(hours), parseInt(minutes));
          data.checkInTime = checkIn;
        }

        if (checkOutTime) {
          const [hours, minutes] = checkOutTime.split(":");
          const checkOut = new Date(selectedDate);
          checkOut.setHours(parseInt(hours), parseInt(minutes));
          data.checkOutTime = checkOut;
        }

        // Calculate working hours if both times are provided
        if (data.checkInTime && data.checkOutTime) {
          const diff = data.checkOutTime.getTime() - data.checkInTime.getTime();
          data.workingHours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
        }
      }

      await onUpdate(employee.id, status, data);
      onOpenChange(false);

      // Reset form
      setStatus("present");
      setCheckInTime("09:00");
      setCheckOutTime("");
      setNotes("");
    } catch (error) {
      console.error("Error updating attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form
    setStatus(existingRecord?.status || "present");
    setCheckInTime(
      existingRecord?.checkInTime
        ? format(existingRecord.checkInTime, "HH:mm")
        : "09:00"
    );
    setCheckOutTime(
      existingRecord?.checkOutTime
        ? format(existingRecord.checkOutTime, "HH:mm")
        : ""
    );
    setNotes(existingRecord?.notes || "");
  };

  const statusConfig = ATTENDANCE_STATUS_CONFIG[status];
  const requiresTime = ["present", "late"].includes(status);
  const isEditMode = !!existingRecord;

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {isEditMode ? "Edit" : "Mark"} Attendance
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update" : "Record"} attendance for {employee.name} on{" "}
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback>
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{employee.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{employee.employeeId}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {employee.department}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {employee.position}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label
              htmlFor="status"
              className="flex items-center gap-2 text-base font-medium">
              <User className="h-4 w-4" />
              Attendance Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as AttendanceStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ATTENDANCE_STATUS_CONFIG).map(
                  ([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">{statusConfig.icon}</span>
              <span className="font-medium">{statusConfig.label}</span>
              <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Time Fields (for present/late) */}
          {requiresTime && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-sm font-medium">
                    Check In Time
                  </Label>
                  <Input
                    id="checkin"
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-sm font-medium">
                    Check Out Time
                  </Label>
                  <Input
                    id="checkout"
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {checkInTime && checkOutTime && (
                <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">
                    Working hours:{" "}
                    {(() => {
                      const [inHours, inMinutes] = checkInTime
                        .split(":")
                        .map(Number);
                      const [outHours, outMinutes] = checkOutTime
                        .split(":")
                        .map(Number);
                      const inTime = inHours * 60 + inMinutes;
                      const outTime = outHours * 60 + outMinutes;
                      const diff = outTime - inTime;
                      const hours = Math.floor(diff / 60);
                      const minutes = diff % 60;
                      return `${hours}h ${minutes}m`;
                    })()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Date Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span>
              Recording attendance for{" "}
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}{" "}
            Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
