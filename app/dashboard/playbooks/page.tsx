"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  FileText
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Playbook {
  id: string;
  title: string;
  description: string;
  tourType: string;
  steps: string[];
  createdAt: string;
  updatedAt: string;
}

export default function PlaybooksPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tourType: "",
    steps: "",
  });

  // Mock data - in real app, this would come from API
  const mockPlaybooks: Playbook[] = [
    {
      id: "1",
      title: "City Walking Tour Playbook",
      description: "Standard playbook for city walking tours",
      tourType: "Walking Tour",
      steps: [
        "Meet at designated location",
        "Introduction and safety briefing",
        "Walk through historic district",
        "Visit key landmarks",
        "Photo opportunities",
        "Q&A session",
        "Return to meeting point",
      ],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Food Tour Playbook",
      description: "Playbook for culinary tours",
      tourType: "Food Tour",
      steps: [
        "Meet at first restaurant",
        "Introduction to local cuisine",
        "Visit 3-4 food stops",
        "Tasting at each location",
        "Cultural context sharing",
        "Final dessert stop",
        "Farewell and recommendations",
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-12",
    },
  ];

  const filteredPlaybooks = mockPlaybooks.filter((playbook) =>
    playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playbook.tourType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingPlaybook(null);
    setFormData({
      title: "",
      description: "",
      tourType: "",
      steps: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (playbook: Playbook) => {
    setEditingPlaybook(playbook);
    setFormData({
      title: playbook.title,
      description: playbook.description,
      tourType: playbook.tourType,
      steps: playbook.steps.join("\n"),
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.tourType) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success(editingPlaybook ? "Playbook updated" : "Playbook created");
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast.success("Playbook deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Tour Playbooks"
          description="Create and manage playbooks for your tours to ensure consistent experiences"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Playbook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlaybook ? "Edit Playbook" : "Create New Playbook"}
              </DialogTitle>
              <DialogDescription>
                Define the steps and structure for your tour playbook
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., City Walking Tour Playbook"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tour Type *</label>
                <Input
                  value={formData.tourType}
                  onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                  placeholder="e.g., Walking Tour, Food Tour"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this playbook"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Steps (one per line) *</label>
                <Textarea
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  placeholder="Step 1&#10;Step 2&#10;Step 3..."
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Playbook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Playbooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : filteredPlaybooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No playbooks found</p>
              <p className="text-sm mt-2">
                {searchQuery ? "Try a different search term" : "Create your first playbook to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlaybooks.map((playbook) => (
                <Card key={playbook.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{playbook.title}</CardTitle>
                          <Badge variant="secondary">{playbook.tourType}</Badge>
                        </div>
                        <CardDescription>{playbook.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info("View coming soon")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(playbook)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(playbook.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium mb-2">Steps:</div>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        {playbook.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      Updated: {new Date(playbook.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
