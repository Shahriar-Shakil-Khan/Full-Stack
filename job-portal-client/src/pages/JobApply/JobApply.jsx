import axios from "axios";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 read-only:bg-gray-100";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

const JobApply = () => {
  const { id: jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApply = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const application = Object.fromEntries(formData.entries());

    const applicationData = {
      ...application,
      jobId,
      applicant_email: user?.email,
    };
    console.log(applicationData);

    axios
      .post("http://localhost:3000/applications", applicationData,{
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Application Submitted Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          form.reset();
          navigate("/");
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          confirmButtonColor: "#4f46e5",
        });
      });
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Apply for this Job
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Fill in the details below to submit your application.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleApply}
          className="rounded-2xl bg-white p-6 shadow-lg md:p-10"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="name"
                defaultValue={user?.displayName || ""}
                placeholder="Your full name"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                name="email"
                value={user?.email || ""}
                readOnly
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 01712345678"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Expected Salary (৳)</label>
              <input
                type="number"
                name="expectedSalary"
                placeholder="e.g. 50000"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>GitHub</label>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/username"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className={labelClass}>Profile Link</label>
            <input
              type="url"
              name="profileLink"
              placeholder="Portfolio / personal website link"
              className={inputClass}
            />
          </div>

          <div className="mt-6">
            <label className={labelClass}>Resume Link</label>
            <input
              type="url"
              name="resume"
              placeholder="Google Drive / Dropbox link"
              className={inputClass}
              required
            />
          </div>

          <div className="mt-6">
            <label className={labelClass}>Cover Letter</label>
            <textarea
              name="coverLetter"
              rows="4"
              placeholder="Write why you are a good fit for this job"
              className={inputClass}
            ></textarea>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-indigo-600 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99]"
          >
            Submit Application
          </button>
        </form>
      </div>
    </section>
  );
};

export default JobApply;



//   fetch("http://localhost:3000/applications", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(applicationData),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.insertedId) {
  //         Swal.fire({
  //           position: "center",
  //           icon: "success",
  //           title: "Application Submitted Successfully",
  //           showConfirmButton: false,
  //           timer: 1500,
  //         });
  //         form.reset();
  //         navigate("/");
  //       }
  //     })
  //     .catch(() => {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Something went wrong",
  //         confirmButtonColor: "#4f46e5",
  //       });
  //     });
  // };
