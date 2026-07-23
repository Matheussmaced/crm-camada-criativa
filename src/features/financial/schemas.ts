import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "Informe uma descrição"),
  category: z.enum(["receita", "despesa", "investimento", "taxa", "imposto", "compra"]),
  type: z.enum(["entrada", "saida"]),
  date: z.string().min(1, "Informe a data"),
  amount: z.number({ error: "Informe um valor válido" }).gt(0, "O valor deve ser maior que zero"),
  paymentMethod: z.enum([
    "dinheiro",
    "pix",
    "cartao_credito",
    "cartao_debito",
    "boleto",
    "transferencia",
    "outro",
  ]),
  notes: z.string().optional(),
  status: z.enum(["pago", "pendente", "atrasado"]),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
