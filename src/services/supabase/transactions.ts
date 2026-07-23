import { supabase } from "@/lib/supabase/client";
import type { Transaction } from "@/types";
import type { TransactionFormValues } from "@/features/financial/schemas";

interface TransactionRow {
  id: string;
  description: string;
  category: Transaction["category"];
  type: Transaction["type"];
  date: string;
  amount: number;
  payment_method: Transaction["paymentMethod"];
  notes: string | null;
  status: Transaction["status"];
  attachment_id: string | null;
  attachment_name: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    description: row.description,
    category: row.category,
    type: row.type,
    date: row.date,
    amount: row.amount,
    paymentMethod: row.payment_method,
    notes: row.notes ?? undefined,
    status: row.status,
    attachmentId: row.attachment_id ?? undefined,
    attachmentName: row.attachment_name ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toValuesRow(values: TransactionFormValues) {
  return {
    description: values.description,
    category: values.category,
    type: values.type,
    date: values.date,
    amount: values.amount,
    payment_method: values.paymentMethod,
    notes: values.notes ?? null,
    status: values.status,
  };
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as TransactionRow[]).map(mapRow);
}

export async function insertTransaction(
  values: TransactionFormValues,
  attachment?: { id: string; name: string }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      ...toValuesRow(values),
      attachment_id: attachment?.id ?? null,
      attachment_name: attachment?.name ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as TransactionRow);
}

export async function updateTransactionRow(
  id: string,
  values: TransactionFormValues,
  attachment?: { id: string; name: string }
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      ...toValuesRow(values),
      ...(attachment ? { attachment_id: attachment.id, attachment_name: attachment.name } : {}),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as TransactionRow);
}

export async function insertDuplicateTransaction(transaction: Transaction): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert({
      description: `${transaction.description} (cópia)`,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
      amount: transaction.amount,
      payment_method: transaction.paymentMethod,
      notes: transaction.notes ?? null,
      status: transaction.status,
      attachment_id: transaction.attachmentId ?? null,
      attachment_name: transaction.attachmentName ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as TransactionRow);
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

export async function insertApprovedBudgetTransaction(transaction: Transaction): Promise<void> {
  const { error } = await supabase.from("transactions").insert({
    description: transaction.description,
    category: transaction.category,
    type: transaction.type,
    date: transaction.date,
    amount: transaction.amount,
    payment_method: transaction.paymentMethod,
    notes: transaction.notes ?? null,
    status: transaction.status,
  });
  if (error) throw error;
}
