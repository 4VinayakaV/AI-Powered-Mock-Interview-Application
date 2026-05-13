"use client"
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';

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

function InterviewList() {

        const [interviewList, setInterviewList]=useState([]);
        const [error, setError] = useState('');

        useEffect(()=>{
            GetInterviewList();
        },[])

        const GetInterviewList=async()=>{
          try {
            setError('');
            const response = await fetch('/api/interviews');
            const data = await readApiResponse(response);

            if (!response.ok) {
              throw new Error(data?.error || 'Unable to load previous interviews.');
            }

            setInterviewList(data.interviews || []);
          } catch (error) {
            console.error('Error loading previous interviews:', error);
            setError(error.message || 'Unable to load previous interviews.');
          }
    }

    const handleDeleteInterview = async (mockId) => {
      const previousInterviews = interviewList;
      setInterviewList((currentList) => currentList.filter((interview) => interview.mockId !== mockId));

      try {
        const response = await fetch('/api/interviews/' + mockId, {
          method: 'DELETE',
        });
        const data = await readApiResponse(response);

        if (!response.ok) {
          throw new Error(data?.error || 'Unable to delete interview.');
        }
      } catch (error) {
        console.error('Error deleting interview:', error);
        setError(error.message || 'Unable to delete interview.');
        setInterviewList(previousInterviews);
      }
    }
  return (
    <section className='rounded-2xl border bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h2 className='text-xl font-bold text-slate-900'>Previous Mock Interviews</h2>
          <p className='text-sm text-slate-500'>Review feedback or remove older practice sessions.</p>
        </div>
      </div>
      {error && (
        <p className='my-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
          {error}
        </p>
      )}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {interviewList&&interviewList.map((interview)=>(
            <InterviewItemCard
            interview={interview}
            onDelete={handleDeleteInterview}
            key={interview.mockId || interview.id}/>
        ))}
      </div>
      {!error && interviewList.length === 0 && (
        <div className='rounded-xl border border-dashed bg-slate-50 p-8 text-center text-sm text-slate-500'>
          No mock interviews yet. Create one above to get started.
        </div>
      )}
    </section>
  )
}

export default InterviewList
