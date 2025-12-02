"use client";

import { apiFetch } from "./client";
import { getTokens } from "../auth/tokenStorage";

export interface UploadImageResponse {
  success: boolean;
  data: {
    url: string;
    key: string;
    size: number;
    mimetype: string;
  };
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

/**
 * Upload an image file to Cloudflare R2
 * @param file - The image file to upload
 * @param folder - Optional folder name (default: "avatars")
 * @returns The uploaded image URL and metadata
 */
export async function uploadImage(
  file: File | Blob,
  folder: string = "avatars"
): Promise<string> {
  const formData = new FormData();
  // Convert Blob to File if needed
  const fileToUpload = file instanceof File 
    ? file 
    : new File([file], `avatar-${Date.now()}.jpg`, { type: file.type || "image/jpeg" });
  
  formData.append("image", fileToUpload);
  
  const response = await apiFetch<UploadImageResponse>(
    `/upload/image?folder=${folder}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
  );

  return response.data.url;
}

