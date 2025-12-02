"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Spinner } from "./spinner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:bg-emerald-50 dark:group-[.toaster]:bg-emerald-950/20 group-[.toaster]:border-emerald-200 dark:group-[.toaster]:border-emerald-800 group-[.toaster]:text-emerald-900 dark:group-[.toaster]:text-emerald-100",
          error:
            "group-[.toaster]:bg-red-50 dark:group-[.toaster]:bg-red-950/20 group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-800 group-[.toaster]:text-red-900 dark:group-[.toaster]:text-red-100",
          warning:
            "group-[.toaster]:bg-amber-50 dark:group-[.toaster]:bg-amber-950/20 group-[.toaster]:border-amber-200 dark:group-[.toaster]:border-amber-800 group-[.toaster]:text-amber-900 dark:group-[.toaster]:text-amber-100",
          info: "group-[.toaster]:bg-blue-50 dark:group-[.toaster]:bg-blue-950/20 group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800 group-[.toaster]:text-blue-900 dark:group-[.toaster]:text-blue-100",
          loading:
            "group-[.toaster]:bg-primary/10 dark:group-[.toaster]:bg-primary/20 group-[.toaster]:border-primary/20 dark:group-[.toaster]:border-primary/30 group-[.toaster]:text-primary",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />,
        info: <InfoIcon className="size-4 text-blue-600 dark:text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-red-600 dark:text-red-400" />,
        loading: <Spinner className="size-4" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
