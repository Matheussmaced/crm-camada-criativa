"use client";

import { useToast } from "@/contexts/ToastContext";
import { useCollectionStore } from "@/hooks/useCollectionStore";
import { customerStore } from "@/services/storage/customerStorage";
import { generateId } from "@/utils/id";
import { nowIso } from "@/utils/formatDate";
import type { Customer } from "@/types";
import type { CustomerFormValues } from "../schemas";

export function useCustomers() {
  const customers = useCollectionStore(customerStore);
  const { showToast } = useToast();

  function addCustomer(values: CustomerFormValues): Customer {
    const now = nowIso();
    const customer: Customer = { id: generateId(), ...values, createdAt: now, updatedAt: now };
    customerStore.add(customer);
    showToast({ title: "Cliente cadastrado", variant: "success" });
    return customer;
  }

  function updateCustomer(id: string, values: CustomerFormValues): void {
    customerStore.update(id, { ...values, updatedAt: nowIso() });
    showToast({ title: "Cliente atualizado", variant: "success" });
  }

  function removeCustomer(id: string): void {
    customerStore.remove(id);
    showToast({ title: "Cliente removido", variant: "success" });
  }

  return { customers, addCustomer, updateCustomer, removeCustomer };
}
