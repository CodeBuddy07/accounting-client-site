import {
  ArrowRightLeftIcon,
  GalleryVerticalEnd,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import TeamSwitcher from "./TeamSwitcher";
import NavMain from "./NavMain";
import NavUser from "./NavUser";


import {
  Package,
  Users,
  BarChart3,
  Settings,
  SquareLibrary 
} from "lucide-react";
import { useAuth } from "@/hooks/useAdmin";



const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Alpha Media",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      isActive: true,
      noncollapsable: true
    },
    {
      title: "Manage Customers",
      url: "/customers",
      icon: Users,
      noncollapsable: true
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,

    },
    {
      title: "Transactions",
      url: "/transactions",
      icon:  ArrowRightLeftIcon,
      items: [
        { title: "All Transactions", url: "/transactions/all" },
        { title: "All Purchase", url: "/transactions/buy" },
        { title: "All Sells", url: "/transactions/sell" },
        { title: "All Expenses", url: "/transactions/expense" },
      ],
    },
    {
      title: "Report",
      url: "/report",
      icon: SquareLibrary,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "SMS Templates", url: "/settings/sms-templates" },
      ],
    },
  ],
};



const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: user } = useAuth();
  data.user.email = user.admin.email
  return (
    <Sidebar className="  opacity-100 md:opacity-100" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;