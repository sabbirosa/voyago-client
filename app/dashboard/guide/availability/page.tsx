"use client";

import { useEffect, useState } from "react";
import { availabilityApi, AvailabilitySlot } from "@/lib/api/availability";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableCommon } from "@/components/common/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AvailabilitySlotForm } from "./_components/AvailabilitySlotForm";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await availabilityApi.getSlots({ isActive: true });
      setSlots(response.data.slots);
    } catch (error) {
      toast.error("Failed to load availability slots");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this availability slot?")) {
      return;
    }

    try {
      await availabilityApi.deleteSlot(id);
      toast.success("Availability slot deleted");
      fetchSlots();
    } catch (error) {
      toast.error("Failed to delete availability slot");
    }
  };

  const handleEdit = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingSlot(null);
    setDialogOpen(true);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    setEditingSlot(null);
    fetchSlots();
  };

  const columns: ColumnDef<AvailabilitySlot>[] = [
    {
      accessorKey: "isRecurring",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={row.original.isRecurring ? "default" : "secondary"}>
          {row.original.isRecurring ? "Recurring" : "One-time"}
        </Badge>
      ),
    },
    {
      accessorKey: "dayOfWeek",
      header: "Day/Date",
      cell: ({ row }) => {
        const slot = row.original;
        if (slot.isRecurring && slot.dayOfWeek !== null) {
          return dayNames[slot.dayOfWeek];
        }
        if (slot.date) {
          return new Date(slot.date).toLocaleDateString();
        }
        return "-";
      },
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
    },
    {
      accessorKey: "endTime",
      header: "End Time",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const slot = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(slot)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(slot.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Availability Calendar"
          description="Manage your available time slots for tours"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSlot ? "Edit Availability Slot" : "Add Availability Slot"}
              </DialogTitle>
              <DialogDescription>
                {editingSlot
                  ? "Update your availability slot"
                  : "Set when you're available for tours"}
              </DialogDescription>
            </DialogHeader>
            <AvailabilitySlotForm
              slot={editingSlot}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Availability Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTableCommon
            columns={columns}
            data={slots}
            isLoading={loading}
            total={slots.length}
            page={1}
            pageSize={10}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
}

