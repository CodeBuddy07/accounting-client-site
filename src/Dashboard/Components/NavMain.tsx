import { ChevronRight, type LucideIcon } from "lucide-react"
import { useLocation, Link } from "react-router-dom"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const NavMain = ({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    items?: { title: string; url: string }[]
  }[]
}) => {
  const location = useLocation();

  return (
    <SidebarMenu className="px-2">
      {items.map((item) => {
        const isActive = location.pathname === item.url || 
          (item.items && item.items.some(subItem => location.pathname === subItem.url));

        return item.items ? (
          <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={isActive ? "bg-primary text-white hover:text-white hover:bg-primary" : ""}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isSubActive = location.pathname === subItem.url;
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={subItem.url}
                            className={isSubActive ? "text-blue-500 font-semibold" : ""}
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className={isActive ? "bg-primary text-white hover:bg-primary hover:text-white" : ""}>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default NavMain;
