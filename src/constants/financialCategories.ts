import type {
  PaymentMethod,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@/types";

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  receita: "Receita",
  despesa: "Despesa",
  investimento: "Investimento",
  taxa: "Taxa",
  imposto: "Imposto",
  compra: "Compra",
};

export const DEFAULT_TYPE_BY_CATEGORY: Record<TransactionCategory, TransactionType> = {
  receita: "entrada",
  despesa: "saida",
  investimento: "saida",
  taxa: "saida",
  imposto: "saida",
  compra: "saida",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  cartao_credito: "Cartão de crédito",
  cartao_debito: "Cartão de débito",
  boleto: "Boleto",
  transferencia: "Transferência",
  outro: "Outro",
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  atrasado: "Atrasado",
};

export const TRANSACTION_CATEGORY_OPTIONS = Object.entries(TRANSACTION_CATEGORY_LABELS).map(
  ([value, label]) => ({ value: value as TransactionCategory, label })
);

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ value: value as PaymentMethod, label })
);

export const TRANSACTION_STATUS_OPTIONS = Object.entries(TRANSACTION_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as TransactionStatus, label })
);
