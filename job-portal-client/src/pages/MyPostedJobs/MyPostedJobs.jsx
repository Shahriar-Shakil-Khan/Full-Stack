// HR er post kora job gulo dekhanor page
import { Suspense } from 'react';
import useAuth from '../../hooks/useAuth';
import JobList from './JobList';
import jobApi from '../../Api/jobApi';


const MyPostedJobs = () => {

    // login kora user er email
    const { user } = useAuth();
    const { jobsCreateByPromise } = jobApi();

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            {/* data ashar age "Loading jobs..." dekhabe */}
            <Suspense fallback={<p className="py-10 text-center text-gray-500">Loading jobs...</p>}>
                {/* user er email diye job gulo fetch kore JobList e pathai */}
                <JobList jobsCreateByPromise={jobsCreateByPromise(user.email, user.accessToken)} ></JobList>
            </Suspense>
        </div>
    );
};

export default MyPostedJobs;
