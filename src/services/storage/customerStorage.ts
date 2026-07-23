import type { Customer } from "@/types";
import { createCollectionStore } from "./createCollectionStore";
import { STORAGE_KEYS } from "./keys";

export const customerStore = createCollectionStore<Customer>(STORAGE_KEYS.customers);
