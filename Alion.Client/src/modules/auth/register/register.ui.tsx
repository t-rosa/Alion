import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { RegisterFormSchema } from "./register.types";

interface RegisterFormProps extends React.PropsWithChildren {
  form: UseFormReturn<RegisterFormSchema>;
  onSubmit: (values: RegisterFormSchema) => void;
}

function _RegisterForm(props: RegisterFormProps) {
  return (
    <Form {...props.form}>
      <form onSubmit={props.form.handleSubmit(props.onSubmit)} className="grid gap-6">
        {props.children}
      </form>
    </Form>
  );
}

interface RegisterFormEmailProps {
  field: ControllerRenderProps<RegisterFormSchema, "email">;
}

function _RegisterFormEmail(props: RegisterFormEmailProps) {
  return (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="email@alion.com" {...props.field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface RegisterFormPasswordProps {
  field: ControllerRenderProps<RegisterFormSchema, "password">;
}

function _RegisterFormPassword(props: RegisterFormPasswordProps) {
  return (
    <FormItem>
      <FormLabel>Mot de passe</FormLabel>
      <FormControl>
        <Input type="password" placeholder="Mot de passe" {...props.field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface RegisterFormConfirmPasswordProps {
  field: ControllerRenderProps<RegisterFormSchema, "confirmPassword">;
}

function _RegisterFormConfirmPassword(props: RegisterFormConfirmPasswordProps) {
  return (
    <FormItem>
      <FormLabel>Confirmer le mot de passe</FormLabel>
      <FormControl>
        <Input type="password" placeholder="Confirmation" {...props.field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface RegisterFormSubmitProps {
  isPending: boolean;
}

function _RegisterFormSubmit(props: RegisterFormSubmitProps) {
  return (
    <Button type="submit" disabled={props.isPending} className="w-full rounded-full">
      Créer un compte
      {props.isPending && <Loader />}
    </Button>
  );
}

export const RegisterForm = Object.assign(_RegisterForm, {
  Email: _RegisterFormEmail,
  Password: _RegisterFormPassword,
  ConfirmPassword: _RegisterFormConfirmPassword,
  Submit: _RegisterFormSubmit,
});
