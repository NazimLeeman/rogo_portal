import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { publicSupabase } from '../../api/SupabaseClient';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Text from '../ui/text';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email(),
});

const MagicLogin: React.FC = () => {
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { error } = await publicSupabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: import.meta.env.VITE_REACT_APP_SIGN_IN_REDIRECT_URL,
          shouldCreateUser: false,
        },
      });

      if (error) {
        return toast.error(error.message);
      }

      setSuccess(true);
    } catch {
      toast.error('Something went wrong');
    }
  });

  return (
    <div className="flex h-screen w-screen items-center justify-center px-5">
      <Card className="max-w-4/5 mx-auto w-[500px] space-y-6 rounded-md bg-background px-8 py-12">
        <div className="space-y-4 flex flex-col items-center">
          <img
            src="/logo-icon.svg"
            alt="Russian On The Go"
            className="h-10 w-auto"
          />
          <Text variant="heading-lg" className="text-center">
            Log in to RoGo Personal Account
          </Text>
        </div>
        {success ? (
          <div className="flex items-center gap-2 justify-center  ">
            <CircleCheck className="h-6 w-6 text-green-500 flex-shrink-0" />
            <Text>A magic link has been sent to your email address.</Text>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-4" onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                type="submit"
                isLoading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                Login
              </Button>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default MagicLogin;
