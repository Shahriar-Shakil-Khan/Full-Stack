// Notun job post korar form page
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

// input ar label er Tailwind style (ekbar likhe shob jaygay use kora hoyeche)
const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
const labelClass = "mb-1.5 block text-sm font-semibold text-gray-700";

export default function AddJob() {
   // login kora user er email (HR Email e auto boshe)
   const { user } = useAuth();
   const navigate = useNavigate();

    // form submit hole ei function cholbe
    const handleAddJob = e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const initialData = Object.fromEntries(formData.entries());

        // salary field gulo ekshathe ekta object banai
        const { min, max, currency, ...newJob } = initialData;
        newJob.salaryRange = { min, max, currency }

        // requirements: new line ba comma, duita diyei alada skill hobe (faka bad)
        newJob.requirements = newJob.requirements
            .split(/[\n,]+/)
            .map(item => item.trim())
            .filter(Boolean);

        // responsibilities: shudhu new line diye alada hobe (faka bad)
        newJob.responsibilities = newJob.responsibilities
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean);

        // status na dile job card e "Closed" dekhay, tai active dilam
        newJob.status = 'active';

        // backend e job pathai
        fetch('http://localhost:3000/jobs', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newJob)
        })
            .then(res => res.json())
            .then(data => {
                if (data.insertedId) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Job Has been added.",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    // job add hole My Posted Jobs page e jai
                    navigate('/myPostedJobs');
                }
            })
    }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
            {/* Heading */}
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Post a new Job</h2>
                <p className="mt-2 text-gray-500">Fill in the details below to publish a new job opening.</p>
            </div>

            <form onSubmit={handleAddJob} className="space-y-6">

                {/* ---------- Basic info ---------- */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-8">
                    <h3 className="mb-5 text-lg font-semibold text-gray-900">Basic Information</h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Job title */}
                        <div>
                            <label className={labelClass}>Job Title</label>
                            <input type="text" name='title' placeholder="Job Title" className={inputClass} required />
                        </div>

                        {/* job location */}
                        <div>
                            <label className={labelClass}>Job Location</label>
                            <input type="text" name='location' placeholder="Job Location" className={inputClass} required />
                        </div>

                        {/* job Type (name="jobType" na dile database e save hoy na) */}
                        <div>
                            <label className={labelClass}>Job Type</label>
                            <select name="jobType" defaultValue="" className={inputClass} required>
                                <option value="" disabled>Pick a Job type</option>
                                <option>Full-time</option>
                                <option>Intern</option>
                                <option>Part-time</option>
                            </select>
                        </div>

                        {/* job Field (name="category" na dile database e save hoy na) */}
                        <div>
                            <label className={labelClass}>Job Field</label>
                            <select name="category" defaultValue="" className={inputClass} required>
                                <option value="" disabled>Pick a Job Field</option>
                                <option>Engineering</option>
                                <option>Marketing</option>
                                <option>Finance</option>
                                <option>Teaching</option>
                            </select>
                        </div>
                    </div>

                    {/* salary range */}
                    <div className="mt-5">
                        <label className={labelClass}>Salary Range</label>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                            <input type="text" name='min' placeholder="Min" className={inputClass} required />
                            <input type="text" name='max' placeholder="Max " className={inputClass} required />
                            <select defaultValue="" name="currency" className={inputClass} required>
                                <option value="" disabled>Currency</option>
                                <option>BDT</option>
                                <option>USD</option>
                                <option>INR</option>
                            </select>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="mt-5">
                        <label className={labelClass}>Job Description</label>
                        <textarea rows="4" className={inputClass} placeholder="Job Description" name="description" required></textarea>
                    </div>
                </div>

                {/* ---------- Requirements & responsibilities ---------- */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-8">
                    <h3 className="mb-5 text-lg font-semibold text-gray-900">Requirements & Responsibilities</h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* requirements */}
                        <div>
                            <label className={labelClass}>Job Requirements</label>
                            <textarea rows="6" className={inputClass} placeholder="Each skill in a new line (or separate with comma)" name="requirements" required></textarea>
                        </div>

                        {/* responsibilities */}
                        <div>
                            <label className={labelClass}>Job Responsibilities</label>
                            <textarea rows="6" className={inputClass} placeholder="Write each responsibility in a new line" name="responsibilities" required></textarea>
                        </div>
                    </div>
                </div>

                {/* ---------- Company & HR ---------- */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 md:p-8">
                    <h3 className="mb-5 text-lg font-semibold text-gray-900">Company & Contact</h3>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Company Name */}
                        <div>
                            <label className={labelClass}>Company Name</label>
                            <input type="text" name='company' placeholder="Company Name" className={inputClass} required />
                        </div>

                        {/* Company Logo */}
                        <div>
                            <label className={labelClass}>Company Logo URL</label>
                            <input type="text" name='company_logo' placeholder="Company Logo URL" className={inputClass} required />
                        </div>

                        {/* HR Name */}
                        <div>
                            <label className={labelClass}>HR Name</label>
                            <input type="text" name='hr_name' placeholder="HR Name" className={inputClass} required />
                        </div>

                        {/* HR Email (login kora user er email auto boshe) */}
                        <div>
                            <label className={labelClass}>HR Email</label>
                            <input type="text" defaultValue={user?.email} name='hr_email' placeholder="HR Email" className={inputClass} required />
                        </div>

                        {/* application Deadline */}
                        <div className="md:col-span-2">
                            <label className={labelClass}>Deadline</label>
                            <input type="date" name='applicationDeadline' placeholder="Deadline" className={inputClass} required />
                        </div>
                    </div>
                </div>

                {/* submit button */}
                <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.99]"
                >
                    Submit
                </button>
            </form>
        </div>
    </div>
    );
}