import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
            👤
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {user?.username || "Guest User"}
            </h1>
            <p className="text-gray-400">Quiz Enthusiast</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Stat title="Quizzes" value="0" />
          <Stat title="Accuracy" value="0%" />
          <Stat title="Streak" value="0 days" />
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-400">
            No quiz activity yet.
          </p>
        </div>

      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
