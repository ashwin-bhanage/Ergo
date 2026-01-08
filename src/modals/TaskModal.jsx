import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, User, Flag, Book } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { taskAPI } from "../services/api.js";

export default function TaskModal({
  isOpen,
  onClose,
  task,
  users,
  projects,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    user_id: "",
    project_id: "",
    title: "",
    description: "",
    status: "pending",
    priority: "Normal",
    due_date: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        user_id: task.user_id || "",
        project_id: task.project_id || "",
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        priority: task.priority || "Normal",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      });
    } else {
      setFormData({
        user_id: "",
        project_id: projects?.[0]?.id || "",
        title: "",
        description: "",
        status: "pending",
        priority: "Normal",
        due_date: "",
      });
    }
    setErrors({});
  }, [task, projects, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.user_id) newErrors.user_id = 'Please assign a user';
    if (!formData.project_id) newErrors.project_id = 'Please select a project';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        user_id: parseInt(formData.user_id),
        project_id: parseInt(formData.project_id),
        due_date: formData.due_date ? `${formData.due_date}T00:00:00` : null,
      };

      if (task) {
        await taskAPI.update(task.id, submitData);
      } else {
        await taskAPI.create(submitData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
      setErrors({ submit: error.message || "Failed to save task" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {task ? "Edit Task" : "Create New Task"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <form
                onSubmit={handleSubmit}
                className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter task title..."
                    className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Add task description..."
                    rows={3}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Row: Assignee & Project - Stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Assignee
                    </label>
                    <select
                      value={formData.user_id}
                      onChange={(e) => handleChange("user_id", e.target.value)}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                        errors.user_id ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select user...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                    {errors.user_id && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.user_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      <Book className="w-4 h-4 inline mr-1" />
                      Project
                    </label>
                    <select
                      value={formData.project_id}
                      onChange={(e) => handleChange("project_id", e.target.value)}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                        errors.project_id ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select project...</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row: Status, Priority, Due Date - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      <Flag className="w-4 h-4 inline mr-1" />
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => handleChange("due_date", e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}
              </form>

              {/* Modal Footer - Stacked buttons on mobile */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 bg-gray-50 gap-3 shrink-0">
                <div className="flex justify-center sm:justify-start">
                  {task && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this task?")) {
                          try {
                            await taskAPI.delete(task.id);
                            onSuccess();
                            onClose();
                          } catch (error) {
                            console.error("Failed to delete task:", error);
                          }
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete Task
                    </button>
                  )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
