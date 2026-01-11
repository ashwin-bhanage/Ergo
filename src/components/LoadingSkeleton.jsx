import { useTheme } from "../context/ThemeContext";

export default function LoadingSkeleton() {
  const { isDarkMode } = useTheme();

  // Color constants for better maintenance
  const bgColor = isDarkMode ? "bg-neutral-800" : "bg-gray-200";
  const cardBg = isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-gray-200";

  return (
    <div className="flex gap-6 p-6 h-full overflow-hidden">
      {[1, 2, 3].map((col) => (
        <div key={col} className="w-80 space-y-3 shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`h-6 w-32 ${bgColor} rounded animate-pulse`} />
            <div className={`h-6 w-8 ${bgColor} rounded-full animate-pulse`} />
          </div>

          {/* Cards */}
          {[1, 2, 3].map((card) => (
            <div key={card} className={`${cardBg} p-4 rounded-lg border`}>
              <div className={`h-5 ${bgColor} rounded animate-pulse mb-3`} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${bgColor} rounded-full animate-pulse`} />
                  <div className={`h-3 w-16 ${bgColor} rounded animate-pulse`} />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-12 ${bgColor} rounded animate-pulse`} />
                  <div className={`h-6 w-14 ${bgColor} rounded animate-pulse`} />
                </div>
              </div>
            </div>
          ))}

          {/* Dash Placeholder */}
          <div className={`w-full h-12 ${cardBg} rounded-lg border-2 border-dashed animate-pulse`} />
        </div>
      ))}
    </div>
  );
}
