export function devWarn(message: string, detail?: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[ACL] ${message}`, detail ?? "");
  }
}
