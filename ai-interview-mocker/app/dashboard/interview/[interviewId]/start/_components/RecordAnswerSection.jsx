"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, Ratio } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import { Antic_Slab } from 'next/font/google'
import { db } from '@/utils/db'
import moment from 'moment/moment'
import { useUser } from '@clerk/nextjs'
import { UserAnswer } from '@/utils/schema'

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
    const [userAnswer, setUserAnswer] = useState('');
    const {user}=useUser(); 
    const [loading,setLoading] = useState(false);
    const {
        error,
        interimResult, 
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{
        results.map((result)=>(
            setUserAnswer(prevAns=>prevAns+result?.transcript)
        ))
      },[results])

      useEffect(()=>{
        if(!isRecording&&userAnswer.length>10){
            UpdateUserAnswer();
        }
      },[userAnswer])

      const StartStopRecording=async()=>{
        if (isRecording){
            
            stopSpeechToText()
            
        }
        else{
            startSpeechToText();
        }
      }
      const UpdateUserAnswer=async()=>{
        setLoading(true);
        const feedbackPromt="Question: "+mockInterviewQuestion[activeQuestionIndex]?.question+
            ", User Answer: "+userAnswer+", Depends on question and user answer for the given interview question"+
            "please give us rating for answer and feedback for area of improvement if any"+
            "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

            const result=await chatSession.sendMessage(feedbackPromt);
            const mockJsonResp=(result.response.text()).replace('```json', '').replace('```','')

            console.log(mockJsonResp);
            const JsonFeedbackResp=JSON.parse(mockJsonResp);

            const resp = await db.insert(UserAnswer)
            .values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns:userAnswer,
                feedback:JsonFeedbackResp?.feedback,
                rating:JsonFeedbackResp?.rating,
                userEmail:user?.primary?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('MM-DD-yyyy')
            })

            if(resp){
                toast('User Answer recorded successfully');
                setUserAnswer('');
                setResults([]);
            }
            setResults([]);
            setLoading(false);

      }

  return (
    <div className='flex item-center justify-center flex-col'>
    <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={'/webcam.png'} width={200} height={200}
        className= 'absolute'/>
      <Webcam
      mirrored={true}
      style={{
        height:300,
        width:'100%',
        zIndex:10,
      }}
      />
      </div>
      <Button variant="outline" className="my-10"
      onClick={StartStopRecording}
      >
        {isRecording?
        <h2 className='text-red-500 flex gap-2'>
            <Mic/>Stop Recording
        </h2>
        :
        'Record Answer'}</Button>

    </div> 
  )
}

export default RecordAnswerSection
