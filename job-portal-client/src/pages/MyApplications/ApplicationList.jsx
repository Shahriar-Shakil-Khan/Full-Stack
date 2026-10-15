

import { use } from "react";
import { Link } from "react-router";

const typeColors = {
  Remote: "bg-emerald-100 text-emerald-700",
  Hybrid: "bg-violet-100 text-violet-700",
  "Full-Time": "bg-sky-100 text-sky-700",
  "Part-Time": "bg-amber-100 text-amber-700",
  Contractual: "bg-rose-100 text-rose-700",
  Intern: "bg-pink-100 text-pink-700",
};

const fmt = (n) => Number(n).toLocaleString("en-US");

export default function ApplicationList({ myApplicationsPromise }) {
  const applications = use(myApplicationsPromise);

  return (
    <section className="bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              My Applications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Jobs you have applied for
            </p>
          </div>
          <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700">
            {applications.length} Total
          </span>
        </div>

        {/* Empty state */}
        {applications.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-lg font-semibold text-slate-700">
              You have not applied to any job yet
            </p>
            <Link
              to="/"
              className="mt-5 inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-violet-700"
            >
              Browse jobs
            </Link>
          </div>
        )}

        {/* List */}
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.job;

            return (
              <div
                key={app._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

                <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                  {/* Left: company + job */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-pink-50 p-2 ring-1 ring-slate-200">
                      {job?.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={`${job.company} logo`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xl font-bold text-indigo-600">
                          {job?.company?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {job?.title || "Job no longer available"}
                      </h3>
                      <p className="font-medium text-indigo-600">
                        {job?.company || "Unknown company"}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        {job?.location && (
                          <span className="rounded-md bg-rose-50 px-2.5 py-1 font-semibold text-rose-600">
                            {job.location}
                          </span>
                        )}
                        {job?.jobType && (
                          <span
                            className={`rounded-md px-2.5 py-1 font-semibold ${
                              typeColors[job.jobType] ||
                              "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {job.jobType}
                          </span>
                        )}
                        {job?.category && (
                          <span className="rounded-md bg-amber-100 px-2.5 py-1 font-semibold text-amber-700">
                            {job.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: salary + actions */}
                  <div className="flex flex-col gap-3 md:items-end">
                    <div className="flex gap-6 text-sm md:text-right">
                      {job?.salaryRange && (
                        <div>
                          <p className="text-xs text-slate-400">Salary range</p>
                          <p className="font-semibold text-slate-800">
                            {fmt(job.salaryRange.min)} -{" "}
                            {fmt(job.salaryRange.max)}{" "}
                            {job.salaryRange.currency?.toUpperCase()}
                          </p>
                        </div>
                      )}
                      {app.expectedSalary && (
                        <div>
                          <p className="text-xs text-slate-400">
                            Your expected
                          </p>
                          <p className="font-semibold text-emerald-600">
                            {fmt(app.expectedSalary)} BDT
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {app.resume && (
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Resume
                        </a>
                      )}
                      {job && (
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:from-indigo-700 hover:to-violet-700"
                        >
                          View job
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}