import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

type SidebarTriggerProps = {
  className?: string;
};

const SidebarTrigger = ({ className }: SidebarTriggerProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-full main-bg py-2 pr-4.5 pl-3.5 text-sm font-medium transition-colors hover:bg-background',
        className,
      )}
      onClick={toggleSidebar}
    >
      <Sparkles className="size-3.5" />
      Ask AI
    </button>
  );
};

export default SidebarTrigger;
