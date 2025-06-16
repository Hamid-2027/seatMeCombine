export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="mt-2 text-blue-700 font-semibold">Loading...</span>
    </div>
  );
}
