import AuthLayout from "@/components/auth/AuthLayout";
import { JatekmesterLoginForm } from "@/components/jatekmester-login-form";

export default function JatekmesterLoginPage() {
  return (
    <AuthLayout
      title="Játékmester Terület"
      subtitle="Csak adminisztrátorok számára"
      variant="jatekmester"
      backButtonText="← Vissza a normál belépéshez"
      backButtonHref="/auth/login"
    >
      <JatekmesterLoginForm />
    </AuthLayout>
  );
}
