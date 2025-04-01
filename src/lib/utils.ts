import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: number) => {
  if (!time) return "00:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Adds a hash fragment to the current URL hash, preserving any existing hash fragments
 * @example
 * // if window.location.hash = "#hi"
 * addHash("hello") // "#hi&hello"
 * @param params.path The hash fragment to add
 * @param params.existingHash The existing hash to append to
 * @returns The combined hash string
 */
export const addHash = (params: {
  path: string;
  currentHash?: string;
  value?: any;
}) => {
  const { path, currentHash, value } = params;
  const current_hash = removeHash({ path: path, currentHash });

  if (!current_hash) {
    return path.startsWith("#")
      ? path
      : `#${path}` + (value ? `=${value}` : "");
  }

  const newPath = path.startsWith("#")
    ? path.slice(1)
    : path + (value ? `=${value}` : "");
  const fragments = current_hash.slice(1).split("&");

  // Check if path already exists in fragments
  if (fragments.includes(newPath)) {
    return current_hash;
  }

  return `${current_hash}&${newPath}`;
};

/**
 * Removes a hash fragment from the current URL hash
 * @example
 * // if window.location.hash = "#hi&hello"
 * removeHash("hi") // "#hello"
 * @param path The hash fragment to remove
 * @returns The remaining hash string
 */
export const removeHash = (params: { path: string; currentHash?: string }) => {
  const { path, currentHash } = params;

  if (!currentHash) return "";

  const fragments = currentHash.slice(1).split("&");
  const pathToRemove = path.startsWith("#") ? path.slice(1) : path;
  const remainingFragments = fragments.filter((f) => !f.includes(pathToRemove));

  if (remainingFragments.length === 0) return "#";

  return "#" + remainingFragments.join("&");
};
