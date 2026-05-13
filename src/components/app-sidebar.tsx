import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

type SideBarProps = {
  header?: React.ReactNode;
};

export function AppSidebar({
  children,
  header,
  ...props
}: React.ComponentProps<typeof Sidebar> & SideBarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>{header}</SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
