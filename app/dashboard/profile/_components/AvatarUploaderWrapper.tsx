"use client";

import AvatarUploaderWithCropper from "@/components/common/avatar-uploader-with-cropper";
import { useEffect, useRef } from "react";

interface AvatarUploaderWrapperProps {
  initialUrl?: string | null;
  onUrlChange?: (url: string | null) => void;
  onBlobChange?: (blob: Blob | null) => void;
}

/**
 * Wrapper component for AvatarUploaderWithCropper that integrates with forms
 * Extracts the final image URL from the uploader component by observing DOM changes
 */
export function AvatarUploaderWrapper({
  initialUrl,
  onUrlChange,
  onBlobChange,
}: AvatarUploaderWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastUrlRef = useRef<string | null>(initialUrl || null);
  const lastBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Poll for changes to the avatar image
    const checkImage = async () => {
      const img = containerRef.current?.querySelector("img[alt='User avatar']");
      if (img) {
        const src = img.getAttribute("src");
        if (src && src !== lastUrlRef.current) {
          lastUrlRef.current = src;
          onUrlChange?.(src);

          // If it's a blob URL, fetch the blob
          if (src.startsWith("blob:")) {
            try {
              const response = await fetch(src);
              const blob = await response.blob();
              if (blob !== lastBlobRef.current) {
                lastBlobRef.current = blob;
                onBlobChange?.(blob);
              }
            } catch (error) {
              console.error("Failed to fetch blob:", error);
            }
          } else {
            // If it's not a blob URL, clear the blob
            if (lastBlobRef.current) {
              lastBlobRef.current = null;
              onBlobChange?.(null);
            }
          }
        }
      } else if (lastUrlRef.current) {
        // Image was removed
        lastUrlRef.current = null;
        lastBlobRef.current = null;
        onUrlChange?.(null);
        onBlobChange?.(null);
      }
    };

    // Check immediately
    checkImage();

    // Set up interval to check for changes
    const interval = setInterval(checkImage, 500);

    // Also observe DOM changes
    const observer = new MutationObserver(checkImage);
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, [onUrlChange, onBlobChange]);

  return (
    <div ref={containerRef}>
      <AvatarUploaderWithCropper />
    </div>
  );
}
