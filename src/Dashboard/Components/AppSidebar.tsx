import {
    AudioWaveform,
    Command,
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
  ShoppingCart,
  Package,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Receipt,
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
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
      title: "Sales",
      url: "/sales",
      icon: ShoppingCart,
      items: [
        { title: "All Sales", url: "/sales" },
        { title: "New Sale", url: "/sales/add" },
      ],
    },
    {
      title: "Purchases",
      url: "/purchases",
      icon: CreditCard,
      items: [
        { title: "All Purchases", url: "/purchases" },
        { title: "New Purchase", url: "/purchases/add" },
      ],
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: Receipt,
      items: [
        { title: "All Expenses", url: "/expenses" },
        { title: "New Expense", url: "/expenses/add" },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Sales Report", url: "/reports/sales" },
        { title: "Profit & Loss", url: "/reports/profit-loss" },
        { title: "Stock Report", url: "/reports/stock" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Billing", url: "/settings/billing" },
      ],
    },
  ],
};


  
  const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const {data: user} = useAuth();
    data.user.email = user.admin.email
    return (
      <Sidebar collapsible="icon" {...props}>
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