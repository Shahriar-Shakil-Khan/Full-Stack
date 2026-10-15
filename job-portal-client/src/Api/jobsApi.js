export const jobsCreateByPromise = (email, accessToken) =>
  fetch(`http://localhost:3000/jobs?email=${email}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) =>
    res.json()
  )