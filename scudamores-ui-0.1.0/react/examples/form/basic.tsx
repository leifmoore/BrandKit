"use client";

import { useForm } from "react-hook-form";

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";

type ExampleValues = { email: string };

export function FormExample() {
  const form = useForm<ExampleValues>({ defaultValues: { email: "" } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => undefined)} className="w-full max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Enter an email address" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
              <FormDescription>Used for booking notifications.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
