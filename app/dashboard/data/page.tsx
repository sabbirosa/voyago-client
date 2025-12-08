"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Database, 
  FileText, 
  Image, 
  Video, 
  File, 
  Upload,
  Search,
  Download,
  Trash2,
  Eye
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataItem {
  id: string;
  name: string;
  type: "document" | "image" | "video" | "other";
  size: string;
  uploadedAt: string;
  url: string;
}

export default function DataPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataItems, setDataItems] = useState<DataItem[]>([]);

  // Mock data - in real app, this would come from API
  const mockData: DataItem[] = [
    {
      id: "1",
      name: "Tour Information Guide.pdf",
      type: "document",
      size: "2.4 MB",
      uploadedAt: "2024-01-15",
      url: "#",
    },
    {
      id: "2",
      name: "City Map.jpg",
      type: "image",
      size: "1.8 MB",
      uploadedAt: "2024-01-14",
      url: "#",
    },
    {
      id: "3",
      name: "Tour Video Introduction.mp4",
      type: "video",
      size: "45.2 MB",
      uploadedAt: "2024-01-13",
      url: "#",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5" />;
      case "image":
        return <Image className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-700";
      case "image":
        return "bg-green-100 text-green-700";
      case "video":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredData = mockData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Library"
        description="Manage your tour data, resources, and content library"
      />

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Resource
          </CardTitle>
          <CardDescription>
            Add documents, images, videos, and other resources to your library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              className="flex-1"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
            />
            <Button onClick={() => toast.info("Upload functionality coming soon")}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Your Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No resources found</p>
              <p className="text-sm mt-2">
                {searchQuery ? "Try a different search term" : "Upload your first resource to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <Badge variant="outline" className={getTypeColor(item.type)}>
                              {item.type}
                            </Badge>
                            <span>{item.size}</span>
                            <span>Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Preview coming soon")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Download coming soon")}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toast.info("Delete functionality coming soon")}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used</span>
              <span>49.4 MB / 5 GB</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "0.99%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Upgrade to get more storage space
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
