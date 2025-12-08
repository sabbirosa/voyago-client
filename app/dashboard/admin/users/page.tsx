"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi, AdminUser } from "@/lib/api/admin";
import { DataTableCommon } from "@/components/common/data-table";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, CheckCircle, XCircle, Shield, User as UserIcon, UserCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    role: "all",
    isBanned: "all",
    isApproved: "all",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    isBanned: false,
    isApproved: true,
    role: "TOURIST" as "TOURIST" | "GUIDE" | "ADMIN",
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search !== searchInput) {
          setPage(1); // Reset to first page when search changes
        }
        return { ...prev, search: searchInput };
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (filters.role && filters.role !== "all") params.role = filters.role;
      if (filters.isBanned !== "all") params.isBanned = filters.isBanned === "true";
      if (filters.isApproved !== "all") params.isApproved = filters.isApproved === "true";
      if (filters.search) params.search = filters.search;

      const response = await adminApi.getUsers(params);
      setUsers(response.data.users || []);
      setTotal(response.meta?.total || 0);
    } catch (error: any) {
      console.error("Failed to load users:", error);
      const errorMessage = error?.message || "Failed to load users";
      toast.error(errorMessage);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setUpdateData({
      isBanned: user.isBanned,
      isApproved: user.isApproved,
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      await adminApi.updateUser(selectedUser.id, updateData);
      toast.success("User updated successfully");
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        const roleColors: Record<string, string> = {
          ADMIN: "bg-purple-500",
          GUIDE: "bg-blue-500",
          TOURIST: "bg-green-500",
        };
        return (
          <Badge className={roleColors[role] || "bg-gray-500"}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isApproved",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            {user.isApproved ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approved
              </Badge>
            ) : (
              <Badge variant="secondary">
                <XCircle className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
            {user.isBanned && (
              <Badge variant="destructive">
                <Ban className="h-3 w-3 mr-1" />
                Banned
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(row.original)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <PageHeader
        title="User Management"
        description="Manage users, roles, and account status"
      />

      <div className="flex-1 flex flex-col min-h-0">
        <DataTableCommon
        columns={columns}
        data={users}
        isLoading={loading}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        onPageSizeChange={() => {}}
        search={searchInput}
        onSearchChange={setSearchInput}
        filters={
          <div className="flex items-center gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Select
                value={filters.role}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters({ ...filters, role: value });
                }}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="TOURIST">Tourist</SelectItem>
                  <SelectItem value="GUIDE">Guide</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={filters.isBanned}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters({ ...filters, isBanned: value });
                }}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="false">Active</SelectItem>
                  <SelectItem value="true">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(filters.role !== "all" || filters.isBanned !== "all" || searchInput) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ role: "all", isBanned: "all", isApproved: "all", search: "" });
                  setSearchInput("");
                  setPage(1);
                }}
                className="h-9"
              >
                Clear Filters
              </Button>
            )}
          </div>
        }
      />
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user permissions and status
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">{selectedUser.name}</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isBanned">Banned</Label>
                <Switch
                  id="isBanned"
                  checked={updateData.isBanned}
                  onCheckedChange={(checked) =>
                    setUpdateData({ ...updateData, isBanned: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isApproved">Approved</Label>
                <Switch
                  id="isApproved"
                  checked={updateData.isApproved}
                  onCheckedChange={(checked) =>
                    setUpdateData({ ...updateData, isApproved: checked })
                  }
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={updateData.role}
                  onValueChange={(value: "TOURIST" | "GUIDE" | "ADMIN") =>
                    setUpdateData({ ...updateData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TOURIST">Tourist</SelectItem>
                    <SelectItem value="GUIDE">Guide</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

