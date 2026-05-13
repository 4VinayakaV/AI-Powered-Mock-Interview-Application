import { Lightbulb } from 'lucide-react'
import React from 'react'

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex}) {
  return mockInterviewQuestion&&(
    <section className='rounded-2xl border bg-white p-5 shadow-sm sm:p-6'>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
        {mockInterviewQuestion&&mockInterviewQuestion.map((question,index)=>(
            <h2 key={question?.question || index} className={`rounded-full border px-3 py-2
            text-center text-xs font-semibold md:text-sm
            ${activeQuestionIndex==index ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>Question #{index+1}</h2>
        ))}
      </div>
      <div className='mt-6 rounded-xl border bg-slate-50 p-5'>
        <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Current question</p>
        <h2 className='mt-2 text-lg font-bold leading-7 text-slate-950 md:text-xl'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
      </div>
      <div className='mt-5 rounded-xl border border-blue-200 bg-blue-50 p-5'>
        <h2 className='flex gap-2 items-center text-blue-900'>
           <Lightbulb className='h-5 w-5'/>
           <strong>Note: </strong> 
        </h2>
        <p className='my-2 text-sm leading-6 text-blue-900'>Click Record Answer when you are ready. After the interview, you will receive feedback, the sample answer, and your recorded answer for comparison.</p>
      </div>
    </section>
  )
}

export default QuestionsSection
