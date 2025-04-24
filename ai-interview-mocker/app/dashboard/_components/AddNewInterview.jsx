"use client"
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Give us 5 interview questions with answers in JSON.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const rawResponse = await result.response.text();
      const cleanedJSON = rawResponse.replace('```json', '').replace('```', '').trim();
      const parsedJSON = JSON.parse(cleanedJSON);
      setJsonResponse(parsedJSON);

      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: cleanedJSON,
        jobPosition,
        jobDesc,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('MM-DD-yyyy'),
      }).returning({ mockId: MockInterview.mockId });

      if (resp) {
        setOpenDailog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId);
      }
    } catch (error) {
      console.error("Error generating questions or saving data:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center hover:bg-gray-100 hover:scale-[1.02] transition-transform cursor-pointer"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className='font-semibold text-lg text-gray-700'>+ Add New</h2>
      </div>

      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Start a New Mock Interview</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <p className="text-sm text-gray-600 mb-4">
              Please provide your job position, description, and relevant experience.
            </p>

            <form onSubmit={onSubmit}>
              <div className='space-y-4'>
                <div>
                  <label className="block font-medium text-gray-700">Job Role / Position</label>
                  <Input
                    placeholder="e.g. Full Stack Developer"
                    required
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Job Description</label>
                  <Textarea
                    placeholder="e.g. React, Python, Flask, PostgreSQL"
                    required
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Years of Experience</label>
                  <Input
                    type="number"
                    max="50"
                    placeholder="e.g. 3"
                    required
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>

                <div className='flex justify-end gap-4 mt-6'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDailog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className='animate-spin mr-2 h-5 w-5' />
                        Generating...
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
