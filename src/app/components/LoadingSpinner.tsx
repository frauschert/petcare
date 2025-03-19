export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="text-emerald-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
