import useAxiosSecureToken from "../hooks/useAxiosSecureToken";


export default function JobApi() {
  const axiosSecure = useAxiosSecureToken();

  // recruiter er nijer post kora job gulo
  const jobsCreateByPromise = (email) => {
    return axiosSecure.get(`/jobs?email=${email}`)
      .then((res) => res.data);
  };

  return {
    jobsCreateByPromise,
  };
}