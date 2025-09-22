
import { useQuery } from "@tanstack/react-query";

export function useProjectAssets(imageFolder: string) {
  return useQuery({
    queryKey: ["projectAssets", imageFolder],
    queryFn: async () => ({ success: true }),
    enabled: !!imageFolder,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
