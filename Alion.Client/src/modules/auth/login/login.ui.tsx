import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { components } from "@/lib/api/schema";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import type { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import type { LoginFormSchema } from "./login.types";

interface LoginFormProps extends React.PropsWithChildren {
  form: UseFormReturn<LoginFormSchema>;
  onSubmit: (values: LoginFormSchema) => void;
}

function _LoginForm(props: LoginFormProps) {
  return (
    <Form {...props.form}>
      <form onSubmit={props.form.handleSubmit(props.onSubmit)} className="grid gap-6">
        {props.children}
      </form>
    </Form>
  );
}

interface LoginFormEmailProps {
  field: ControllerRenderProps<components["schemas"]["LoginRequest"], "email">;
}

function _LoginFormEmail(props: LoginFormEmailProps) {
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

interface LoginFormPasswordProps {
  field: ControllerRenderProps<components["schemas"]["LoginRequest"], "password">;
}

function _LoginFormPassword(props: LoginFormPasswordProps) {
  return (
    <FormItem>
      <FormLabel>Mot de passe</FormLabel>
      <FormControl>
        <Input type="password" placeholder="Mot de passe" {...props.field} />
      </FormControl>
      <Link
        to="/forgot-password"
        className="text-foreground/80 inline-flex w-fit justify-start p-0 text-sm/5 font-normal hover:underline"
      >
        Mot de passe oublié ?
      </Link>
      <FormMessage />
    </FormItem>
  );
}

interface LoginFormSubmitProps {
  isPending: boolean;
}

function _LoginFormSubmit(props: LoginFormSubmitProps) {
  return (
    <Button type="submit" disabled={props.isPending} className="w-full rounded-full">
      Connexion
      {props.isPending && <Loader />}
    </Button>
  );
}

export const LoginForm = Object.assign(_LoginForm, {
  Email: _LoginFormEmail,
  Password: _LoginFormPassword,
  Submit: _LoginFormSubmit,
});
