import { useEffect, useRef } from 'react';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void> | void;
  interval?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave({ data, onSave, interval = 30000, enabled = true }: UseAutoSaveOptions) {
  const lastSavedRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const dataString = JSON.stringify(data);

    // Only save if data has changed
    if (dataString === lastSavedRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;
      if (dataString === lastSavedRef.current) return;

      isSavingRef.current = true;
      try {
        await onSave(data);
        lastSavedRef.current = dataString;
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        isSavingRef.current = false;
      }
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, interval, enabled]);

  // Manual save function
  const saveNow = async () => {
    if (isSavingRef.current) return;

    const dataString = JSON.stringify(data);
    if (dataString === lastSavedRef.current) return;

    isSavingRef.current = true;
    try {
      await onSave(data);
      lastSavedRef.current = dataString;
    } catch (error) {
      console.error('Manual save failed:', error);
      throw error;
    } finally {
      isSavingRef.current = false;
    }
  };

  return { saveNow, isSaving: isSavingRef.current };
}

