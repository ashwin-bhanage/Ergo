// 1. ENSURE BROWSERROUTER IS IN THIS LIST
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import KanbanBoard from "./components/KanbanBoard";
import { userAPI, projectAPI } from "./services/api";
import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/next"

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const fetchData = async () => {
    if (!isAuthenticated) return;
    try {
      const [usersData, projectsData] = await Promise.all([
        userAPI.getAll(),
        projectAPI.getAll(),
      ]);
      setUsers(usersData);
      setProjects(projectsData);
      if (!selectedProject && projectsData.length > 0) {
        setSelectedProject(projectsData[0]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, refreshTrigger]);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            users={users}
            projects={projects}
            selectedProject={selectedProject}
            onProjectSelect={(p) => setSelectedProject(p)}
            onDataUpdate={() => setRefreshTrigger(prev => prev + 1)}
          >
            <KanbanBoard selectedProject={selectedProject} onDataUpdate={() => setRefreshTrigger(prev => prev + 1)} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// 2. WRAP WITH BROWSERROUTER HERE
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Analytics />
      </AuthProvider>
    </BrowserRouter>
  );
}

// 3. MUST HAVE THIS DEFAULT EXPORT
export default App;