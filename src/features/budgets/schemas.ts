import { z } from "zod";

export const budgetSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  projectName: z.string().min(1, "Informe o nome do projeto"),
  description: z.string().optional(),
  material: z.enum(["pla", "abs", "petg", "tpu", "nylon", "outro"]),
  color: z.string().optional(),
  quantity: z.number({ error: "Informe a quantidade" }).min(1),
  weightGrams: z.number({ error: "Informe o peso" }).min(0.1),
  printHours: z.number({ error: "Informe as horas de impressão" }).min(0.1),
  notes: z.string().optional(),
  deadline: z.string().optional(),
  validityDays: z.number({ error: "Informe a validade" }).min(1),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
