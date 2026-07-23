"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { CompanySettingsForm } from "./CompanySettingsForm";
import { CostConfigForm } from "./CostConfigForm";
import { ThemeSection } from "./ThemeSection";

const TABS = [
  { value: "empresa", label: "Empresa" },
  { value: "custos", label: "Custos de impressão" },
];

export function SettingsView() {
  const [tab, setTab] = useState("empresa");

  return (
    <div className="flex flex-col gap-5">
      <Tabs items={TABS} value={tab} onChange={setTab} />
      {tab === "empresa" ? (
        <div className="flex flex-col gap-5">
          <CompanySettingsForm />
          <ThemeSection />
        </div>
      ) : (
        <CostConfigForm />
      )}
    </div>
  );
}
