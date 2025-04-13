import React from 'react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'file' | 'number' | 'dropdown';
  options?: DropdownOption[];
  autoComplete?: string;
}

type DropdownOption = {
  label: string;
  value: string;
};

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  options,
  autoComplete,
}: FormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <>
        {type === 'dropdown' ? (
          <FormItem>
            <FormLabel className='label'>{label}</FormLabel>
            <FormControl>
              <Select>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        ) : (
          <FormItem>
            <FormLabel className='label'>{label}</FormLabel>
            <FormControl>
              <Input
                className='input'
                placeholder={placeholder}
                type={type}
                autoComplete={autoComplete}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      </>
    )}
  />
);

export default FormField;
