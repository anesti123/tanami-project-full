import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/router";

let socket: any;

export default function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }
    socket = io("http://localhost:4000");
    socket.on("new_activity", (activity: any) => {
      setActivities((prev) => [activity, ...prev]);
    });

    axios
      .get("http://localhost:4000/api/activity", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setActivities(res.data));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const postActivity = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/activity",
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setContent("");
    } catch (err) {
      alert("Error posting activity");
    }
  };

  const deleteActivity = async (id: number) => {
    if (!id) {
      alert("Invalid activity ID");
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/activity/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    } catch (err) {
      alert("Error deleting activity");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold mb-4">Trading Activity Feed</h1>
      <div className="flex space-x-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter trade action (e.g. 'Bought 100 shares of TSLA')"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={postActivity}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Post
        </button>
      </div>

      <ul className="space-y-3">
        {activities.map((act) => (
          <li
            key={act.id}
            className="flex items-center space-x-4 p-3 border rounded hover:bg-gray-100"
          >
            <div className="text-green-500 font-bold">📈</div>
            <div>
              <p className="text-gray-800">{act.content}</p>
              <p className="text-gray-400 text-xs">
                {new Date(act.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => deleteActivity(act.id)}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
