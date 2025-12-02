"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api/client";
import { getTokens } from "@/lib/auth/tokenStorage";
import {
  changePasswordSchema,
  updateAccountSchema,
  type ChangePasswordFormData,
  type UpdateAccountFormData,
} from "@/lib/validation/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SettingsFormProps {
  initialData?: {
    email: string;
  };
  onSuccess?: () => void;
}

function getAuthHeaders(): HeadersInit {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error("Not authenticated");
  }
  return {
    Authorization: `Bearer ${tokens.accessToken}`,
  };
}

export function SettingsForm({ initialData, onSuccess }: SettingsFormProps) {
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const accountForm = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      email: initialData?.email || "",
    },
  });

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    setIsLoadingPassword(true);
    try {
      await apiFetch<{ success: boolean; message: string }>(
        "/users/me/change-password",
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        }
      );
      toast.success("Password changed successfully");
      passwordForm.reset();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to change password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const onSubmitAccount = async (data: UpdateAccountFormData) => {
    // Email is disabled, so this form shouldn't submit
    // But keeping the function for future use if needed
    setIsLoadingAccount(true);
    try {
      // Email cannot be changed, so we don't send any update
      toast.info("Email cannot be changed");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update account information. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoadingAccount(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiFetch<{ success: boolean; message: string }>("/users/me", {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      toast.success("Account deleted successfully");
      // Redirect to home page after deletion
      window.location.href = "/";
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete account. Please try again.";
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <Form {...accountForm}>
          <form
            onSubmit={accountForm.handleSubmit(onSubmitAccount)}
            className="space-y-4"
          >
            <FormField
              control={accountForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      disabled={true}
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed. Contact support if you need to
                    update your email.
                  </p>
                </FormItem>
              )}
            />

            {/* Remove save button since email cannot be changed */}
          </form>
        </Form>
      </div>

      <Separator />

      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="space-y-4"
          >
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter current password"
                      {...field}
                      disabled={isLoadingPassword}
                      showStrengthIndicator={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter new password"
                      {...field}
                      disabled={isLoadingPassword}
                      showStrengthIndicator={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm new password"
                      {...field}
                      disabled={isLoadingPassword}
                      showStrengthIndicator={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoadingPassword}>
                {isLoadingPassword ? (
                  <>
                    <Spinner className="mr-2" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Danger Zone */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-destructive">
          Danger Zone
        </h3>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all associated data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Spinner className="mr-2" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
