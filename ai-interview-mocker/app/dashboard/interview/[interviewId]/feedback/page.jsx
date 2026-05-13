"use client"
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { Award, CheckCircle2, ChevronsUpDown, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'

  

function Feedback() {

    const [feedbackList, setFeedbackList]= useState([]);
    const [error, setError] = useState('');
    const params = useParams();
    const router=useRouter();

    useEffect(()=>{
        if (params?.interviewId) {
            GetFeedback(params.interviewId);
        }
    },[params?.interviewId])

    const GetFeedback=async(interviewId)=>{
        try {
            setError('');
            const response = await fetch('/api/interviews/' + interviewId + '/feedback');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Unable to load feedback.');
            }

            setFeedbackList(data.feedback || []);
        } catch (error) {
            console.error('Error loading feedback:', error);
            setError(error.message || 'Unable to load feedback.');
        }
    }

  return (
    <div className='space-y-6'>
      <section className='rounded-2xl border bg-white p-6 shadow-sm sm:p-8'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700'>
          <Award className='h-6 w-6' />
        </div>
        <h1 className='mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl'>Interview Feedback</h1>
        <p className='mt-2 max-w-2xl text-slate-600'>Review your answers, compare them with strong sample responses, and use the notes to improve your next attempt.</p>
      </section>

      <section className='rounded-2xl border bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-4 flex items-center gap-2 text-green-700'>
        <CheckCircle2 className='h-5 w-5' />
        <h2 className='font-bold'>Question-by-question review</h2>
      </div>
        {error && (
            <div className='my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
                {error}
            </div>
        )}
        {!error && feedbackList.length === 0 && (
            <div className='my-4 rounded-lg border bg-gray-50 p-4 text-sm text-gray-600'>
                No feedback has been recorded for this interview yet.
            </div>
        )}
        {feedbackList.map((item)=>(
            <Collapsible key={item.id} className='mb-3 rounded-xl border bg-slate-50'>
            <CollapsibleTrigger className='flex w-full items-center justify-between gap-4 rounded-xl p-4 text-left font-semibold text-slate-900'>
            <span className='break-words'>{item.question}</span><ChevronsUpDown className='h-5 w-5 shrink-0 text-slate-500'/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-3 border-t bg-white p-4'>
                <h2 className='rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900'>
                    <strong>Rating: </strong>{item.rating}
                </h2>
                <h2 className='rounded-lg border bg-slate-50 p-3 text-sm leading-6 text-slate-700'>
                    <strong>Your answer: </strong>{item.userAns}
                </h2>
                <h2 className='rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-900'>
                    <strong>Correct answer: </strong>{item.correctAns}
                </h2>
                <h2 className='rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-900'>
                    <strong>Feedback: </strong>{item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
        ))}
        <div className='mt-5 flex justify-end'>
          <Button onClick={()=> router.replace('/dashboard')}>
            <Home className='h-4 w-4' />
            Go Home
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Feedback
