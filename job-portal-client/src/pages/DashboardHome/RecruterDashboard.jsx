// Recruiter এর dashboard: কয়টা job, কয়জন apply করেছে, কোন status এ কয়জন, আর shortcut link।
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecureToken from "../../hooks/useAxiosSecureToken";

const API = "http://localhost:3000";

export default function RecruterDashboard() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecureToken();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // page খুললে সংখ্যা আর আমার job গুলো আনি
  useEffect(() => {
    if (!user?.email) return;
    const email = encodeURIComponent(user.email);

    Promise.all([
      fetch(`${API}/recruiter/stats?email=${email}`).then((res) => res.json()),
      // /jobs?email=... e ekhon token lage, tai axiosSecure
      axiosSecure.get(`/jobs?email=${email}`).then((res) => res.data),
    ])
      .then(([statsData, jobsData]) => {
        if (!statsData.error) setStats(statsData);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  if (loading) {
    return <p className="py-20 text-center text-gray-500">Loading...</p>;
  }

  const byStatus = stats?.byStatus || {};

  // উপরের card গুলো
  const cards = [
    { label: "My jobs", value: stats?.totalJobs ?? 0 },
    { label: "Total applicants", value: stats?.totalApplications ?? 0 },
    { label: "Pending", value: byStatus.pending ?? 0 },
    { label: "Shortlisted", value: byStatus.shortlisted ?? 0 },
    { label: "Interview", value: byStatus.interview ?? 0 },
    { label: "Hired", value: byStatus.hired ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h2>
            <p className="mt-1 text-gray-500">Manage your jobs and applicants.</p>
          </div>

          {/* shortcut button */}
          <div className="flex gap-3">
            <Link
              to="/addJob"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add Job
            </Link>
            <Link
              to="/myPostedJobs"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Posted Jobs
            </Link>
          </div>
        </div>

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

        {/* আমার job গুলো (সর্বোচ্চ ৫টা) */}
        <h3 className="mb-3 mt-10 text-lg font-semibold text-gray-900">My recent jobs</h3>
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-4">Job Title</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Applicants</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No jobs posted yet.
                  </td>
                </tr>
              ) : (
                jobs.slice(0, 5).map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 text-gray-600">{job.applicationDeadline}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {job.applicationCount ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/applications/${job._id}`}
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        View Applications
                      </Link>
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