export type TransactionType = "entrada" | "saida";

export type TransactionCategory =
  | "receita"
  | "despesa"
  | "investimento"
  | "taxa"
  | "imposto"
  | "compra";

export type TransactionStatus = "pago" | "pendente" | "atrasado";

export type PaymentMethod =
  | "dinheiro"
  | "pix"
  | "cartao_credito"
  | "cartao_debito"
  | "boleto"
  | "transferencia"
  | "outro";

export interface Transaction {
  id: string;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  date: string;
  amount: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  status: TransactionStatus;
  attachmentId?: string;
  attachmentName?: string;
  createdAt: string;
  updatedAt: string;
}
