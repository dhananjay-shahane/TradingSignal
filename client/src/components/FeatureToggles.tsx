import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Feature {
  id: string;
  name: string;
  enabled: boolean;
}

interface UserPermission {
  userId: string;
  userEmail: string;
  features: Record<string, boolean>;
}

const features: Feature[] = [
  { id: "dashboard", name: "Dashboard", enabled: true },
  { id: "signals", name: "Trading Signals", enabled: true },
  { id: "users", name: "User Management", enabled: true },
  { id: "history", name: "Historical Data", enabled: true },
  { id: "features", name: "Feature Toggles", enabled: true },
  { id: "profile", name: "User Profile", enabled: true },
];

const mockUserPermissions: UserPermission[] = Array.from({ length: 15 }, (_, i) => ({
  userId: String(i + 1),
  userEmail: `trader${i + 1}@example.com`,
  features: {
    dashboard: i < 10,
    signals: i < 12,
    users: i < 3,
    history: i < 8,
    features: i < 2,
    profile: true,
  },
}));

const ITEMS_PER_PAGE = 5;

export function FeatureToggles() {
  const [globalFeatures, setGlobalFeatures] = useState(features);
  const [userPermissions, setUserPermissions] = useState(mockUserPermissions);
  const [searchUserId, setSearchUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleGlobalToggle = (featureId: string, enabled: boolean) => {
    setGlobalFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled } : f))
    );
    console.log(`Global feature ${featureId} set to ${enabled}`);
  };

  const handleUserPermissionToggle = (userId: string, featureId: string, checked: boolean) => {
    setUserPermissions((prev) =>
      prev.map((up) =>
        up.userId === userId
          ? { ...up, features: { ...up.features, [featureId]: checked } }
          : up
      )
    );
    console.log(`User ${userId} permission for ${featureId} set to ${checked}`);
  };

  const filteredUsers = userPermissions.filter((user) =>
    searchUserId === "" || 
    user.userId.includes(searchUserId) || 
    user.userEmail.toLowerCase().includes(searchUserId.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Feature Toggles</CardTitle>
          <CardDescription>
            Enable or disable features for all users at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {globalFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between">
              <Label htmlFor={`global-${feature.id}`} className="text-base">
                {feature.name}
              </Label>
              <Switch
                id={`global-${feature.id}`}
                checked={feature.enabled}
                onCheckedChange={(checked) => handleGlobalToggle(feature.id, checked)}
                data-testid={`switch-global-${feature.id}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User-Specific Permissions</CardTitle>
          <CardDescription>
            Control which features each user can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user ID or email..."
              value={searchUserId}
              onChange={(e) => {
                setSearchUserId(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
              data-testid="input-search-user"
            />
          </div>

          <div className="space-y-6">
            {paginatedUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            ) : (
              paginatedUsers.map((userPerm, index) => (
                <div key={userPerm.userId}>
                  <div className="mb-3">
                    <p className="font-medium">{userPerm.userEmail}</p>
                    <p className="text-sm text-muted-foreground">User ID: {userPerm.userId}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {features.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${userPerm.userId}-${feature.id}`}
                          checked={userPerm.features[feature.id]}
                          onCheckedChange={(checked) =>
                            handleUserPermissionToggle(
                              userPerm.userId,
                              feature.id,
                              checked as boolean
                            )
                          }
                          data-testid={`checkbox-user-${userPerm.userId}-${feature.id}`}
                        />
                        <Label
                          htmlFor={`user-${userPerm.userId}-${feature.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {feature.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {index < paginatedUsers.length - 1 && <Separator className="mt-6" />}
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
