// Admin dashboard: কে applicant হবে, কে recruiter হবে, কাকে block করা হবে সেটা এখান থেকে ঠিক হয়।
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const API = "http://localhost:3000";

// role এর রঙ
const roleColors = {
  pending: "bg-amber-100 text-amber-700",
  applicant: "bg-sky-100 text-sky-700",
  recruiter: "bg-violet-100 text-violet-700",
  blocked: "bg-rose-100 text-rose-700",
  admin: "bg-emerald-100 text-emerald-700",
};

// উপরের filter tab গুলো
const tabs = ["pending", "applicant", "recruiter", "blocked", "all"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // শুরুতে pending দেখাই, কারণ admin এর আসল কাজ approve করা
  const [tab, setTab] = useState("pending");

  // page খুললে user list আর মোট সংখ্যা আনি
  useEffect(() => {
    if (!user?.email) return;
    const adminEmail = encodeURIComponent(user.email);

    Promise.all([
      fetch(`${API}/users?adminEmail=${adminEmail}`).then((res) => res.json()),
      fetch(`${API}/admin/stats?adminEmail=${adminEmail}`).then((res) => res.json()),
    ])
      .then(([usersData, statsData]) => {
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          setError(usersData.error || "Could not load users");
        }
        if (!statsData.error) setStats(statsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Server error");
        setLoading(false);
      });
  }, [user?.email]);

  // button এ click করলে role বদলায়
  const changeRole = (id, role) => {
    fetch(`${API}/users/${id}/role`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role, adminEmail: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // list এ ওই user এর role সাথে সাথে বদলে দিই
          setUsers((prev) =>
            prev.map((item) => (item._id === id ? { ...item, role } : item))
          );
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Role changed to ${role}`,
            showConfirmButton: false,
            timer: 1200,
          });
        } else {
          Swal.fire({ icon: "error", title: data.error || "Could not change role" });
        }
      })
      .catch(() => Swal.fire({ icon: "error", title: "Server error" }));
  };

  // role অনুযায়ী কয়জন
  const countOf = (role) => users.filter((item) => item.role === role).length;

  // tab অনুযায়ী যাদের দেখাব
  const visibleUsers =
    tab === "all" ? users : users.filter((item) => item.role === tab);

  // উপরের card গুলো
  const cards = [
    { label: "Total users", value: stats.users },
    { label: "Waiting approval", value: countOf("pending") },
    { label: "Applicants", value: countOf("applicant") },
    { label: "Recruiters", value: countOf("recruiter") },
    { label: "Jobs", value: stats.jobs },
    { label: "Applications", value: stats.applications },
  ];

  if (loading) {
    return <p className="py-20 text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="py-20 text-center text-rose-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="mt-1 text-gray-500">
          Approve new users as applicants or recruiters.
        </p>

        {/* মোট সংখ্যার card */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200"
            >
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        {/* filter tab */}
        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
                tab === name
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* user table */}
        <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No users here.
                  </td>
                </tr>
              ) : (
                visibleUsers.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          roleColors[item.role] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {item.role === "admin" ? (
                        <span className="text-xs text-gray-400">Admin</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={item.role === "applicant"}
                            onClick={() => changeRole(item._id, "applicant")}
                            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Applicant
                          </button>
                          <button
                            type="button"
                            disabled={item.role === "recruiter"}
                            onClick={() => changeRole(item._id, "recruiter")}
                            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Recruiter
                          </button>
                          <button
                            type="button"
                            disabled={item.role === "blocked"}
                            onClick={() => changeRole(item._id, "blocked")}
                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Block
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}