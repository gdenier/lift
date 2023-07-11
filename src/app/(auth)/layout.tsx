import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center bg-white">
      {children}
    </div>
  );
}
