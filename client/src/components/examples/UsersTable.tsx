import { UsersTable, User } from "../UsersTable";

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
];

export default function UsersTableExample() {
  return (
    <div className="p-6 bg-background">
      <UsersTable
        users={mockUsers}
        onSendPasswordReset={(user) => console.log("Send password reset to:", user.email)}
      />
    </div>
  );
}
