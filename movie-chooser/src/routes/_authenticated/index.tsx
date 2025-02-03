// import { QueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type ApiRoutes } from '../../../../movie-chooser-api/my-app/src/app';
import { hc } from 'hono/client';
import { useEffect } from 'react';

// @ts-ignore
export const client = hc<ApiRoutes>('/');

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  return (
    <div className='p-2 flex flex-col items-center w-full h-screen'>
      {/* Top-aligned heading */}
      <h1 className='mt-8 text-2xl w-full text-center'>
        Welcome to Pin Hunters!
      </h1>

      <div className='mt-4'>
        <button className='bg-gradient-to-b from-[#B5EF8A] to-[#0ACDFF] w-36 h-12 text-black rounded-md'>
          Start a new round
        </button>
      </div>
    </div>
  );
}
