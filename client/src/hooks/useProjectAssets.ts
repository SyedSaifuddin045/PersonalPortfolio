
import { useQuery } from "@tanstack/react-query";

async function fetchProjectAssets(imageFolder: string) {
  const res = await fetch(`/api/assets/${imageFolder}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch assets from ${imageFolder}`);
  }
  return res.json();
}

export function useProjectAssets(imageFolder: string) {
  return useQuery<{ images: string[] }>({
    queryKey: ["projects", imageFolder],
    queryFn: () => fetchProjectAssets(imageFolder),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!imageFolder,
  });
}
