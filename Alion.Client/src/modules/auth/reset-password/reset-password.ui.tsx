import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { ResetPasswordFormSchema } from "./reset-password.types";

interface ResetPasswordFormProps extends React.PropsWithChildren {
  form: UseFormReturn<ResetPasswordFormSchema>;
  onSubmit: (values: ResetPasswordFormSchema) => void;
}

function _ResetPasswordForm(props: ResetPasswordFormProps) {
  return (
    <Form {...props.form}>
      <form onSubmit={props.form.handleSubmit(props.onSubmit)} className="grid gap-6">
        {props.children}
      </form>
    </Form>
  );
}

interface ResetPasswordFormEmailProps {
  field: ControllerRenderProps<ResetPasswordFormSchema, "email">;
}

function _ResetPasswordFormEmail(props: ResetPasswordFormEmailProps) {
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

interface ResetPasswordFormNewPasswordProps {
  field: ControllerRenderProps<ResetPasswordFormSchema, "newPassword">;
}

function _ResetPasswordFormNewPassword(props: ResetPasswordFormNewPasswordProps) {
  return (
    <FormItem>
      <FormLabel>Nouveau mot de passe</FormLabel>
      <FormControl>
        <Input type="password" placeholder="Mot de passe" {...props.field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface ResetPasswordFormConfirmPasswordProps {
  field: ControllerRenderProps<ResetPasswordFormSchema, "confirmPassword">;
}

function _ResetPasswordFormConfirmPassword(props: ResetPasswordFormConfirmPasswordProps) {
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

interface ResetPasswordFormResetCodeProps {
  field: ControllerRenderProps<ResetPasswordFormSchema, "resetCode">;
}

function _ResetPasswordFormResetCode(props: ResetPasswordFormResetCodeProps) {
  return (
    <FormItem>
      <FormLabel>Code de réinitialisation</FormLabel>
      <FormControl>
        <Input type="password" placeholder="Code de réinitialisation" {...props.field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

interface ResetPasswordFormSubmitProps {
  isPending: boolean;
}

function _ResetPasswordFormSubmit(props: ResetPasswordFormSubmitProps) {
  return (
    <Button type="submit" disabled={props.isPending} className="w-full rounded-full">
      Créer un compte
      {props.isPending && <Loader />}
    </Button>
  );
}

export const ResetPasswordForm = Object.assign(_ResetPasswordForm, {
  Email: _ResetPasswordFormEmail,
  ResetCode: _ResetPasswordFormResetCode,
  NewPassword: _ResetPasswordFormNewPassword,
  ConfirmPassword: _ResetPasswordFormConfirmPassword,
  Submit: _ResetPasswordFormSubmit,
});
