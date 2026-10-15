import { Link, useLoaderData } from "react-router";

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

export default function JobDetails() {
  const job = useLoaderData();

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Job not found</h2>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const {
    
    title,
    location,
    jobType,
    category,
    applicationDeadline,
    salaryRange,
    description,
    company,
    requirements = [],
    responsibilities = [],
    status,
    hr_email,
    hr_name,
    company_logo,
  } = job;

  const fmt = (n) => Number(n).toLocaleString("en-US");

  const deadlineDate = applicationDeadline ? new Date(applicationDeadline) : null;
  const isExpired = deadlineDate ? deadlineDate < new Date() : false;
  const deadline = deadlineDate
    ? deadlineDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const isActive = status === "active";

  return (
    <div className="bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to jobs
        </Link>

        {/* Header card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-pink-50 p-3 ring-1 ring-slate-200">
                <img
                  src={company_logo}
                  alt={`${company} logo`}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {title}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {isActive ? "Hiring" : "Closed"}
                  </span>
                </div>

                <p className="mt-1 text-slate-600">{company}</p>

                <div className="mt-3 flex flex-wrap gap-2">
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
                  <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {location}
                  </span>
                </div>
              </div>
            </div>

           <Link to={`/jobApply/${job._id}`}>
            <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
            Apply now
            </button>
           </Link>
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: main content */}
          <div className="space-y-8 lg:col-span-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                About this role
              </h2>
              <p className="leading-relaxed text-slate-600">{description}</p>
            </section>

            {responsibilities.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Responsibilities
                </h2>
                <ul className="space-y-3">
                  {responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {requirements.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Required skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {requirements.map((skill, i) => (
                    <span
                      key={i}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset ${
                        skillColors[i % skillColors.length]
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-6">
            {salaryRange && (
              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-lg shadow-indigo-200">
                <p className="text-sm font-medium text-indigo-100">Salary range</p>
                <p className="mt-1 text-2xl font-bold">
                  {fmt(salaryRange.min)} - {fmt(salaryRange.max)}
                </p>
                <p className="text-sm font-semibold text-indigo-100">
                  {salaryRange.currency?.toUpperCase()} / month
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Application deadline</p>
              <p
                className={`mt-1 text-lg font-bold ${
                  isExpired ? "text-rose-600" : "text-slate-900"
                }`}
              >
                {deadline}
              </p>
              {isExpired && (
                <p className="mt-1 text-sm font-medium text-rose-500">
                  This deadline has passed.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-slate-900">HR contact</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-lg font-bold text-white">
                  {hr_name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800">{hr_name}</p>
                  <a
                    href={`mailto:${hr_email}`}
                    className="block truncate text-sm text-indigo-600 hover:underline"
                  >
                    {hr_email}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}