import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto w-full px-4">
        <Suspense fallback={<div className="text-center text-muted-foreground py-20">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
