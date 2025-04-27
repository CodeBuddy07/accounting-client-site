import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSidebar from "./Components/AppSidebar";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "./Components/ModeToggler";
import FloatingActions from "./Components/FloatingActionButtons";



const MainLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex justify-between items-center gap-2 px-5 w-full">
                        <div className="flex justify-center items-center gap-5">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet />
                    <FloatingActions />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default MainLayout;