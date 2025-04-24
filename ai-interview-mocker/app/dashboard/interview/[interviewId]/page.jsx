"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'


function Interview({params}) {
    console.log(params.interviewId)

    const [interviewData, setInterviewData] =useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    useEffect(()=>{
        console.log(params.interviewId)
        GetInterviewDetails();
    },[])

    const GetInterviewDetails=async()=>{
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))

        setInterviewData(result[0]);
    }

  return (
    <div className='my-10'>
      <h2 className='font-bold text-2xl'>Let's Get Started!</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <div>
        {webCamEnabled? <Webcam
        onUserMedia={()=>setWebCamEnabled(true)}
        onUserMediaError={()=>setWebCamEnabled(false)}
        mirrored={true}
        style = {
            {
              height:300,
              width:300  
            }
        }
        />
        :
        <>
        <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
        <Button variant= "ghost" className= 'w-full'onClick = {()=> setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
        </>
}       
      </div>
      {interviewData ? (
  <div className='flex flex-col my-5 gap-5'>
    <div className='flex flex-col p-5 rounded-lg border'>
    <h2 className='text-lg'><strong>Job Position: </strong>{interviewData.jobPosition}</h2>
    <h2 className='text-lg'><strong>Job Description: </strong>{interviewData.jobDesc}</h2>
    <h2 className='text-lg'><strong>Relevant Experience: </strong>{interviewData.jobExperience}</h2>
    </div>
    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-50'>
        <h2 className='flex gap-2 items-center'><Lightbulb/><strong>Information</strong></h2>
        <h2> Enable Video Web Cam and Microphone to Start your Al Generated Mock Interview, It Has 5 question which you can answer and at the last you will get the report on the basis of your answer. NOTE: We never record your video, Web cam access you can disable at any time if you want </h2>
    </div>
  </div>
) : (
  <div>Loading...</div>
)}
        </div>  
      <div className='flex justify-end items-end'>
        <Link href={`/dashboard/interview/${interviewData?.mockId}/start`}>
        <Button >Start Interview</Button>
        </Link>
        
        </div>
    </div>
  )
}

export default Interview
