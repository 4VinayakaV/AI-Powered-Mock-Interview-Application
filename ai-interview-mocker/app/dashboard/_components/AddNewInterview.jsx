"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
  
function AddNewInterview() {
    const [openDailog, setOpenDailog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperience, setJobExperience] = useState();
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const router = useRouter();
    const {user} = useUser();

    const onSubmit=async(e)=>{
        setLoading(true)
        e.preventDefault()
        console.log(jobPosition,jobDesc,jobExperience)

        const InputPrompt = "Job position: "+ jobPosition+", Job Description: "+jobDesc+" Years of Experience: "+jobExperience+", Depends on Job Position, Job Description & Years of Experience give us 5 Interview question along with Answer in JSON format, Give us question and answer field on JSON"

        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonresp = (result.response.text()).replace('```json', '').replace('```','')

        console.log(JSON.parse(MockJsonresp));
        setJsonResponse(MockJsonresp);


        if(MockJsonresp){
        
        const resp = await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonresp,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('MM-DD-yyyy')
        }).returning({mockId:MockInterview.mockId});

        console.log("Inserted ID:", resp)
        }
        if(resp){
            setOpenDailog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }
        else{
            console.log("Error"); 
        }
        setLoading(false);
    }

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
      onClick={()=> setOpenDailog(true)}>
        <h2 className='font-bold text-lg text-center'> + Add New</h2>
        </div>
        <Dialog open = {openDailog}>
  
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">Tell us about your job interview</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
 
            <h2>Add details about your job postion / role, Job description and experience </h2>

            <div className='mt-7 my-3'>
                <label>Job role/Job Position</label>
                <Input placeholder = "ex. Full stack Developer" required
                onChange={(event)=>setJobPosition(event.target.value)}
                />
            </div>

            <div className='mt-7 my-3'>
                <label>Job Description</label>
                <Textarea placeholder = "ex. react, python, flask " required
                onChange={(event)=>setJobDesc(event.target.value)}
                />
            </div>

            <div className='mt-7 my-3'>
                <label>Relevant Experience</label>
                <Input placeholder = "ex. 4" type="number" max = "50" required
                onChange={(event)=>setJobExperience(event.target.value)}
                />
            </div>

        </div>
        <div className='flex gap-5 justify-end'>
            <Button type = "button" variant= "ghost" onClick={()=> setOpenDailog(false)}>Cancel</Button>
            <Button type = "submit" disabled = {loading}>
            {loading?
                <>
                <LoaderCircle className='animate-spin'/> 'Generating from AI'
                </>: 'Start Interview'
            }
            </Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview
