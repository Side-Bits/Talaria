import { FooterActions } from "@/components/FooterActions";
import { FooterActionsContext, type FooterActionOptions } from "@/contexts/footerActionsContext";
import { AppLayout } from "@/layouts/AppLayout";
import { useState } from "react";

export default function EditorLayout() {
  const [footerAction, setFooterAction] = useState<FooterActionOptions | null>(null);

  return (
    <FooterActionsContext.Provider value={setFooterAction}>
      <AppLayout
        footer={footerAction ? <FooterActions {...footerAction} /> : null}
      />
    </FooterActionsContext.Provider>
  );
}
