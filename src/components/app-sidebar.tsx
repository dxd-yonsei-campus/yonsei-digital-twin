import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>Ask AI</SidebarHeader>
      <SidebarContent>Lorem Ipsum</SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
