import { Button } from '@/components/ui/button'
import { CalendarDays, MessageSquareText, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview, onDelete}) {
    const router=useRouter();
    const onfeedback=()=>{
        router.push('/dashboard/interview/'+interview.mockId+"/feedback")

    }

    const handleDelete = () => {
      if (window.confirm('Delete this mock interview and its saved answers?')) {
        onDelete?.(interview.mockId);
      }
    }

  return (
    <div className='flex h-full flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'>
      <div>
        <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700'>
          <MessageSquareText className='h-5 w-5' />
        </div>
        <h2 className='break-words text-lg font-bold text-slate-900'>{interview?.jobPosition}</h2>
        <p className='mt-2 text-sm text-slate-600'>Relevant Experience: {interview?.jobExperience}</p>
        <p className='mt-2 flex items-center gap-2 text-xs font-medium text-slate-500'>
          <CalendarDays className='h-4 w-4' />
          Created {interview.createdAt}
        </p>
      </div>
      <div className='mt-5 flex flex-col gap-2 sm:flex-row'>
        <Button size="sm" variant="outline"
        className="flex-1"
        onClick = {onfeedback}
        >Feedback</Button>
        <Button size="sm" variant="destructive" className="flex-1" onClick={handleDelete}>
          <Trash2 className='h-4 w-4' />
          Delete
        </Button>
        
      </div>
    </div>
  )
}

export default InterviewItemCard
