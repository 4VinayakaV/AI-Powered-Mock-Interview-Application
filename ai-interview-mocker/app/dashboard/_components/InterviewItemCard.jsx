import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
    const router=useRouter();
    const onfeedback=()=>{
        router.push('/dashboard/interview/'+interview.mockId+"/feedback")

    }
  return (
    <div className='border shadow-sm rounded-lg p-5'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-500'>Relevant Experience: {interview?.jobExperience}</h2>
      <h2 className='text-sm text-gray-500'>Created At: {interview.createdAt}</h2>
      <div>
        <Button size="sm" varient="outline"
        onClick = {onfeedback}
        >FeedBack</Button>
        
      </div>
    </div>
  )
}

export default InterviewItemCard
