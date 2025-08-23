import { useQuery } from "@tanstack/react-query";
import type { Portfolio } from "@shared/schema";

export function usePortfolio() {
  return useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
