// একটা job এ কারা কারা apply করেছে তাদের list আর status update এর page।
// বামে job card, ডানে applicant রা (status dropdown + Send button সহ)।
import { useEffect, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import Swal from "sweetalert2"; // npm install sweetalert2
import JobCard from "../shared/JobCard"; // <-- তোমার JobCard.jsx যেখানে আছে সেই path দাও

// এই field গুলো আলাদা করে দেখানোর দরকার নেই (internal data)
const hiddenFields = ["_id", "jobId", "job_id", "job", "status"];

// status এর list আর তাদের রঙ
const statusOptions = ["pending", "interview", "hired", "rejected"];
const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  interview: "bg-sky-100 text-sky-700",
  hired: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

// ---------- একটা applicant এর card ----------
function ApplicantCard({ application, index }) {
  // database এ যে status আছে (না থাকলে pending)
  const [savedStatus, setSavedStatus] = useState(application.status || "pending");
  // dropdown এ এখন যেটা select করা আছে
  const [selected, setSelected] = useState(application.status || "pending");
  // Send চলার সময় button বন্ধ রাখার জন্য
  const [sending, setSending] = useState(false);

  // Send button এ click করলে এই function চলবে
  const handleSend = () => {
    setSending(true);

    fetch(`http://localhost:3000/applications/${application._id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: selected }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSending(false);

        if (data.success) {
          // status badge নতুন status এ বদলে দিই
          setSavedStatus(selected);

          if (data.emailSent) {
            // ইমেইল গেছে
            Swal.fire({
              icon: "success",
              title: "Status updated and email sent",
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            // status save হয়েছে কিন্তু ইমেইল যায়নি (কারণটাও দেখাই)
            Swal.fire({
              icon: "warning",
              title: "Status updated, but email could not be sent",
              text: data.emailError || "",
            });
          }
        } else {
          Swal.fire({ icon: "error", title: data.error || "Something went wrong" });
        }
      })
      .catch(() => {
        setSending(false);
        Swal.fire({ icon: "error", title: "Server error" });
      });
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      {/* উপরে: applicant নম্বর আর এখনকার status */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-indigo-600">
          Applicant #{index + 1}
        </p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            statusColors[savedStatus] || "bg-gray-100 text-gray-700"
          }`}
        >
          {savedStatus}
        </span>
      </div>

      {/* application এর সব field (email, link ইত্যাদি) নিজে থেকেই দেখায় */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.entries(application)
          .filter(
            ([key, value]) =>
              !hiddenFields.includes(key) && value && typeof value !== "object"
          )
          .map(([key, value]) => (
            <div key={key} className="rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-xs font-medium text-gray-500">{key}</p>
              <p className="break-all text-sm text-gray-800">{String(value)}</p>
            </div>
          ))}
      </div>

      {/* নিচে: status select করে Send করার জায়গা */}
      <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm capitalize text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:flex-1"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// ---------- মূল page ----------
export default function ViewApplications() {
  const { job_id } = useParams();

  // router এর loader থেকে এই job এর application গুলো আসে
  const data = useLoaderData();
  const applications = Array.isArray(data) ? data : [];

  // job card দেখানোর জন্য job এর details
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/jobs/${job_id}`)
      .then((res) => res.json())
      .then((result) => setJob(result))
      .catch(() => setJob(null));
  }, [job_id]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* back link */}
        <Link
          to="/myPostedJobs"
          className="mb-6 inline-block text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
        >
          ← Back to My Posted Jobs
        </Link>

        {/* heading: job এর title আর মোট applicant সংখ্যা */}
        <h2 className="text-3xl font-bold text-gray-900">
          Applications for {job?.title || "this job"}
        </h2>
        <p className="mb-8 mt-1 text-gray-500">
          Total Applicants:{" "}
          <span className="font-semibold text-indigo-600">
            {applications.length}
          </span>
        </p>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* বামে: job card */}
          <div>
            {job && job._id ? (
              <JobCard job={job} />
            ) : (
              <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 ring-1 ring-gray-200">
                Job details not available.
              </p>
            )}
          </div>

          {/* ডানে: applicant দের list */}
          <div className="space-y-4 lg:col-span-2">
            {/* কেউ apply না করলে এই message */}
            {applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <p className="text-lg font-semibold text-gray-800">
                  No applications yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  When someone applies, they will appear here.
                </p>
              </div>
            ) : (
              applications.map((application, index) => (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}