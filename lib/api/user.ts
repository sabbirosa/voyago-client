"use client";

import { apiFetch } from "./client";
import { getTokens } from "../auth/tokenStorage";

type UserRole = "TOURIST" | "GUIDE" | "ADMIN";

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  languages: string[];
  city: string | null;
  country: string | null;
  preferences: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GuideProfile {
  id: string;
  userId: string;
  expertise: string[];
  dailyRate: number | null;
  experienceYears: number | null;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  isEmailVerified: boolean;
  profile: Profile | null;
  guideProfile: GuideProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  languages?: string[];
  city?: string;
  country?: string;
  preferences?: string[];
}

export interface UpdateGuideProfilePayload {
  expertise?: string[];
  dailyRate?: number;
  experienceYears?: number;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
}

export interface CreateGuideProfilePayload {
  expertise: string[];
  dailyRate: number;
  experienceYears?: number;
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

export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiFetch<{
    success: boolean;
    data: { user: UserProfile };
  }>("/users/me", {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return response.data.user;
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await apiFetch<{
    success: boolean;
    data: { user: UserProfile };
  }>(`/users/${userId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return response.data.user;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<Profile> {
  const response = await apiFetch<{
    success: boolean;
    data: { profile: Profile };
  }>("/users/me/profile", {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: payload,
  });
  return response.data.profile;
}

export async function createProfile(
  payload: UpdateProfilePayload
): Promise<Profile> {
  const response = await apiFetch<{
    success: boolean;
    data: { profile: Profile };
  }>("/users/me/profile", {
    method: "POST",
    headers: getAuthHeaders(),
    body: payload,
  });
  return response.data.profile;
}

export async function updateGuideProfile(
  payload: UpdateGuideProfilePayload
): Promise<GuideProfile> {
  const response = await apiFetch<{
    success: boolean;
    data: { guideProfile: GuideProfile };
  }>("/users/me/guide-profile", {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: payload,
  });
  return response.data.guideProfile;
}

export async function createGuideProfile(
  payload: CreateGuideProfilePayload
): Promise<GuideProfile> {
  const response = await apiFetch<{
    success: boolean;
    data: { guideProfile: GuideProfile };
  }>("/users/me/guide-profile", {
    method: "POST",
    headers: getAuthHeaders(),
    body: payload,
  });
  return response.data.guideProfile;
}

