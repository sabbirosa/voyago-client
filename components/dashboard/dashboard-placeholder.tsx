"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardPlaceholderProps = {
  title?: string;
  description?: string;
  badge?: string;
  content?: string;
  className?: string;
};

export function DashboardPlaceholder({
  title = "Coming soon",
  description,
  badge = "Under development",
  content,
  className,
}: DashboardPlaceholderProps) {
  return (
    <Card className={`@container/card ${className ?? ""}`.trim()}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="flex flex-col gap-2 text-sm">
          {badge ? (
            <Badge variant="outline" className="w-fit">
              {badge}
            </Badge>
          ) : null}
          {description ? (
            <p className="text-muted-foreground">{description}</p>
          ) : null}
          {content ? <p className="text-muted-foreground">{content}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
