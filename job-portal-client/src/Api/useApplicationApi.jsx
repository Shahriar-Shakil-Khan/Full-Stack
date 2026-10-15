import useAxiosSecureToken from "../hooks/useAxiosSecureToken";

export default function useApplicationApi() {
  const axiosSecure = useAxiosSecureToken();

  const myApplicationsPromise = (email) => {
    return axiosSecure
      .get(`/applications?email=${email}`)
      .then((res) => res.data);
  };

  return {
    myApplicationsPromise,
  };
}
