import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className='space-y-8'>

      <section className='rounded-2xl border bg-white p-6 shadow-sm sm:p-8'>
        <p className='text-sm font-semibold uppercase tracking-wide text-teal-700'>Interview workspace</p>
        <div className='mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl'>Interview Hub</h1>
            <p className='mt-2 max-w-2xl text-slate-600'>Create resume-aware mock interviews, practice answers, and review feedback from previous sessions.</p>
          </div>
        </div>
      </section>

      <section className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        <AddNewInterview/>
        <div className='rounded-xl border bg-white p-5 shadow-sm md:col-span-2'>
          <h2 className='text-lg font-semibold text-slate-900'>How this works</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            {['Add role and JD', 'Upload resume PDF', 'Practice and review'].map((item, index) => (
              <div key={item} className='rounded-lg border bg-slate-50 p-4'>
                <div className='mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800'>{index + 1}</div>
                <p className='text-sm font-semibold text-slate-800'>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <InterviewList/>
    </div>
  )
}

export default Dashboard
