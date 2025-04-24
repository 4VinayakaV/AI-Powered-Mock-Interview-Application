import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4"
    >
      <div className="text-center absolute top-10">
        <h1 className="text-4xl font-extrabold text-white mb-2">AI Interviewer</h1>
        <p className="text-gray-300 text-lg">Your smart mock interview partner</p>
      </div>
      <div className="shadow-xl rounded-xl p-8 bg-white/90 backdrop-blur-md">
        <SignIn />
      </div>
    </div>
  );
}
