import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
        <h1 className="text-5xl font-bold mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Forbidden</h2>
        <p className="text-gray-600 mb-6">
          You need to login first to access this page.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 background-dark text-white rounded-lg"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
