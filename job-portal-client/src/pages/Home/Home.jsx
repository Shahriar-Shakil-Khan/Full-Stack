import { Suspense } from "react";
import Banner from "./Banner";
import HotJobs from "./HotJobs";

export default function Home() {

 const jobsPromise =fetch('http://localhost:3000/jobs').then(res => res.json())



  return (
    <div>
    <Banner></Banner>
    <Suspense fallback={<p>Loading jobs...</p>}>
        <HotJobs jobsPromise={jobsPromise} />
    </Suspense>
    </div>
  )
}
