"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, Video } from 'lucide-react'
import { toast } from 'sonner'

function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
    const [userAnswer, setUserAnswer] = useState('');
    const [loading,setLoading] = useState(false);
    const hasSavedAnswer = useRef(false);
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
        const transcript = results
          .map((result) => result?.transcript)
          .filter(Boolean)
          .join(' ')
          .trim();

        setUserAnswer(transcript);
      },[results])

      useEffect(()=>{
        hasSavedAnswer.current = false;
        setUserAnswer('');
        setResults([]);
      },[activeQuestionIndex, setResults])

      useEffect(()=>{
        if(!isRecording && userAnswer.trim().length > 10 && !loading && !hasSavedAnswer.current){
            hasSavedAnswer.current = true;
            UpdateUserAnswer(userAnswer.trim());
        }
      },[isRecording, userAnswer, loading])

      const StartStopRecording=async()=>{
        if (isRecording){
            
            stopSpeechToText()
            
        }
        else{
            hasSavedAnswer.current = false;
            setUserAnswer('');
            setResults([]);
            startSpeechToText();
        }
      }
      const UpdateUserAnswer=async(answerText)=>{
        setLoading(true);
        try {
            const response = await fetch('/api/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mockId: interviewData?.mockId,
                    question: mockInterviewQuestion[activeQuestionIndex]?.question,
                    correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                    userAns: answerText,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || 'Unable to save answer feedback.');
            }

            toast('User Answer recorded successfully');
            setUserAnswer('');
            setResults([]);
        } catch (error) {
            console.error('Error saving answer feedback:', error);
            toast(error.message || 'Unable to save answer feedback.');
            hasSavedAnswer.current = false;
        } finally {
            setLoading(false);
        }

      }

  return (
    <section className='rounded-2xl border bg-white p-5 shadow-sm sm:p-6'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <div>
          <h2 className='text-lg font-bold text-slate-900'>Answer recorder</h2>
          <p className='text-sm text-slate-500'>Record one answer per question.</p>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${isRecording ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
          {isRecording ? 'Recording' : 'Ready'}
        </div>
      </div>
    <div className='relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-slate-950 p-5'>
        <Image src={'/webcam.png'} width={200} height={200} alt="Webcam placeholder"
        className= 'absolute opacity-70'/>
      <Webcam
      mirrored={true}
      className='relative z-10 h-full w-full rounded-lg object-cover'
      />
      </div>
      <Button variant={isRecording ? "destructive" : "outline"} className="mt-5 w-full"
      onClick={StartStopRecording}
      disabled={loading}
      >
        {loading ? (
          'Saving answer...'
        ) : isRecording ? (
          <span className='flex gap-2'>
            <Mic/>Stop Recording
          </span>
        ) : (
          <span className='flex items-center gap-2'>
            <Video className='h-4 w-4' />
            Record Answer
          </span>
        )}
      </Button>
      {userAnswer && (
        <div className='mt-4 rounded-xl border bg-slate-50 p-4'>
          <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Transcript</p>
          <p className='mt-2 text-sm leading-6 text-slate-700'>{userAnswer}</p>
        </div>
      )}

    </section> 
  )
}

export default RecordAnswerSection
