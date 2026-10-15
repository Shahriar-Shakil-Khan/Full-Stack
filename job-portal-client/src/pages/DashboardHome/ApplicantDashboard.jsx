// Applicant এর dashboard: নিজের apply করা job, তার status, আর apply undo (withdraw)।
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecureToken from "../../hooks/useAxiosSecureToken";

const API = "http://localhost:3000";

// status এর রঙ
const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  shortlisted: "bg-violet-100 text-violet-700",
  interview: "bg-sky-100 text-sky-700",
  hired: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureToken();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // page খুললে আমার সব application আনি (সাথে job এর details আসে)
  useEffect(() => {
    if (!user?.email) return;
    // /applications e Firebase token lage, tai axiosSecure
    axiosSecure
      .get(`/applications?email=${encodeURIComponent(user.email)}`)
      .then((res) => {
        const data = res.data;
        setApplications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  // কোন status এ কয়টা
  const countOf = (status) =>
    applications.filter((app) => (app.status || "pending") === status).length;

  // Withdraw button এ click করলে apply undo হয়
  const handleWithdraw = (id) => {
    Swal.fire({
      title: "Withdraw this application?",
      text: "Your application will be removed. You can apply again later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, withdraw",
    }).then((result) => {
      if (!result.isConfirmed) return;

      fetch(`${API}/applications/${id}?email=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
        credentials: "include", // cookie পাঠানোর জন্য
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            // list থেকে সাথে সাথে সরিয়ে দিই
            setApplications((prev) => prev.filter((app) => app._id !== id));
            Swal.fire({
              icon: "success",
              title: "Application withdrawn",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({ icon: "error", title: data.error || "Could not withdraw" });
          }
        })
        .catch(() => Swal.fire({ icon: "error", title: "Server error" }));
    });
  };

  // উপরের card গুলো
  const cards = [
    { label: "Total applied", value: applications.length },
    { label: "Pending", value: countOf("pending") },
    { label: "Shortlisted", value: countOf("shortlisted") },
    { label: "Interview", value: countOf("interview") },
    { label: "Hired", value: countOf("hired") },
    { label: "Rejected", value: countOf("rejected") },
  ];

  if (loading) {
    return <p className="py-20 text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-900">My Dashboard</h2>
        <p className="mt-1 text-gray-500">Track the jobs you have applied for.</p>

        {/* সংখ্যার card */}
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

        {/* application list */}
        <div className="mt-8 space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <p className="text-lg font-semibold text-gray-800">
                You have not applied to any job yet
              </p>
              <Link
                to="/"
                className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Browse jobs
              </Link>
            </div>
          ) : (
            applications.map((app) => {
              const status = app.status || "pending";
              const job = app.job;

              return (
                <div
                  key={app._id}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 md:flex-row md:items-center md:justify-between"
                >
                  {/* বামে: job আর company */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2 ring-1 ring-gray-200">
                      {job?.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={`${job.company} logo`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-indigo-600">
                          {job?.company?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {job?.title || "Job no longer available"}
                      </h3>
                      <p className="text-sm font-medium text-indigo-600">
                        {job?.company || "Unknown company"}
                      </p>
                    </div>
                  </div>

                  {/* ডানে: status আর action */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusColors[status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {status}
                    </span>

                    {job && (
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        View job
                      </Link>
                    )}

                    {/* hired হলে withdraw করা যাবে না */}
                    <button
                      type="button"
                      disabled={status === "hired"}
                      onClick={() => handleWithdraw(app._id)}
                      className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}