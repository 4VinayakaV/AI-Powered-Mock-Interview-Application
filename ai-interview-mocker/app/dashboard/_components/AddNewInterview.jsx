"use client"
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, LoaderCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

async function readApiResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(response.ok
      ? 'The server returned an invalid response.'
      : 'The server returned an HTML error page. Check the terminal running npm run dev for the server error.');
  }
}

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('jobPosition', jobPosition);
      formData.append('jobDesc', jobDesc);
      formData.append('jobExperience', jobExperience);

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await fetch('/api/interviews', {
        method: 'POST',
        body: formData,
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to create interview.');
      }

      setOpenDailog(false);
      router.push('/dashboard/interview/' + data.mockId);
    } catch (error) {
      console.error("Error generating questions or saving data:", error);
      setError(error.message || 'Unable to create interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/70 p-6 text-center transition hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
        onClick={() => setOpenDailog(true)}
      >
        <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm transition group-hover:scale-105'>
          <Plus className='h-6 w-6' />
        </div>
        <h2 className='text-lg font-bold text-slate-900'>Add New Interview</h2>
        <p className='mt-1 max-w-56 text-sm text-slate-600'>Generate custom questions from a role, job description, and resume.</p>
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-xl p-0">
          <div className='border-b bg-slate-50 px-6 py-5'>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Start a New Mock Interview</DialogTitle>
            <DialogDescription className="text-slate-600">
              Please provide your job position, description, and relevant experience.
            </DialogDescription>
          </DialogHeader>
          </div>

          <form onSubmit={onSubmit} className='px-6 py-5'>
            <div className='space-y-5'>
              <div>
                <label htmlFor="jobPosition" className="mb-1.5 block text-sm font-semibold text-slate-700">Job Role / Position</label>
                <Input
                  id="jobPosition"
                  className="h-11"
                  placeholder="e.g. Full Stack Developer"
                  required
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="jobDesc" className="mb-1.5 block text-sm font-semibold text-slate-700">Job Description</label>
                <Textarea
                  id="jobDesc"
                  placeholder="e.g. React, Python, Flask, PostgreSQL"
                  required
                  className="min-h-36 resize-y"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="jobExperience" className="mb-1.5 block text-sm font-semibold text-slate-700">Years of Experience</label>
                <Input
                  id="jobExperience"
                  className="h-11"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="e.g. 3"
                  required
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>

              <div className='rounded-lg border bg-slate-50 p-4'>
                <label htmlFor="resume" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText className='h-4 w-4 text-teal-700' />
                  Resume PDF
                </label>
                <Input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Optional, but recommended. The resume text will be used to customize the questions.
                </p>
              </div>

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end'>
                <Button type="button" variant="ghost" disabled={loading} onClick={() => setOpenDailog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className='animate-spin mr-2 h-5 w-5' />
                      Generating...
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
