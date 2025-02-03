import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/friends')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='p-2 flex flex-col items-center w-full h-screen'>
      {/* Top-aligned heading */}
      <h1 className='mt-8 text-2xl w-full text-center'>Add some friends!</h1>

      <div className='mt-4 flex flex-row'>
        <input
          type='text'
          placeholder='Add friends by email'
          className='p-2 border border-gray-300 rounded-md mr-2'
        />

        <button className='bg-gradient-to-b from-[#B5EF8A] to-[#0ACDFF] w-36 h-12 text-black rounded-md'>
          Add friend
        </button>
      </div>
      <div></div>
    </div>
  );
}
