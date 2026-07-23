"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  deleteTransaction,
  fetchTransactions,
  insertDuplicateTransaction,
  insertTransaction,
  updateTransactionRow,
} from "@/services/supabase/transactions";
import type { TransactionFormValues } from "../schemas";
import type { Transaction } from "@/types";

export const TRANSACTIONS_KEY = ["transactions"] as const;

export function useTransactions() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: transactions = [] } = useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: fetchTransactions,
    enabled: isAuthenticated,
  });

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
  }

  const onError = () => showToast({ title: "Erro ao salvar. Tente novamente.", variant: "error" });

  const addMutation = useMutation({
    mutationFn: ({
      values,
      attachment,
    }: {
      values: TransactionFormValues;
      attachment?: { id: string; name: string };
    }) => insertTransaction(values, attachment),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Lançamento adicionado", variant: "success" });
    },
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
      attachment,
    }: {
      id: string;
      values: TransactionFormValues;
      attachment?: { id: string; name: string };
    }) => updateTransactionRow(id, values, attachment),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Lançamento atualizado", variant: "success" });
    },
    onError,
  });

  const duplicateMutation = useMutation({
    mutationFn: (transaction: Transaction) => insertDuplicateTransaction(transaction),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Lançamento duplicado", variant: "success" });
    },
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      invalidate();
      showToast({ title: "Lançamento removido", variant: "success" });
    },
    onError,
  });

  return {
    transactions,
    addTransaction: (values: TransactionFormValues, attachment?: { id: string; name: string }) =>
      addMutation.mutateAsync({ values, attachment }),
    updateTransaction: (
      id: string,
      values: TransactionFormValues,
      attachment?: { id: string; name: string }
    ) => updateMutation.mutateAsync({ id, values, attachment }),
    duplicateTransaction: (transaction: Transaction) => duplicateMutation.mutateAsync(transaction),
    removeTransaction: (id: string) => removeMutation.mutateAsync(id),
  };
}
