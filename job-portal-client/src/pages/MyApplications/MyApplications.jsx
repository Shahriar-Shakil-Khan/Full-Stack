import { Suspense } from "react";
import useAuth from "../../hooks/useAuth";
import ApplicationList from "./ApplicationList";
import ApplicationStats from "./ApplicationStats";
import useApplicationApi from "../../Api/useApplicationApi";


export default function MyApplications() {
  const { user } = useAuth();
  const {myApplicationsPromise} = useApplicationApi();

  return (
    <>
      <ApplicationStats />

      <Suspense fallback={<p className="py-20 text-center">Loading...</p>}>
        <ApplicationList myApplicationsPromise={myApplicationsPromise(user.email)} />
      </Suspense>
    </>
  );
}