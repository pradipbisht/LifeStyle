"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Edit, Trash, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { employeeService } from "@/lib/services/attendanceService";
import CreateEmployeeDialog from "./CreateEmployeeDialog";
import type { Employee } from "@/types/attendance";

interface ManageEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeesUpdated?: () => void;
}

export default function ManageEmployeesDialog({
  open,
  onOpenChange,
  onEmployeesUpdated,
}: ManageEmployeesDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const employeesData = await employeeService.getAll();
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadEmployees();
    }
  }, [open]);

  const handleEmployeeCreated = () => {
    loadEmployees();
    if (onEmployeesUpdated) {
      onEmployeesUpdated();
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeService.delete(employeeId);
        loadEmployees();
        if (onEmployeesUpdated) {
          onEmployeesUpdated();
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Error deleting employee: " + error);
      }
    }
  };

  const toggleEmployeeStatus = async (employee: Employee) => {
    try {
      await employeeService.update(employee.id, {
        isActive: !employee.isActive,
      });
      loadEmployees();
      if (onEmployeesUpdated) {
        onEmployeesUpdated();
      }
    } catch (error) {
      console.error("Error updating employee status:", error);
      alert("Error updating employee status: " + error);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              Manage Employees
            </DialogTitle>
            <DialogDescription>
              Add, edit, or remove employees from the attendance system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>

            {/* Employee List */}
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading employees...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            {searchTerm
                              ? "No employees found matching your search."
                              : "No employees added yet. Create your first employee!"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={employee.avatar} />
                                  <AvatarFallback>
                                    {employee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{employee.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {employee.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {employee.employeeId}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  employee.isActive ? "default" : "secondary"
                                }
                                className={
                                  employee.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }>
                                {employee.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toggleEmployeeStatus(employee)
                                    }>
                                    {employee.isActive
                                      ? "Deactivate"
                                      : "Activate"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteEmployee(employee.id)
                                    }
                                    className="text-red-600">
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Total: {employees.length} employees (
                {employees.filter((e) => e.isActive).length} active)
              </span>
              <span>Showing: {filteredEmployees.length} employees</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Employee Dialog */}
      <CreateEmployeeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onEmployeeCreated={handleEmployeeCreated}
      />
    </>
  );
}
