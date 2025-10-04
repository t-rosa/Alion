import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { ForgotPasswordFormSchema } from "./forgot-password.types";

interface ForgotPasswordFormProps extends React.PropsWithChildren {
  form: UseFormReturn<ForgotPasswordFormSchema>;
  onSubmit: (values: ForgotPasswordFormSchema) => void;
}

function _ForgotPasswordForm(props: ForgotPasswordFormProps) {
  return (
    <Form {...props.form}>
      <form onSubmit={props.form.handleSubmit(props.onSubmit)} className="grid gap-6">
        {props.children}
      </form>
    </Form>
  );
}

interface ForgotPasswordFormEmailProps {
  field: ControllerRenderProps<ForgotPasswordFormSchema, "email">;
}

function _ForgotPasswordFormEmail(props: ForgotPasswordFormEmailProps) {
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

interface ForgotPasswordFormSubmitProps {
  isPending: boolean;
}

function _ForgotPasswordFormSubmit(props: ForgotPasswordFormSubmitProps) {
  return (
    <Button type="submit" disabled={props.isPending} className="w-full rounded-full">
      Envoyer
      {props.isPending && <Loader />}
    </Button>
  );
}

export const ForgotPasswordForm = Object.assign(_ForgotPasswordForm, {
  Email: _ForgotPasswordFormEmail,
  Submit: _ForgotPasswordFormSubmit,
});
