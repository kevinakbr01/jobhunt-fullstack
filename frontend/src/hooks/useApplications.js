import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

/**
 * Hook untuk mengambil riwayat lamaran milik job seeker yang sedang login
 */
export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const response = await api.get("/applications/mine");
      return Array.isArray(response.data) ? response.data : [];
    },
  });
}

/**
 * Hook untuk mengambil daftar pelamar pada lowongan tertentu milik recruiter
 */
export function useJobApplicants(jobId) {
  return useQuery({
    queryKey: ["job-applicants", jobId],
    queryFn: async () => {
      const response = await api.get(`/jobs/${jobId}/applicants`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: Boolean(jobId),
  });
}

/**
 * Mutation untuk melamar pekerjaan oleh job seeker
 */
export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, cover_letter }) => {
      const response = await api.post(`/jobs/${jobId}/apply`, {
        cover_letter: cover_letter ? cover_letter.trim() : null,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] });
    },
  });
}

/**
 * Mutation untuk memperbarui status lamaran oleh recruiter
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const response = await api.put(`/applications/${applicationId}`, {
        status,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (variables.jobId) {
        queryClient.invalidateQueries({
          queryKey: ["job-applicants", variables.jobId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["job-applicants"] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
}
