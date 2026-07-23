"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Paperclip } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  DEFAULT_TYPE_BY_CATEGORY,
  PAYMENT_METHOD_OPTIONS,
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_STATUS_OPTIONS,
} from "@/constants/financialCategories";
import { saveAttachment } from "@/services/storage/attachmentStorage";
import type { Transaction, TransactionCategory } from "@/types";
import { transactionSchema, type TransactionFormValues } from "../schemas";

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues, attachment?: { id: string; name: string }) => void;
  transaction?: Transaction;
}

function emptyValues(): TransactionFormValues {
  return {
    description: "",
    category: "receita",
    type: "entrada",
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    paymentMethod: "pix",
    notes: "",
    status: "pago",
  };
}

export function TransactionFormModal({ isOpen, onClose, onSubmit, transaction }: TransactionFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: emptyValues(),
  });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFile(null);
    reset(
      transaction
        ? {
            description: transaction.description,
            category: transaction.category,
            type: transaction.type,
            date: transaction.date,
            amount: transaction.amount,
            paymentMethod: transaction.paymentMethod,
            notes: transaction.notes ?? "",
            status: transaction.status,
          }
        : emptyValues()
    );
  }, [isOpen, transaction, reset]);

  async function submit(values: TransactionFormValues) {
    if (file) {
      const id = await saveAttachment(file);
      onSubmit(values, { id, name: file.name });
    } else {
      onSubmit(values);
    }
    onClose();
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? "Editar lançamento" : "Novo lançamento"}
      size="lg"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <FormField label="Descrição" error={errors.description?.message}>
          <Input {...register("description")} autoFocus />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Categoria">
            <Select
              {...register("category")}
              options={TRANSACTION_CATEGORY_OPTIONS}
              onChange={(event) => {
                const category = event.target.value as TransactionCategory;
                setValue("category", category);
                setValue("type", DEFAULT_TYPE_BY_CATEGORY[category]);
              }}
            />
          </FormField>
          <FormField label="Tipo">
            <Select {...register("type")} options={[{ value: "entrada", label: "Entrada" }, { value: "saida", label: "Saída" }]} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Data">
            <Input type="date" {...register("date")} />
          </FormField>
          <FormField label="Valor" error={errors.amount?.message}>
            <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Forma de pagamento">
            <Select {...register("paymentMethod")} options={PAYMENT_METHOD_OPTIONS} />
          </FormField>
          <FormField label="Status">
            <Select {...register("status")} options={TRANSACTION_STATUS_OPTIONS} />
          </FormField>
        </div>
        <FormField label="Observação">
          <Textarea {...register("notes")} />
        </FormField>
        <FormField label="Anexo (opcional)">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <Paperclip className="h-4 w-4" />
            {file?.name ?? transaction?.attachmentName ?? "Selecionar arquivo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{transaction ? "Salvar alterações" : "Adicionar lançamento"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
