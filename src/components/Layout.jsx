import { useState } from "react";
import {
  Menu, X, Plus, LayoutDashboard, Inbox, Users, Settings, ChevronDown,
  ListTodoIcon, BellRing, UserRound, HelpCircle, PanelLeftClose, PanelLeftOpen
} from 'lucide-react'
import { motion, AnimatePresence } from "motion/react";
import Logo from "../../assets/Logo.png";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{
              x: 0,
              width: sidebarCollapsed ? 80 : 256,
            }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <img
                    src={Logo}
                    alt="TaskBoard Logo"
                    className="w-8 h-8 rounded-lg object-contain"
                  />
                  <span className="font-semibold text-gray-900">TaskBoard</span>
                </motion.div>
              )}

              {sidebarCollapsed && (
                <img
                  src={Logo}
                  alt="TaskBoard"
                  className="w-8 h-8 rounded-lg object-contain mx-auto"
                />
              )}

              {/* Desktop Collapse Button - Top Right */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="w-5 h-5 text-gray-600" />
                ) : (
                  <PanelLeftClose className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Add New Button */}
            <div className={`px-4 py-4 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
              <button
                className={`flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  sidebarCollapsed
                    ? 'w-10 h-10 p-0'
                    : 'w-full py-2.5'
                }`}
              >
                <Plus className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    Add New
                  </motion.span>
                )}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              <NavItem
                icon={LayoutDashboard}
                label="Dashboard"
                collapsed={sidebarCollapsed}
              />
              <NavItem
                icon={Inbox}
                label="Inbox"
                badge={3}
                collapsed={sidebarCollapsed}
              />
              <NavItem
                icon={Users}
                label="Teams"
                collapsed={sidebarCollapsed}
              />
              <NavItem
                icon={Settings}
                label="Settings"
                collapsed={sidebarCollapsed}
              />

              {/* Projects Section */}
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-6"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Projects
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <ProjectItem name="Design Project" active />
                  <ProjectItem name="Carl UI/UX" />
                  <ProjectItem name="Hajime Illustrations" />
                </motion.div>
              )}
            </nav>

            {/* Invite Team & Help Footer */}
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 border-t border-gray-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Invite Team
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Collapsed Footer Icons */}
            {sidebarCollapsed && (
              <div className="hidden lg:flex flex-col items-center gap-2 p-4 border-t border-gray-200">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Invite Team"
                >
                  <Users className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Help"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          {/* Left: Mobile Menu Only */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center px-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg w-full max-w-md border border-gray-300/60 text-lg">
              <input
                type="text"
                placeholder="Search Task..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ListTodoIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <BellRing className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <UserRound className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

// Nav Item Component
function NavItem({ icon: Icon, label, badge, collapsed }) {
  return (
    <button
      className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg group"
      title={collapsed ? label : ""}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-medium"
          >
            {label}
          </motion.span>
        )}
      </div>
      {badge && !collapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full"
        >
          {badge}
        </motion.span>
      )}
    </button>
  );
}

// Project Item Component
function ProjectItem({ name, active }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
        active
          ? "bg-blue-50 text-blue-600 font-medium"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{name}</span>
    </button>
  );
}
