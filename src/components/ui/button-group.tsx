import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

const buttonGroupVariants = cva('flex items-center *:rounded-none', {
  variants: {
    orientation: {
      horizontal:
        'flex-row *:first:rounded-s-md *:last:rounded-e-md [&>*:not(:first-child)]:border-s-0',
      vertical: 'flex-col *:first:rounded-t-md *:last:rounded-b-md',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const ButtonGroup = ({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) => {
  return (
    <div
      className={cn(buttonGroupVariants({ orientation, className }))}
      {...props}
    />
  );
};
