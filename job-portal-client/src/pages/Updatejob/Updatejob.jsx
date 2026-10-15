// job update করার form page। আগের তথ্য দিয়ে form ভরা থাকে, HR বদলে Save করে।
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

// input আর label এর Tailwind style (AddJob এর মতোই)
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";

export default function UpdateJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  // যে job টা edit হবে সেটার তথ্য
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // page খুললে job এর আগের তথ্য আনি
  useEffect(() => {
    fetch(`http://localhost:3000/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // form submit হলে এই function চলবে
  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const initialData = Object.fromEntries(formData.entries());

    // salary field গুলো একসাথে একটা object বানাই
    const { min, max, currency, ...updatedJob } = initialData;
    updatedJob.salaryRange = { min, max, currency };

    // requirements: new line বা comma দিয়ে আলাদা skill (ফাঁকা বাদ)
    updatedJob.requirements = updatedJob.requirements
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    // responsibilities: শুধু new line দিয়ে আলাদা (ফাঁকা বাদ)
    updatedJob.responsibilities = updatedJob.responsibilities
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setSaving(true);

    fetch(`http://localhost:3000/jobs/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updatedJob),
    })
      .then((res) => res.json())
      .then((data) => {
        setSaving(false);
        // matchedCount > 0 মানে job পাওয়া গেছে (কিছু না বদলালেও ঠিক আছে)
        if (data.matchedCount > 0) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Job has been updated.",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate("/myPostedJobs");
        } else {
          Swal.fire({ icon: "error", title: data.error || "Job not found" });
        }
      })
      .catch(() => {
        setSaving(false);
        Swal.fire({ icon: "error", title: "Server error" });
      });
  };

  // loading অবস্থায়
  if (loading) {
    return <p className="py-20 text-center text-gray-500">Loading...</p>;
  }

  // job না পাওয়া গেলে
  if (!job || !job._id) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">Job not found.</p>
        <Link to="/myPostedJobs" className="mt-3 inline-block font-semibold text-indigo-600">
          ← Back to My Posted Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* back link */}
        <Link
          to="/myPostedJobs"
          className="mb-6 inline-block text-sm font-semibold text-gray-600 transition hover:text-indigo-600"
        >
          ← Back to My Posted Jobs
        </Link>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Update Job</h2>
          <p className="mt-2 text-gray-500">Change the details below and save.</p>
        </div>

        {/* key দিয়েছি যাতে job লোড হলে defaultValue গুলো ঠিকমতো বসে */}
        <form key={job._id} onSubmit={handleUpdate} className="space-y-6">
          {/* ---------- Basic info ---------- */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-8">
            <h3 className="mb-5 text-lg font-semibold text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Job Title</label>
                <input type="text" name="title" defaultValue={job.title} className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Job Location</label>
                <input type="text" name="location" defaultValue={job.location} className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Job Type</label>
                <select name="jobType" defaultValue={job.jobType || ""} className={inputClass} required>
                  <option value="" disabled>Pick a Job type</option>
                  <option>Full-time</option>
                  <option>Intern</option>
                  <option>Part-time</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Job Field</label>
                <select name="category" defaultValue={job.category || ""} className={inputClass} required>
                  <option value="" disabled>Pick a Job Field</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Teaching</option>
                </select>
              </div>
            </div>

            {/* salary range */}
            <div className="mt-5">
              <label className={labelClass}>Salary Range</label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input type="text" name="min" defaultValue={job.salaryRange?.min} placeholder="Min" className={inputClass} required />
                <input type="text" name="max" defaultValue={job.salaryRange?.max} placeholder="Max" className={inputClass} required />
                <select name="currency" defaultValue={job.salaryRange?.currency || ""} className={inputClass} required>
                  <option value="" disabled>Currency</option>
                  <option>BDT</option>
                  <option>USD</option>
                  <option>INR</option>
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-5">
              <label className={labelClass}>Job Description</label>
              <textarea rows="4" name="description" defaultValue={job.description} className={inputClass} required></textarea>
            </div>
          </div>

          {/* ---------- Requirements & responsibilities ---------- */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-8">
            <h3 className="mb-5 text-lg font-semibold text-gray-900">Requirements & Responsibilities</h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* database এ array থাকে, textarea তে প্রতি লাইনে একটা করে দেখাই */}
              <div>
                <label className={labelClass}>Job Requirements</label>
                <textarea
                  rows="6"
                  name="requirements"
                  defaultValue={Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements}
                  placeholder="Each skill in a new line (or separate with comma)"
                  className={inputClass}
                  required
                ></textarea>
              </div>

              <div>
                <label className={labelClass}>Job Responsibilities</label>
                <textarea
                  rows="6"
                  name="responsibilities"
                  defaultValue={Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : job.responsibilities}
                  placeholder="Write each responsibility in a new line"
                  className={inputClass}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* ---------- Company & HR ---------- */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-8">
            <h3 className="mb-5 text-lg font-semibold text-gray-900">Company & Contact</h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Company Name</label>
                <input type="text" name="company" defaultValue={job.company} className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Company Logo URL</label>
                <input type="text" name="company_logo" defaultValue={job.company_logo} className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>HR Name</label>
                <input type="text" name="hr_name" defaultValue={job.hr_name} className={inputClass} required />
              </div>

              {/* HR Email বদলানো যাবে না, বদলালে job টা My Posted Jobs থেকে হারিয়ে যাবে */}
              <div>
                <label className={labelClass}>HR Email</label>
                <input
                  type="text"
                  name="hr_email"
                  defaultValue={job.hr_email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed bg-gray-100`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Deadline</label>
                <input type="date" name="applicationDeadline" defaultValue={job.applicationDeadline} className={inputClass} required />
              </div>
            </div>
          </div>

          {/* save button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-indigo-600 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}