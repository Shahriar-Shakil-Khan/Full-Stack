import { use } from "react";
import JobCard from "../shared/JobCard";

export default function HotJobs({ jobsPromise }) {
  const jobs = use(jobsPromise);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </section>
  );
}