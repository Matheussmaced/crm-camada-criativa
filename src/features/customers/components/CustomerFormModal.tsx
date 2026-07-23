"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Customer } from "@/types";
import { customerSchema, type CustomerFormValues } from "../schemas";

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
  customer?: Customer;
}

const EMPTY_VALUES: CustomerFormValues = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "",
  notes: "",
};

export function CustomerFormModal({ isOpen, onClose, onSubmit, customer }: CustomerFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!isOpen) return;
    reset(
      customer
        ? {
            name: customer.name,
            phone: customer.phone ?? "",
            whatsapp: customer.whatsapp ?? "",
            email: customer.email ?? "",
            city: customer.city ?? "",
            notes: customer.notes ?? "",
          }
        : EMPTY_VALUES
    );
  }, [isOpen, customer, reset]);

  function submit(values: CustomerFormValues) {
    onSubmit(values);
    onClose();
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={customer ? "Editar cliente" : "Novo cliente"}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <FormField label="Nome" error={errors.name?.message}>
          <Input {...register("name")} autoFocus />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Telefone">
            <Input {...register("phone")} />
          </FormField>
          <FormField label="WhatsApp">
            <Input {...register("whatsapp")} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="E-mail" error={errors.email?.message}>
            <Input {...register("email")} />
          </FormField>
          <FormField label="Cidade">
            <Input {...register("city")} />
          </FormField>
        </div>
        <FormField label="Observações">
          <Textarea {...register("notes")} />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{customer ? "Salvar alterações" : "Cadastrar cliente"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
