"use client"
import React, { useEffect, useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';



function StartInterview() {
    const params = useParams();
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [error, setError] = useState('');
    useEffect(()=>{
        if (params?.interviewId) {
          GetInterviewDetails(params.interviewId);
        }
    },[params?.interviewId]);
    const GetInterviewDetails=async(interviewId)=>{
        try {
          setError('');
          const response = await fetch('/api/interviews/' + interviewId);
          const data = await response.json();

          if (!response.ok) {
              throw new Error(data?.error || 'Unable to load interview questions.');
          }

          const jsonMockResp =JSON.parse(data.interview.jsonMockResp);
          setMockInterviewQuestion(jsonMockResp);
          setInterviewData(data.interview);
        } catch (error) {
          console.error('Error loading interview questions:', error);
          setError(error.message || 'Unable to load interview questions.');
        }
        
    }

  if (error) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50 p-5 text-red-700'>
        {error}
      </div>
    );
  }

  if (!mockInterviewQuestion || !interviewData) {
    return <div className='rounded-xl border bg-white p-5 text-slate-600 shadow-sm'>Loading interview questions...</div>;
  }

  return (
    <div className='space-y-6'>
        <section className='rounded-2xl border bg-white p-5 shadow-sm sm:p-6'>
          <p className='text-sm font-semibold uppercase tracking-wide text-teal-700'>Live practice</p>
          <div className='mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl'>Mock Interview</h1>
              <p className='mt-1 text-sm text-slate-600'>{interviewData.jobPosition} · Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}</p>
            </div>
          </div>
        </section>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.95fr]'>
            <QuestionsSection 
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            />

            <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            />

        </div>
        <div className='sticky bottom-0 flex flex-col gap-3 border-t bg-slate-50/95 py-4 backdrop-blur sm:flex-row sm:justify-end'>
          {activeQuestionIndex >0 && 
          <Button variant="outline" onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
          {activeQuestionIndex!==mockInterviewQuestion.length-1&& 
          <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            {activeQuestionIndex===mockInterviewQuestion.length-1&& 
            <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
            <Button className="w-full sm:w-auto">End Interview</Button>
            </Link>}
        </div>
    </div>
  )
}

export default StartInterview
