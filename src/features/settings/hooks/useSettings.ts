"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  DEFAULT_COMPANY_SETTINGS,
  fetchCompanySettings,
  upsertCompanySettings,
} from "@/services/supabase/settings";
import type { CompanySettings } from "@/types";

const SETTINGS_KEY = ["company-settings"] as const;

export function useSettings() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings = DEFAULT_COMPANY_SETTINGS } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: fetchCompanySettings,
    enabled: isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: (patch: Partial<CompanySettings>) => upsertCompanySettings(patch, settings),
    onSuccess: (data) => queryClient.setQueryData(SETTINGS_KEY, data),
  });

  function updateSettings(patch: Partial<CompanySettings>) {
    return mutation.mutateAsync(patch);
  }

  return { settings, updateSettings };
}
