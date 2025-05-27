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
  min?: number;
  max?: number;
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
  min,
  max,
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
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
            <FormMessage />
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
                min={type === 'number' ? min : undefined}
                max={type === 'number' ? max : undefined}
                {...field}
                onChange={(e) => {
                  if (type === 'number') {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      if (min !== undefined && value < min) {
                        field.onChange(min);
                      } else if (max !== undefined && value > max) {
                        field.onChange(max);
                      } else {
                        field.onChange(value);
                      }
                    }
                  } else {
                    field.onChange(e);
                  }
                }}
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
