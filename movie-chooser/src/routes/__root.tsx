import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

interface MyRouterContext {
  queryClient: QueryClient;
}

// Define the root route with context
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  return (
    <>
      <NavBar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

function NavBar() {
  return (
    <>
      <div className='p-2 flex gap-2'>
        <Link to='/' className='[&.active]:font-bold'>
          Home
        </Link>
        <Link to='/friends' className='[&.active]:font-bold'>
          Friends
        </Link>
        <Link to='/roundHistory' className='[&.active]:font-bold'>
          Rounds
        </Link>
        <Link to='/profile' className='[&.active]:font-bold'>
          Profile
        </Link>
      </div>
      <hr />
    </>
  );
}
