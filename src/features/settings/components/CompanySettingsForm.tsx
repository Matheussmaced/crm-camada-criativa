"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { SaveStatusLabel } from "@/components/ui/SaveStatusLabel";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useSettings } from "../hooks/useSettings";
import { LogoUploader } from "./LogoUploader";
import { companySettingsSchema, type CompanySettingsFormValues } from "../schemas";

export function CompanySettingsForm() {
  const { settings, updateSettings } = useSettings();

  const { register, watch } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: settings.name,
      phone: settings.phone ?? "",
      email: settings.email ?? "",
      instagram: settings.instagram ?? "",
      whatsapp: settings.whatsapp ?? "",
      address: settings.address ?? "",
      primaryColor: settings.primaryColor,
      currency: settings.currency,
      language: settings.language,
    },
  });

  const values = watch();
  const status = useAutoSave(values, (next) => {
    const result = companySettingsSchema.safeParse(next);
    if (result.success) updateSettings(result.data);
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Dados da empresa</CardTitle>
        <SaveStatusLabel status={status} />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <LogoUploader />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Nome da empresa">
            <Input {...register("name")} />
          </FormField>
          <FormField label="Telefone">
            <Input {...register("phone")} placeholder="(00) 00000-0000" />
          </FormField>
          <FormField label="E-mail">
            <Input {...register("email")} placeholder="contato@empresa.com" />
          </FormField>
          <FormField label="WhatsApp">
            <Input {...register("whatsapp")} placeholder="(00) 00000-0000" />
          </FormField>
          <FormField label="Instagram">
            <Input {...register("instagram")} placeholder="@empresa" />
          </FormField>
          <FormField label="Endereço">
            <Input {...register("address")} />
          </FormField>
          <FormField label="Cor principal">
            <Input type="color" {...register("primaryColor")} className="h-9 w-full p-1" />
          </FormField>
          <FormField label="Moeda">
            <Input {...register("currency")} placeholder="BRL" />
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}
