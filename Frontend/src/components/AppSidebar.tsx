import { NavLink, useLocation , useNavigate } from "react-router-dom";
import { BarChart3, Home , LogOut } from "lucide-react";
import { portfolios } from "@/data/PortfolioList";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

   const handleLogout = () => {
    localStorage.removeItem("isAuth")
    navigate("/") // back to login page
  }

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Portfolio
            </h2>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Total Portfolio Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    isActive("/home")
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "hover:bg-sidebar-accent/50"
                  }
                >
                  <NavLink to="/home" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Total Management</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Individual Portfolios */}
        <SidebarGroup>
          <SidebarGroupLabel>Portfolios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {portfolios.map((portfolio) => (
                <SidebarMenuItem key={portfolio.id}>
                  <SidebarMenuButton
                    asChild
                    className={
                      isActive(portfolio.path)
                        ? "bg-sidebar-accent text-sidebar-primary font-medium"
                        : "hover:bg-sidebar-accent/50"
                    }
                  >
                    <NavLink
                      to={portfolio.path}
                      className="flex items-center space-x-2"
                    >
                      <portfolio.icon className="h-4 w-4" />
                      {!collapsed && <span>{portfolio.value}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button at bottom */}
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className={`${collapsed ? "bg-transparent text-green-500 hover:bg-green-600/20" : "bg-green-600 text-white hover:bg-green-700"} w-full flex items-center justify-center space-x-2 rounded-md py-2  text-sm font-semibold transition`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
