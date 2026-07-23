import type { Budget } from "@/types";
import { createCollectionStore } from "./createCollectionStore";
import { STORAGE_KEYS } from "./keys";

export const budgetStore = createCollectionStore<Budget>(STORAGE_KEYS.budgets);
