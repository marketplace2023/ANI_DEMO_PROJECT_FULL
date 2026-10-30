import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAnimeSearch } from "../api/client";
import { PER_PAGE } from "../constants";
import { FilterState } from "../types/anime";

export function useAnimeSearch(filters: FilterState) {
  return useInfiniteQuery({
    queryKey: ["anime-search", filters],
    queryFn: ({ pageParam }) => fetchAnimeSearch(filters, pageParam, PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined,
  });
}
