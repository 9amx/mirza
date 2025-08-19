"use client"
import { useToast } from "./use-toast.tsx"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="space-y-3 max-w-[90vw] w-full flex flex-col items-center">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-sm rounded-xl border p-4 shadow-2xl backdrop-blur-md bg-card/90 text-foreground transition-all duration-300 ${
              t.variant === 'destructive' ? 'border-red-300 bg-red-50/90' : t.variant === 'success' ? 'border-green-300 bg-green-50/90' : 'border-border'
            }`}
          >
            {t.title && <div className="font-semibold text-base mb-1">{t.title}</div>}
            {t.description && <div className="text-sm text-muted-foreground">{t.description}</div>}
            <div className="mt-2 flex justify-end">
              <button
                className="text-xs px-2 py-1 rounded-md border hover:bg-muted/50"
                onClick={() => dismiss(t.id)}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
