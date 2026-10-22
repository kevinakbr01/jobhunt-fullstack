import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

/**
 * Hook untuk mengambil daftar lowongan pekerjaan aktif (Publik)
 * Mendukung filter: keyword, type, location, sort, page, limit
 */
export function useJobs(params = {}) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: async () => {
      // Bersihkan parameter kosong/undefined
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, v]) => v !== undefined && v !== null && v !== "",
        ),
      );
      const response = await api.get("/jobs", { params: cleanParams });
      return (
        response.data || {
          jobs: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }
      );
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook untuk mengambil detail sebuah lowongan pekerjaan
 */
export function useJob(id) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

/**
 * Hook untuk mengambil daftar lowongan milik recruiter yang sedang login
 */
export function useMyJobs() {
  return useQuery({
    queryKey: ["my-jobs"],
    queryFn: async () => {
      const response = await api.get("/jobs/mine");
      return Array.isArray(response.data) ? response.data : [];
    },
  });
}

/**
 * Mutation untuk membuat lowongan baru oleh recruiter
 */
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/jobs", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });
}

/**
 * Mutation untuk memperbarui lowongan pekerjaan oleh recruiter
 */
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const response = await api.put(`/jobs/${id}`, payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
    },
  });
}

/**
 * Mutation untuk menonaktifkan lowongan pekerjaan (Soft Delete)
 */
export function useDeactivateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/jobs/${id}`);
      return response;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", id] });
    },
  });
}
