import AuthLayout from "@/components/auth/AuthLayout";
import { WebmasterLoginForm } from "@/components/webmaster-login-form";

export default function WebmasterLoginPage() {
  return (
    <AuthLayout
      title="Webmester Terület"
      subtitle="Csak adminisztrátorok számára"
      variant="webmaster"
      backButtonText="← Vissza a normál belépéshez"
      backButtonHref="/auth/login"
    >
      <WebmasterLoginForm />
    </AuthLayout>
  );
}
