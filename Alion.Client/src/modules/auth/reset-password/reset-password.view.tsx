import { FormField } from "@/components/ui/form";
import { $api } from "@/lib/api/client";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { AuthLayout } from "@/modules/auth/components/auth-layout";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { SuccessState } from "./components/success-state";
import { formSchema, type ResetPasswordFormSchema } from "./reset-password.types";
import { ResetPasswordForm } from "./reset-password.ui";

export function ResetPasswordView() {
  const { mutate, status } = $api.useMutation("post", "/api/auth/resetPassword");

  const form = useForm<ResetPasswordFormSchema>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: "",
      resetCode: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function handleSubmit(values: ResetPasswordFormSchema) {
    mutate({
      body: {
        email: values.email,
        newPassword: values.newPassword,
        resetCode: values.resetCode,
      },
    });
  }

  if (status === "success") {
    return (
      <AuthLayout>
        <AuthCard>
          <AuthCard.Content>
            <AuthCard.Header>
              <AuthCard.Title>Réinitialiser.</AuthCard.Title>
              <AuthCard.Description>
                Veuillez saisir votre adresse e-mail afin de réinitialiser votre mot de passe.
              </AuthCard.Description>
            </AuthCard.Header>
            <SuccessState />
          </AuthCard.Content>
          <AuthCard.Footer>
            <Link to="/login">Se connecter</Link>
          </AuthCard.Footer>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthCard.Content>
          <AuthCard.Header>
            <AuthCard.Title>Réinitialiser.</AuthCard.Title>
            <AuthCard.Description>
              Veuillez saisir votre adresse e-mail afin de réinitialiser votre mot de passe.
            </AuthCard.Description>
          </AuthCard.Header>
          <ResetPasswordForm form={form} onSubmit={handleSubmit}>
            <FormField control={form.control} name="email" render={ResetPasswordForm.Email} />
            <FormField
              control={form.control}
              name="resetCode"
              render={ResetPasswordForm.ResetCode}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={ResetPasswordForm.NewPassword}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={ResetPasswordForm.ConfirmPassword}
            />
            <ResetPasswordForm.Submit isPending={status === "pending"} />
          </ResetPasswordForm>
        </AuthCard.Content>
        <AuthCard.Footer>
          <Link to="/login">Se connecter</Link>
        </AuthCard.Footer>
      </AuthCard>
    </AuthLayout>
  );
}
