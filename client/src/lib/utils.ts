import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProjectMediaPath(imageFolder: string, fileName: string) {
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName;
  }
  return `/project_assets/${imageFolder}/${fileName}`;
}
