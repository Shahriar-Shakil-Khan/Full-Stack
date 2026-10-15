export const myApplicationsPromise = (email, accessToken) =>
  fetch(`http://localhost:3000/applications?email=${email}`,{
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) =>
    res.json()
  );