import { type VariantProps, cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/utils';

const textVariants = cva('text-base', {
  variants: {
    variant: {
      default: 'text-base',
      label: 'text-sm font-medium mb-2',

      'heading-xs': 'text-xs font-semibold',
      'heading-sm': 'text-sm font-semibold',
      'heading-md': 'text-base font-semibold',
      'heading-lg': 'text-xl font-semibold',
      'heading-xl': 'text-2xl font-bold',
      'heading-2xl': 'text-3xl font-bold',
      'heading-3xl': 'text-4xl font-bold',

      'body-sm': 'text-sm',
      'body-lg': 'text-lg',
      'body-xl': 'text-xl',
      'body-2xl': 'text-2xl',
      'body-3xl': 'text-3xl',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TextProps extends VariantProps<typeof textVariants> {
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'label';
  className?: string;
  children: React.ReactNode;
}

export default function Text({
  as = 'p',
  className,
  children,
  variant,
}: TextProps) {
  const Comp = as;
  return (
    <Comp className={cn(textVariants({ variant, className }))}>{children}</Comp>
  );
}
