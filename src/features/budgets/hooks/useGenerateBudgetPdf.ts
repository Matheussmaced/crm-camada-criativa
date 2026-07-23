"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { generateBudgetPdf } from "@/features/pdf/utils/generateBudgetPdf";
import type { Budget } from "@/types";

export function useGenerateBudgetPdf() {
  const { customers } = useCustomers();
  const { settings } = useSettings();
  const { showToast } = useToast();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  async function generate(budget: Budget) {
    const customer = customers.find((item) => item.id === budget.customerId);
    if (!customer) {
      showToast({ title: "Cliente não encontrado para este orçamento", variant: "error" });
      return;
    }
    setGeneratingId(budget.id);
    try {
      await generateBudgetPdf({ budget, customer, settings });
      showToast({ title: "PDF do orçamento gerado", variant: "success" });
    } catch {
      showToast({ title: "Erro ao gerar PDF", variant: "error" });
    } finally {
      setGeneratingId(null);
    }
  }

  return { generate, generatingId };
}
