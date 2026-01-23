import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Plus,
  LayoutDashboard,
  Inbox,
  Users,
  Settings,
  ChevronDown,
  ListTodoIcon,
  BellRing,
  UserRound,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../assets/Logo.png";
import UserModal from "../modals/UserModal";
import ProjectModal from "../modals/ProjectModal";
import UserMenu from "./UserMenu";

export default function Layout({
  children,
  users = [],
  projects = [],
  onDataUpdate,
  onProjectSelect,
  selectedProject,
}) {
  // Local Theme Management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 1024,
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  // Sync theme with DOM and LocalStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAddMenuClick = (type) => {
    if (type === "user") setIsUserModalOpen(true);
    else if (type === "project") setIsProjectModalOpen(true);
    setShowAddMenu(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{
              x: 0,
              width: sidebarCollapsed ? 72 : 285,
            }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 dark:bg-neutral-900 dark:border-neutral-800 flex flex-col"
          >
            <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200 dark:border-neutral-800 shrink-0">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-8 h-8 rounded-lg object-contain"
                  />
                  <h1 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                    Ergo
                  </h1>
                </div>
              )}
              {sidebarCollapsed && (
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-7 h-7 rounded-lg object-contain mx-auto"
                />
              )}
              {!sidebarCollapsed && (
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="hidden lg:flex p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  <PanelLeftClose className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {sidebarCollapsed && (
              <div className="hidden lg:flex justify-center pt-4 pb-2">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  <PanelLeftOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}

            <div
              className={`px-4 py-4 relative ${sidebarCollapsed ? "flex justify-center" : ""}`}
            >
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className={`flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ${
                  sidebarCollapsed ? "w-10 h-10" : "w-full py-2.5"
                }`}
              >
                <Plus className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-semibold text-sm">Add New</span>
                )}
              </button>

              {showAddMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`absolute bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 z-50 ${
                      sidebarCollapsed
                        ? "left-14 top-2 w-56"
                        : "left-4 right-4 top-full mt-2"
                    }`}
                  >
                    <button
                      onClick={() => handleAddMenuClick("user")}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-neutral-700/50"
                    >
                      <UserRound className="w-4 h-4 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          Add User
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleAddMenuClick("project")}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-neutral-700/50"
                    >
                      <LayoutDashboard className="w-4 h-4 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          Add Project
                        </p>
                      </div>
                    </button>
                  </motion.div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAddMenu(false)}
                  />
                </>
              )}
            </div>

            <nav
              className={`flex-1 space-y-1 overflow-y-auto ${sidebarCollapsed ? "px-2" : "px-4"}`}
            >
              <NavItem
                icon={LayoutDashboard}
                label="Dashboard"
                active={activeItem === "Dashboard"}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveItem("Dashboard")}
              />
              <NavItem
                icon={Inbox}
                label="Inbox"
                badge={3}
                active={activeItem === "Inbox"}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveItem("Inbox")}
              />
              <NavItem
                icon={Users}
                label="Teams"
                active={activeItem === "Teams"}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveItem("Teams")}
              />
              <NavItem
                icon={Settings}
                label="Settings"
                active={activeItem === "Settings"}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveItem("Settings")}
              />

              {!sidebarCollapsed && (
                <div className="pt-6">
                  <button
                    onClick={() => setProjectsExpanded(!projectsExpanded)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg"
                  >
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Projects ({projects.length})
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transform transition-transform ${projectsExpanded ? "" : "-rotate-90"}`}
                    />
                  </button>
                  <AnimatePresence>
                    {projectsExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden space-y-1 mt-2"
                      >
                        {projects.map((p) => (
                          <ProjectItem
                            key={p.id}
                            name={p.name}
                            active={selectedProject?.id === p.id}
                            onClick={() => onProjectSelect(p)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 lg:hidden"
          >
            <Menu className="w-5 h-5 dark:text-gray-400" />
          </button>

          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg outline-none text-sm dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <BellRing className="w-5 h-5 text-gray-500" />
            <UserMenu onLogout={onDataUpdate} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={onDataUpdate}
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        users={users}
        onSuccess={onDataUpdate}
      />
    </div>
  );
}

function NavItem({ icon: Icon, label, badge, collapsed, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${active ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
      {badge && !collapsed && (
        <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
          {badge}
        </span>
      )}
    </button>
  );
}

function ProjectItem({ name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-blue-600" : "bg-gray-400"}`}
      />
      <span className="truncate">{name}</span>
    </button>
  );
}
