import { useEffect } from "react";

// Предупреждает при закрытии/перезагрузке вкладки с несохранёнными правками.
// (Блокировка in-app навигации — follow-up через data-router useBlocker.)
export function useUnsavedGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
}
