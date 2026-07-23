import { supabase } from "@/lib/supabase/client";
import type { Customer } from "@/types";
import type { CustomerFormValues } from "@/features/customers/schemas";

interface CustomerRow {
  id: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    email: row.email ?? undefined,
    city: row.city ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as CustomerRow[]).map(mapRow);
}

export async function insertCustomer(values: CustomerFormValues): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: values.name,
      phone: values.phone ?? null,
      whatsapp: values.whatsapp ?? null,
      email: values.email ?? null,
      city: values.city ?? null,
      notes: values.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as CustomerRow);
}

export async function updateCustomerRow(id: string, values: CustomerFormValues): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update({
      name: values.name,
      phone: values.phone ?? null,
      whatsapp: values.whatsapp ?? null,
      email: values.email ?? null,
      city: values.city ?? null,
      notes: values.notes ?? null,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapRow(data as CustomerRow);
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}
