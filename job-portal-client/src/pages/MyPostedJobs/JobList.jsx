// HR এর post করা job গুলোর table (title, deadline, কয়জন apply করেছে, Edit / Delete / View Applications)
import { use, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";

export default function JobList({ jobsCreateByPromise }) {
  // promise থেকে job গুলো নিই
  const initialJobs = use(jobsCreateByPromise);
  // delete করলে table থেকে সাথে সাথে সরানোর জন্য state এ রাখি
  const [jobs, setJobs] = useState(initialJobs);

  // Delete button এ click করলে এই function চলবে
  const handleDelete = (id) => {
    // আগে জিজ্ঞেস করি, ভুল করে delete হয়ে গেলে ফেরত আসে না
    Swal.fire({
      title: "Delete this job?",
      text: "This job and all its applications will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (!result.isConfirmed) return;

      fetch(`http://localhost:3000/jobs/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            // table থেকে ওই job টা সরিয়ে দিই
            setJobs((prev) => prev.filter((job) => job._id !== id));
            Swal.fire({
              icon: "success",
              title: "Job deleted",
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({ icon: "error", title: data.error || "Job not found" });
          }
        })
        .catch(() => {
          Swal.fire({ icon: "error", title: "Server error" });
        });
    });
  };

  return (
    <div>
      {/* heading এর সাথে মোট job সংখ্যা */}
      <h2 className="text-3xl font-bold text-gray-900">
        My Posted Jobs: {jobs.length}
      </h2>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <table className="w-full text-left text-sm">
          {/* table head */}
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4">Job Title</th>
              <th className="px-6 py-4">Deadline</th>
              <th className="px-6 py-4">Application Count</th>
              <th className="px-6 py-4">Applications</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {/* কোনো job না থাকলে এই message */}
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No jobs posted yet.
                </td>
              </tr>
            ) : (
              jobs.map((job, index) => (
                <tr key={job._id} className="transition hover:bg-gray-50">
                  <th className="px-6 py-4 font-medium text-gray-500">
                    {index + 1}
                  </th>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {job.applicationDeadline}
                  </td>
                  {/* কয়জন apply করেছে (backend থেকে applicationCount আসে) */}
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                      {job.applicationCount ?? 0}
                    </span>
                  </td>
                  {/* এই job এর application দেখার link */}
                  <td className="px-6 py-4">
                    <Link
                      to={`/applications/${job._id}`}
                      className="font-semibold text-indigo-600 underline-offset-4 hover:underline"
                    >
                      View Applications
                    </Link>
                  </td>
                  {/* Edit আর Delete */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/updateJob/${job._id}`}
                        className="font-semibold text-sky-600 underline-offset-4 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(job._id)}
                        className="font-semibold text-rose-600 underline-offset-4 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}