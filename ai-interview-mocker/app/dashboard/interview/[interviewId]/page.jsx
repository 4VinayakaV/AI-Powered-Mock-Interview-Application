"use client"
import { Button } from '@/components/ui/button'
import { BriefcaseBusiness, Clock, Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'


function Interview() {
    const params = useParams();
    const [interviewData, setInterviewData] =useState();
    const [error, setError] = useState('');
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    useEffect(()=>{
        if (params?.interviewId) {
            GetInterviewDetails(params.interviewId);
        }
    },[params?.interviewId])

    const GetInterviewDetails=async(interviewId)=>{
        try {
            setError('');
            const response = await fetch('/api/interviews/' + interviewId);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Unable to load interview details.');
            }

            setInterviewData(data.interview);
        } catch (error) {
            console.error('Error loading interview details:', error);
            setError(error.message || 'Unable to load interview details.');
        }
    }

  return (
    <div className='space-y-6'>
      <section className='rounded-2xl border bg-white p-6 shadow-sm sm:p-8'>
        <p className='text-sm font-semibold uppercase tracking-wide text-teal-700'>Interview setup</p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl'>Let's Get Started</h1>
        <p className='mt-2 max-w-2xl text-slate-600'>Review the interview context, enable your camera and microphone, then begin the guided question flow.</p>
      </section>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
        <section className='rounded-2xl border bg-white p-5 shadow-sm'>
        <h2 className='text-lg font-bold text-slate-900'>Camera preview</h2>
        <p className='mt-1 text-sm text-slate-500'>Camera access is only used for your practice experience.</p>
        {webCamEnabled? <Webcam
        onUserMedia={()=>setWebCamEnabled(true)}
        onUserMediaError={()=>setWebCamEnabled(false)}
        mirrored={true}
        className='mt-5 aspect-video w-full rounded-xl bg-slate-950 object-cover'
        />
        :
        <>
        <div className='my-5 flex aspect-video w-full items-center justify-center rounded-xl border bg-slate-100'>
          <WebcamIcon className='h-20 w-20 text-slate-400'/>
        </div>
        <Button variant= "outline" className= 'w-full'onClick = {()=> setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
        </>
}       
      </section>
      {error ? (
        <div className='rounded-xl border border-red-200 bg-red-50 p-5 text-red-700'>{error}</div>
      ) : interviewData ? (
  <section className='flex flex-col gap-5 rounded-2xl border bg-white p-5 shadow-sm'>
    <div className='rounded-xl border bg-slate-50 p-5'>
    <div className='mb-4 flex items-center gap-2 text-slate-900'>
      <BriefcaseBusiness className='h-5 w-5 text-teal-700' />
      <h2 className='text-lg font-bold'>Interview details</h2>
    </div>
    <div className='space-y-4'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Job Position</p>
        <p className='mt-1 break-words text-base font-semibold text-slate-900'>{interviewData.jobPosition}</p>
      </div>
      <div>
        <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Job Description</p>
        <p className='mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700'>{interviewData.jobDesc}</p>
      </div>
      <div>
        <p className='flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500'><Clock className='h-3.5 w-3.5' /> Relevant Experience</p>
        <p className='mt-1 text-sm text-slate-700'>{interviewData.jobExperience} years</p>
      </div>
    </div>
    </div>
    <div className='rounded-xl border border-amber-200 bg-amber-50 p-5'>
        <h2 className='flex gap-2 items-center font-bold text-amber-900'><Lightbulb className='h-5 w-5'/><span>Before you start</span></h2>
        <p className='mt-2 text-sm leading-6 text-amber-900'>Enable your webcam and microphone before starting. The interview has 5 AI-generated questions. Your video is not stored, and you can disable camera access at any time.</p>
    </div>
  </section>
) : (
  <div className='rounded-xl border bg-white p-5 text-slate-600'>Loading interview details...</div>
)}
        </div>  
      <div className='flex justify-end'>
        <Button disabled={!interviewData} asChild={!!interviewData}>
          {interviewData ? (
            <Link href={`/dashboard/interview/${interviewData.mockId}/start`}>
              Start Interview
            </Link>
          ) : (
            'Start Interview'
          )}
        </Button>
        
        </div>
    </div>
  )
}

export default Interview
