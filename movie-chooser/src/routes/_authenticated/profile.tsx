import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { userQueryOptions, getUserGenresOptions } from '../../lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Link } from '@tanstack/react-router';
import { Settings, LogOut } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
});

function Profile() {
  const {
    isPending: isUserPending,
    error: userError,
    data: userData,
  } = useQuery(userQueryOptions);

  const { data: genresData, isPending: isGenresPending } = useQuery({
    ...getUserGenresOptions(userData?.id ?? ''),
    enabled: !!userData?.id,
  });

  if (isUserPending) {
    return (
      <div className='container mx-auto max-w-2xl p-6'>
        <Card>
          <CardHeader>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-12 w-12 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-4 w-32' />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userError) {
    return (
      <div className='container mx-auto max-w-2xl p-6'>
        <Card className='border-red-200 bg-red-50'>
          <CardContent className='pt-6'>
            <p className='text-red-600'>Error: {userError.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-2xl p-6 space-y-6'>
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-12 w-12'>
                <AvatarImage src={userData.picture} />
                <AvatarFallback>
                  {userData.given_name?.[0]}
                  {userData.family_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className='text-2xl'>
                  {userData.given_name} {userData.family_name}
                </CardTitle>
                <p className='text-sm text-gray-500'>{userData.email}</p>
              </div>
            </div>
            <Button variant='outline' asChild>
              <a href='/api/logout' className='flex items-center gap-2'>
                <LogOut className='h-4 w-4' />
                Logout
              </a>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Genres Card */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Favorite Genres</CardTitle>
          <Button asChild>
            <Link to='/userGenres' className='flex items-center gap-2'>
              <Settings className='h-4 w-4' />
              Manage Genres
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isGenresPending ? (
            <div className='flex gap-2 flex-wrap'>
              <Skeleton className='h-8 w-24' />
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-28' />
            </div>
          ) : genresData?.data?.length ? (
            <div className='flex gap-2 flex-wrap'>
              {genresData.data.map(
                (genre: { genreSchmea: { id: string; genre: string } }) => (
                  <Badge key={genre.genreSchmea.id} variant='secondary'>
                    {genre.genreSchmea.genre}
                  </Badge>
                )
              )}
            </div>
          ) : (
            <p className='text-sm text-gray-500'>
              No favorite genres selected. Click 'Manage Genres' to add some!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Additional Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {Object.entries(userData).map(([key, value]) => {
            // Skip certain fields we've already displayed or don't want to show
            if (['picture', 'email', 'given_name', 'family_name'].includes(key))
              return null;
            return (
              <div key={key} className='flex justify-between'>
                <span className='text-sm font-medium capitalize'>
                  {key.replace(/_/g, ' ')}
                </span>
                <span className='text-sm text-gray-500'>{String(value)}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
