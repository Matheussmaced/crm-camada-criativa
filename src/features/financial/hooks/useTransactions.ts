"use client";

import { useToast } from "@/contexts/ToastContext";
import { useCollectionStore } from "@/hooks/useCollectionStore";
import { transactionStore } from "@/services/storage/financialStorage";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/formatDate";
import type { Transaction } from "@/types";
import type { TransactionFormValues } from "../schemas";

export function useTransactions() {
  const transactions = useCollectionStore(transactionStore);
  const { showToast } = useToast();

  function addTransaction(values: TransactionFormValues, attachment?: { id: string; name: string }): Transaction {
    const now = nowIso();
    const transaction: Transaction = {
      id: generateId(),
      ...values,
      attachmentId: attachment?.id,
      attachmentName: attachment?.name,
      createdAt: now,
      updatedAt: now,
    };
    transactionStore.add(transaction);
    showToast({ title: "Lançamento adicionado", variant: "success" });
    return transaction;
  }

  function updateTransaction(
    id: string,
    values: TransactionFormValues,
    attachment?: { id: string; name: string }
  ): void {
    transactionStore.update(id, {
      ...values,
      ...(attachment ? { attachmentId: attachment.id, attachmentName: attachment.name } : {}),
      updatedAt: nowIso(),
    });
    showToast({ title: "Lançamento atualizado", variant: "success" });
  }

  function duplicateTransaction(transaction: Transaction): Transaction {
    const now = nowIso();
    const duplicated: Transaction = {
      ...transaction,
      id: generateId(),
      description: `${transaction.description} (cópia)`,
      createdAt: now,
      updatedAt: now,
    };
    transactionStore.add(duplicated);
    showToast({ title: "Lançamento duplicado", variant: "success" });
    return duplicated;
  }

  function removeTransaction(id: string): void {
    transactionStore.remove(id);
    showToast({ title: "Lançamento removido", variant: "success" });
  }

  return { transactions, addTransaction, updateTransaction, duplicateTransaction, removeTransaction };
}
