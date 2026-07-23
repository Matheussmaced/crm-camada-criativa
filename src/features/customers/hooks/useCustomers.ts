"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  deleteCustomer,
  fetchCustomers,
  insertCustomer,
  updateCustomerRow,
} from "@/services/supabase/customers";
import type { CustomerFormValues } from "../schemas";

const CUSTOMERS_KEY = ["customers"] as const;

export function useCustomers() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: customers = [] } = useQuery({
    queryKey: CUSTOMERS_KEY,
    queryFn: fetchCustomers,
    enabled: isAuthenticated,
  });

  const onError = () => showToast({ title: "Erro ao salvar. Tente novamente.", variant: "error" });

  const addMutation = useMutation({
    mutationFn: (values: CustomerFormValues) => insertCustomer(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      showToast({ title: "Cliente cadastrado", variant: "success" });
    },
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CustomerFormValues }) =>
      updateCustomerRow(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      showToast({ title: "Cliente atualizado", variant: "success" });
    },
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
      showToast({ title: "Cliente removido", variant: "success" });
    },
    onError,
  });

  return {
    customers,
    addCustomer: (values: CustomerFormValues) => addMutation.mutateAsync(values),
    updateCustomer: (id: string, values: CustomerFormValues) =>
      updateMutation.mutateAsync({ id, values }),
    removeCustomer: (id: string) => removeMutation.mutateAsync(id),
  };
}
