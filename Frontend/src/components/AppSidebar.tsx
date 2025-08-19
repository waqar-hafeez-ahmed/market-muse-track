import { NavLink, useLocation } from "react-router-dom"
import { BarChart3, TrendingUp, Briefcase, PieChart, Target, Zap, Home } from "lucide-react"

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
} from "@/components/ui/sidebar"

const portfolios = [
  { id: 1, value: "$60K", icon: TrendingUp, path: "/portfolio/1" },
  { id: 2, value: "$40K", icon: Briefcase, path: "/portfolio/2" },
  { id: 3, value: "$25K", icon: Zap, path: "/portfolio/3" },
  { id: 4, value: "$11K", icon: PieChart, path: "/portfolio/4" },
  { id: 5, value: "$1K", icon: Target, path: "/portfolio/5" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Portfolio</h2>
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
                  className={isActive("/") ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50"}
                >
                  <NavLink to="/" className="flex items-center space-x-2">
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
                    className={isActive(portfolio.path) ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50"}
                  >
                    <NavLink to={portfolio.path} className="flex items-center space-x-2">
                      <portfolio.icon className="h-4 w-4" />
                      {!collapsed && <span>{portfolio.value}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}