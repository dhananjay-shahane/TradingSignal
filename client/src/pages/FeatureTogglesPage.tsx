import { FeatureToggles } from "@/components/FeatureToggles";

export default function FeatureTogglesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feature Toggles</h1>
        <p className="text-sm text-muted-foreground">
          Manage global features and user-specific permissions
        </p>
      </div>

      <FeatureToggles />
    </div>
  );
}
