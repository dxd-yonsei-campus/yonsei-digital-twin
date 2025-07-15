import { cn } from '@/lib/utils';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      style={
        {
          '--element-height': 'var(--radix-collapsible-content-height)',
        } as React.CSSProperties
      }
      className={cn(
        'overflow-hidden data-[state=closed]:animate-[slideUp_200ms_ease-out] data-[state=open]:animate-[slideDown_200ms_ease-out]',
        className,
      )}
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
