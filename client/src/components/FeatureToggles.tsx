import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

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
];

const mockUserPermissions: UserPermission[] = [
  {
    userId: "1",
    userEmail: "trader1@example.com",
    features: {
      dashboard: true,
      signals: true,
      users: false,
      history: true,
      features: false,
    },
  },
  {
    userId: "2",
    userEmail: "trader2@example.com",
    features: {
      dashboard: true,
      signals: true,
      users: false,
      history: false,
      features: false,
    },
  },
  {
    userId: "3",
    userEmail: "trader3@example.com",
    features: {
      dashboard: true,
      signals: false,
      users: false,
      history: true,
      features: false,
    },
  },
];

export function FeatureToggles() {
  const [globalFeatures, setGlobalFeatures] = useState(features);
  const [userPermissions, setUserPermissions] = useState(mockUserPermissions);

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
          <div className="space-y-6">
            {userPermissions.map((userPerm, index) => (
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
                {index < userPermissions.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
