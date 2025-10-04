import { FormField } from "@/components/ui/form";
import { $api } from "@/lib/api/client";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { AuthLayout } from "@/modules/auth/components/auth-layout";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { SuccessState } from "./components/success-state";
import { formSchema, type RegisterFormSchema } from "./register.types";
import { RegisterForm } from "./register.ui";

export function RegisterView() {
  const { mutate, status } = $api.useMutation("post", "/api/auth/register", {});

  const form = useForm<RegisterFormSchema>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function handleSubmit(values: RegisterFormSchema) {
    mutate({
      body: {
        email: values.email,
        password: values.password,
      },
    });
  }

  if (status === "success") {
    return (
      <AuthLayout>
        <AuthCard>
          <AuthCard.Content>
            <AuthCard.Header>
              <AuthCard.Title>Créer un compte.</AuthCard.Title>
              <AuthCard.Description>
                Enregistrez-vous pour vous connecter à l&apos;application.
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
            <AuthCard.Title>Créer un compte.</AuthCard.Title>
            <AuthCard.Description>
              Enregistrez-vous pour vous connecter à l&apos;application.
            </AuthCard.Description>
          </AuthCard.Header>
          <RegisterForm form={form} onSubmit={handleSubmit}>
            <FormField control={form.control} name="email" render={RegisterForm.Email} />
            <FormField control={form.control} name="password" render={RegisterForm.Password} />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={RegisterForm.ConfirmPassword}
            />
            <RegisterForm.Submit isPending={status === "pending"} />
          </RegisterForm>
        </AuthCard.Content>
        <AuthCard.Footer>
          <Link to="/login">Se connecter</Link>
        </AuthCard.Footer>
      </AuthCard>
    </AuthLayout>
  );
}
