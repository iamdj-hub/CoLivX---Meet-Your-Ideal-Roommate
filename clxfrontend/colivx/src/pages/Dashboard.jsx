import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔐 Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        setUser({ ...currentUser });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* 🔷 NAVBAR */}
      <nav className="bg-gray-50 shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">
          CoLivX Dashboard
        </h2>

        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          Logout
        </button>
      </nav>

      {/* 🔷 MAIN LAYOUT */}
      <div className="flex-1 flex pt-4 px-6">
        <div className="flex w-full gap-6">

          {/* 🧭 SIDEBAR */}
          <aside className="w-64 bg-white rounded-2xl shadow-md p-6 flex flex-col">
            <h4 className="text-gray-700 font-semibold mb-6">Menu</h4>

            <ul className="space-y-3 text-gray-700">

              <li
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                🏠 Dashboard
              </li>

              <li
                onClick={() => navigate("/dashboard/roommates")}
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                👥 Roommates
              </li>

              <li
                onClick={() => navigate("/dashboard/browse")}
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                🏠 Browse Rooms
              </li>

              <li
                onClick={() => navigate("/dashboard/profile")}
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                👤 Profile
              </li>

              <li
                onClick={() => navigate("/dashboard/roommates")}
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                ⭐ Matches
              </li>

            </ul>

            <div className="mt-auto pt-6 border-t text-sm text-gray-400">
              © 2026 CoLivX
            </div>
          </aside>

          {/* 🟣 MAIN CONTENT */}
          <main className="flex-1 bg-gradient-to-br from-blue-200 via-purple-100 to-pink-50 rounded-2xl p-10 min-h-[85vh]">

            {/* 🔥 THIS IS THE KEY */}
            <Outlet />

          </main>

        </div>
      </div>
    </div>
  );
}