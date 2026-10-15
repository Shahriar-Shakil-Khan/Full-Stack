import { Link } from "react-router";

const skillColors = [
  "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "bg-amber-50 text-amber-700 ring-amber-200",
  "bg-rose-50 text-rose-700 ring-rose-200",
  "bg-sky-50 text-sky-700 ring-sky-200",
  "bg-violet-50 text-violet-700 ring-violet-200",
];

const typeColors = {
  Remote: "bg-emerald-100 text-emerald-700",
  Hybrid: "bg-violet-100 text-violet-700",
  Onsite: "bg-sky-100 text-sky-700",
  "On-site": "bg-sky-100 text-sky-700",
};

export default function JobCard({ job }) {
  const {
    _id,
    title,
    location,
    jobType,
    category,
    applicationDeadline,
    salaryRange,
    description,
    company,
    requirements = [],
    status,
    company_logo,
  } = job;

  const fmt = (n) => Number(n).toLocaleString("en-US");

  const deadlineDate = applicationDeadline ? new Date(applicationDeadline) : null;
  const isExpired = deadlineDate ? deadlineDate < new Date() : false;
  const deadline = deadlineDate
    ? deadlineDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Header: logo + company + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 p-2 ring-1 ring-slate-200">
              <img
                src={company_logo}
                alt={`${company} logo`}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{company}</h3>
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <svg
                  className="h-4 w-4 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                {location}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              status === "active"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                status === "active" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {status === "active" ? "Hiring" : "Closed"}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
            {title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                typeColors[jobType] || "bg-slate-100 text-slate-700"
              }`}
            >
              {jobType}
            </span>
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
              {category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>

        {/* Skills */}
        {requirements.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {requirements.map((skill, i) => (
              <span
                key={i}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                  skillColors[i % skillColors.length]
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Salary */}
        {salaryRange && (
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">Salary range</p>
            <p className="text-lg font-bold text-indigo-700">
              {fmt(salaryRange.min)} - {fmt(salaryRange.max)}{" "}
              <span className="text-sm font-semibold text-indigo-500">
                {salaryRange.currency?.toUpperCase()}
              </span>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">Apply before</p>
            <p
              className={`text-sm font-semibold ${
                isExpired ? "text-rose-600" : "text-slate-700"
              }`}
            >
              {deadline}
              {isExpired && " (expired)"}
            </p>
          </div>

          <Link
            to={`/jobs/${_id}`}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}