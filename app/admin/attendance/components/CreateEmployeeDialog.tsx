"use client";

import { useState } from "react";
import { Users, Plus, User } from "lucide-react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { employeeService } from "@/lib/services/attendanceService";
import type { Employee } from "@/types/attendance";

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeCreated?: () => void;
}

const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Customer Support",
  "Product",
  "Design",
];

export default function CreateEmployeeDialog({
  open,
  onOpenChange,
  onEmployeeCreated,
}: CreateEmployeeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employeeId: "",
    joinDate: new Date(),
    avatar: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateEmployeeId = () => {
    const prefix = formData.department
      ? formData.department.substring(0, 3).toUpperCase()
      : "EMP";
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Starting employee creation...");
      console.log("Form data:", formData);

      const employeeData: Omit<Employee, "id"> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        department: formData.department,
        position: formData.position,
        employeeId: formData.employeeId || generateEmployeeId(),
        joinDate: formData.joinDate,
        isActive: true,
        avatar: formData.avatar || undefined,
      };

      console.log("Creating employee with data:", employeeData);

      const employeeId = await employeeService.create(employeeData);
      console.log("Employee created successfully with ID:", employeeId);

      // Call the callback to refresh the employees list
      if (onEmployeeCreated) {
        console.log("Calling onEmployeeCreated callback");
        onEmployeeCreated();
      }

      onOpenChange(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        employeeId: "",
        joinDate: new Date(),
        avatar: "",
      });

      alert("Employee created successfully!");
    } catch (error) {
      console.error("Error creating employee:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`Error creating employee: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            Create New Employee
          </DialogTitle>
          <DialogDescription>
            Add a new employee to the attendance system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="employee@company.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1-555-0123"
                value={formData.phone}
                onChange={(e) => updateFormData("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Auto-generated if empty"
                value={formData.employeeId}
                onChange={(e) => updateFormData("employeeId", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate based on department
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => updateFormData("department", value)}
                required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                placeholder="Job title"
                value={formData.position}
                onChange={(e) => updateFormData("position", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Join Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !formData.joinDate && "text-muted-foreground"
                    )}>
                    {formData.joinDate ? (
                      format(formData.joinDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.joinDate}
                    onSelect={(date) =>
                      date && updateFormData("joinDate", date)
                    }
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={(e) => updateFormData("avatar", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Optional: URL to profile picture
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
