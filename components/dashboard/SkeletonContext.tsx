"use client";

import React, { createContext, useContext, useState } from "react";

interface SkeletonContextValue {
  skeleton: React.ReactNode | null;
  setSkeleton: (skeleton: React.ReactNode | null) => void;
}

const SkeletonContext = createContext<SkeletonContextValue | undefined>(
  undefined,
);

export function SkeletonProvider({ children }: { children: React.ReactNode }) {
  const [skeleton, setSkeleton] = useState<React.ReactNode | null>(null);

  return (
    <SkeletonContext.Provider value={{ skeleton, setSkeleton }}>
      {children}
    </SkeletonContext.Provider>
  );
}

export function useSkeleton() {
  const context = useContext(SkeletonContext);
  // Return null skeleton if context is not available (for backwards compatibility)
  if (!context) {
    return { skeleton: null, setSkeleton: () => {} };
  }
  return context;
}

