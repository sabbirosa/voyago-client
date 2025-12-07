import { Cropper } from "@origin-space/image-cropper";
import React from "react";

// Define type for pixel crop area
type Area = { x: number; y: number; width: number; height: number };

function MyImageCropper() {
  const [cropData, setCropData] = React.useState<Area | null>(null);

  return (
    <div>
      <Cropper.Root
        image="/images/avatar.png"
        aspectRatio={1}
        onCropChange={(pixels) => setCropData(pixels as Area | null)}
        className="relative flex h-80 w-full cursor-move touch-none items-center justify-center overflow-hidden rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Required for accessibility */}
        <Cropper.Description className="sr-only" />
        <Cropper.Image className="pointer-events-none h-full w-full select-none object-cover" />
        <Cropper.CropArea className="pointer-events-none absolute border-2 border-dashed border-background shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]" />
      </Cropper.Root>

      {cropData && (
        <pre className="mt-4 overflow-auto rounded bg-muted p-2 text-sm">
          {JSON.stringify(cropData, null, 2)}
        </pre>
      )}
    </div>
  );
}
