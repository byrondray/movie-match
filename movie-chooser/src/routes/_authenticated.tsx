import * as React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '../lib/api'

const Login = () => {
  return (
    <div className="p-2">
      <h3>Please login</h3>
      <a href="/api/login">Login</a>
    </div>
  )
}

const Component = () => {
  const routeContext = Route.useRouteContext() as { user: any }
  const { user } = routeContext

  if (!user || !user.id) {
    return <Login />
  }

  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient
    try {
      const user = await queryClient.fetchQuery(userQueryOptions)

      return { user }
    } catch (error) {
      return { user: null }
    }
  },
  component: Component,
})
