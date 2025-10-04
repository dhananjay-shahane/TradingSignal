import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  registeredAt: string;
}

interface UsersTableProps {
  users: User[];
  onSendPasswordReset: (user: User) => void;
}

export function UsersTable({ users, onSendPasswordReset }: UsersTableProps) {
  const getRoleBadgeColor = (role: string) => {
    return role === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground";
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "active" ? "bg-chart-2 text-white" : "bg-muted text-muted-foreground";
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                <TableCell className="font-medium">{user.email}</TableCell>
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
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {new Date(user.registeredAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSendPasswordReset(user)}
                    data-testid={`button-reset-password-${user.id}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reset Link
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
