export default function LoadingSkeleton() {
  return (
    <div className="flex gap-6 p-6 h-full overflow-hidden bg-white dark:bg-black transition-colors">
      {[1, 2, 3].map((col) => (
        <div key={col} className="w-80 space-y-3 shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-6 w-8 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          </div>

          {/* Cards */}
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg"
            >
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}

          {/* Dash Placeholder */}
          <div className="w-full h-12 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
}