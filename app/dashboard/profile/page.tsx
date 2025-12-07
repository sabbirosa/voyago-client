"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { useSkeleton } from "@/components/dashboard/SkeletonContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyProfile, type UserProfile } from "@/lib/api/user";
import { useAuth } from "@/lib/auth/useAuth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GuideOnboardingWizard } from "./_components/GuideOnboardingWizard";
import { GuideProfileForm } from "./_components/GuideProfileForm";
import { ProfileForm } from "./_components/ProfileForm";
import { ProfilePageSkeleton } from "./_components/ProfilePageSkeleton";
import { SettingsForm } from "./_components/SettingsForm";

export default function ProfilePage() {
  const { user } = useAuth();
  const { setSkeleton } = useSkeleton();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Register skeleton for this page
  useEffect(() => {
    setSkeleton(<ProfilePageSkeleton />);
    return () => setSkeleton(null);
  }, [setSkeleton]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getMyProfile();
        setProfile(data);
        // If user is a guide and doesn't have a guide profile, show onboarding
        if (data.role === "GUIDE" && !data.guideProfile) {
          setActiveTab("guide-onboarding");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message || "Failed to load profile"
            : "Failed to load profile";
        // Only show error if it's not a 401/403 (authentication errors)
        if (
          error instanceof Error &&
          !error.message.includes("Not authenticated") &&
          !error.message.includes("401") &&
          !error.message.includes("403")
        ) {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };

  const isGuide = profile?.role === "GUIDE";
  const hasGuideProfile = !!profile?.guideProfile;

  // Update active tab when guide profile is created
  useEffect(() => {
    if (isGuide && hasGuideProfile && activeTab === "guide-onboarding") {
      setActiveTab("guide-profile");
    }
  }, [isGuide, hasGuideProfile, activeTab]);

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your profile information and preferences"
      />

      {/* Profile Header Card */}
      <Card className="mb-6 border-0 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="size-20 shrink-0">
              <AvatarImage
                src={profile?.profile?.avatarUrl || undefined}
                alt={profile?.name}
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {profile?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-semibold truncate">
                {profile?.name}
              </h2>
              <p className="text-muted-foreground truncate">
                {profile?.email}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {profile?.role}
                </span>
                {isGuide &&
                  hasGuideProfile &&
                  profile.guideProfile && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        profile.guideProfile.verificationStatus === "VERIFIED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : profile.guideProfile.verificationStatus ===
                              "REJECTED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {profile.guideProfile.verificationStatus}
                    </span>
                  )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different profile sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className={
            isGuide ? "grid w-full grid-cols-3" : "grid w-full grid-cols-2"
          }
        >
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isGuide && (
            <>
              {hasGuideProfile ? (
                <TabsTrigger value="guide-profile">Guide Profile</TabsTrigger>
              ) : (
                <TabsTrigger value="guide-onboarding">Become a Guide</TabsTrigger>
              )}
            </>
          )}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialData={profile?.profile || null}
                userName={profile?.name || ""}
                onSuccess={handleProfileUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {isGuide && hasGuideProfile && (
          <TabsContent value="guide-profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide Profile</CardTitle>
                <CardDescription>
                  Manage your guide expertise, rates, and experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GuideProfileForm
                  initialData={profile.guideProfile}
                  onSuccess={handleProfileUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isGuide && !hasGuideProfile && (
          <TabsContent value="guide-onboarding" className="mt-6">
            <GuideOnboardingWizard
              onComplete={async () => {
                try {
                  // Refresh profile to get the newly created guide profile
                  const updatedProfile = await getMyProfile();
                  setProfile(updatedProfile);
                  // Switch to guide profile tab after state update
                  // Use a small delay to ensure state has updated
                  setTimeout(() => {
                    setActiveTab("guide-profile");
                  }, 200);
                } catch (error) {
                  console.error("Failed to refresh profile:", error);
                  toast.error(
                    "Profile created but failed to refresh. Please reload the page."
                  );
                }
              }}
            />
          </TabsContent>
        )}

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information, password, and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm
                initialData={{
                  email: profile?.email || "",
                }}
                onSuccess={handleProfileUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
