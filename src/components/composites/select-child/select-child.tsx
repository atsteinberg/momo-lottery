'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerUser } from './select-child.actions';
import { FormSchema, SelectChildFormValues } from './select-child.schema';

type SelectChildProps = {
  kids: { id: string; name: string }[];
};

const SelectChild: FC<SelectChildProps> = ({ kids }) => {
  const router = useRouter();
  const form = useForm<SelectChildFormValues>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const kid = await registerUser(data);
    toast({
      title: 'Kind ausgewählt',
      description: `Du hast folgendes Kind ausgewählt: ${kid.childName}`,
    });
    router.push('/unverified');
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 w-full items-end"
      >
        <div className="flex flex-1 flex-col gap-2">
          <FormField
            control={form.control}
            name="kid"
            render={({ field }) => (
              <FormItem className="flex-1">
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bitte nenne Dein Kind" />
                  </SelectTrigger>
                  <SelectContent>
                    {kids.map((kid) => (
                      <SelectItem key={kid.id} value={kid.id}>
                        {kid.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">Neues Kind hinzufügen</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newKid"
            render={({ field }) => (
              <FormItem>
                <Input
                  {...field}
                  placeholder="Name des neuen Kindes"
                  disabled={form.watch('kid') !== 'new'}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={
            (form.watch('kid') === 'new' && !form.watch('newKid')) ||
            !form.watch('kid')
          }
        >
          OK
        </Button>
      </form>
    </Form>
  );
};

export default SelectChild;
