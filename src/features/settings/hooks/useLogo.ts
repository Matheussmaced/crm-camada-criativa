"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import {
  readAttachmentAsDataUrl,
  removeAttachment,
  saveAttachment,
} from "@/services/storage/attachmentStorage";
import { useSettings } from "./useSettings";

export function useLogo() {
  const { settings, updateSettings } = useSettings();
  const { showToast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string>();

  useEffect(() => {
    let active = true;
    if (!settings.logoAttachmentId) {
      setLogoUrl(undefined);
      return;
    }
    readAttachmentAsDataUrl(settings.logoAttachmentId).then((url) => {
      if (active) setLogoUrl(url);
    });
    return () => {
      active = false;
    };
  }, [settings.logoAttachmentId]);

  const uploadLogo = useCallback(
    async (file: File) => {
      const previousId = settings.logoAttachmentId;
      const id = await saveAttachment(file);
      updateSettings({ logoAttachmentId: id });
      if (previousId) await removeAttachment(previousId);
      showToast({ title: "Logo atualizada", variant: "success" });
    },
    [settings.logoAttachmentId, updateSettings, showToast]
  );

  const removeLogo = useCallback(async () => {
    if (settings.logoAttachmentId) await removeAttachment(settings.logoAttachmentId);
    updateSettings({ logoAttachmentId: undefined });
  }, [settings.logoAttachmentId, updateSettings]);

  return { logoUrl, uploadLogo, removeLogo };
}
