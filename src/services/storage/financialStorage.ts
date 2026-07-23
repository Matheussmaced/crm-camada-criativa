import type { Transaction } from "@/types";
import { createCollectionStore } from "./createCollectionStore";
import { STORAGE_KEYS } from "./keys";

export const transactionStore = createCollectionStore<Transaction>(STORAGE_KEYS.transactions);
