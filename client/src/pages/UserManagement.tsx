import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, ArrowUpDown, Search, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  emailNotifications: boolean;
  scheduleEmailTime: string;
  registeredAt: string;
}

const initialUsers: User[] = [
  {
    id: "USR001",
    email: "admin@tradingsignals.com",
    password: "Admin@123",
    role: "admin",
    status: "active",
    emailNotifications: true,
    scheduleEmailTime: "09:00",
    registeredAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "USR002",
    email: "trader1@example.com",
    password: "Trader1Pass",
    role: "user",
    status: "active",
    emailNotifications: true,
    scheduleEmailTime: "10:30",
    registeredAt: "2025-01-02T14:30:00Z",
  },
  {
    id: "USR003",
    email: "trader2@example.com",
    password: "Secure2024",
    role: "user",
    status: "inactive",
    emailNotifications: false,
    scheduleEmailTime: "08:00",
    registeredAt: "2025-01-01T09:15:00Z",
  },
  {
    id: "USR004",
    email: "trader3@example.com",
    password: "MyPass123",
    role: "user",
    status: "active",
    emailNotifications: true,
    scheduleEmailTime: "14:00",
    registeredAt: "2024-12-28T11:45:00Z",
  },
  {
    id: "USR005",
    email: "trader4@example.com",
    password: "Test@Pass",
    role: "user",
    status: "active",
    emailNotifications: false,
    scheduleEmailTime: "11:00",
    registeredAt: "2025-01-03T08:20:00Z",
  },
];

type SortField = "id" | "email" | "role" | "status" | "registeredAt";

export default function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("registeredAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSendPasswordReset = (user: User) => {
    console.log("Sending password reset email to:", user.email);
    toast({
      title: "Reset link sent",
      description: `Password reset link has been sent to ${user.email}`,
    });
  };

  const handleToggleNotifications = (userId: string, enabled: boolean) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, emailNotifications: enabled } : u
    ));
    console.log(`Email notifications ${enabled ? 'enabled' : 'disabled'} for user ${userId}`);
  };

  const handleUpdateScheduleTime = (userId: string, time: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, scheduleEmailTime: time } : u
    ));
    console.log(`Schedule time updated to ${time} for user ${userId}`);
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: isActive ? "active" : "inactive" } : u
    ));
    toast({
      title: `User ${isActive ? 'activated' : 'deactivated'}`,
      description: `User status has been updated successfully`,
    });
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch = 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      return aValue > bValue ? modifier : -modifier;
    });

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const clampedPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (clampedPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  if (currentPage !== clampedPage && totalPages > 0) {
    setCurrentPage(clampedPage);
  }

  const getRoleBadgeColor = (role: string) => {
    return role === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground";
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "active" ? "bg-chart-2 text-white" : "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage users, permissions, and notification settings
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-full md:w-40" data-testid="select-role-filter">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full md:w-40" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("id")}
                  className="h-8 px-2"
                  data-testid="sort-id"
                >
                  User ID
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("email")}
                  className="h-8 px-2"
                  data-testid="sort-email"
                >
                  Email
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="whitespace-nowrap">Password</TableHead>
              <TableHead className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("role")}
                  className="h-8 px-2"
                  data-testid="sort-role"
                >
                  Role
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-8 px-2"
                  data-testid="sort-status"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="whitespace-nowrap">Active/Inactive</TableHead>
              <TableHead className="whitespace-nowrap">Email Notifications</TableHead>
              <TableHead className="whitespace-nowrap">Schedule Time</TableHead>
              <TableHead className="whitespace-nowrap">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("registeredAt")}
                  className="h-8 px-2"
                  data-testid="sort-registered"
                >
                  Registered
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                  <TableCell className="font-medium font-mono text-sm">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {visiblePasswords.has(user.id) ? user.password : "••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePasswordVisibility(user.id)}
                        data-testid={`button-toggle-password-${user.id}`}
                      >
                        {visiblePasswords.has(user.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.status === "active"}
                      onCheckedChange={(checked) => handleToggleUserStatus(user.id, checked)}
                      data-testid={`switch-user-status-${user.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.emailNotifications}
                      onCheckedChange={(checked) => handleToggleNotifications(user.id, checked)}
                      data-testid={`switch-notifications-${user.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={user.scheduleEmailTime}
                      onChange={(e) => handleUpdateScheduleTime(user.id, e.target.value)}
                      className="w-28 md:w-32"
                      data-testid={`input-schedule-${user.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(user.registeredAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendPasswordReset(user)}
                      data-testid={`button-reset-password-${user.id}`}
                      className="whitespace-nowrap"
                    >
                      <Mail className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Send Reset Link</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                data-testid="pagination-prev"
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                  data-testid={`pagination-page-${i + 1}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                data-testid="pagination-next"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
