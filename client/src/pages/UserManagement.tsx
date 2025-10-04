import { UsersTable, User } from "@/components/UsersTable";
import { useToast } from "@/hooks/use-toast";

const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@tradingsignals.com",
    role: "admin",
    status: "active",
    registeredAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    email: "trader1@example.com",
    role: "user",
    status: "active",
    registeredAt: "2025-01-02T14:30:00Z",
  },
  {
    id: "3",
    email: "trader2@example.com",
    role: "user",
    status: "inactive",
    registeredAt: "2025-01-01T09:15:00Z",
  },
  {
    id: "4",
    email: "trader3@example.com",
    role: "user",
    status: "active",
    registeredAt: "2024-12-28T11:45:00Z",
  },
  {
    id: "5",
    email: "trader4@example.com",
    role: "user",
    status: "active",
    registeredAt: "2025-01-03T08:20:00Z",
  },
];

export default function UserManagement() {
  const { toast } = useToast();

  const handleSendPasswordReset = (user: User) => {
    console.log("Sending password reset email to:", user.email);
    toast({
      title: "Reset link sent",
      description: `Password reset link has been sent to ${user.email}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View users and send password reset links
        </p>
      </div>

      <UsersTable users={mockUsers} onSendPasswordReset={handleSendPasswordReset} />
    </div>
  );
}
