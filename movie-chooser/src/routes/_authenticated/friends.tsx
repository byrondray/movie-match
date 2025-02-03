import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';
import {
  userQueryOptions,
  friendsQueryOptions,
  addFriendMutationOptions,
  getFriendByEmailQueryOptions,
} from '../../lib/api';

const FriendsPage = () => {
  const [email, setEmail] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery(userQueryOptions);

  const {
    data: friendsData,
    isLoading: isFriendsLoading,
    isError: isFriendsError,
    error: friendsError,
  } = useQuery({
    ...friendsQueryOptions(user?.id ?? ''),
    enabled: !!user?.id,
  });

  const {
    refetch: searchFriendByEmail,
    isError: isSearchError,
    error: searchError,
  } = useQuery({
    ...getFriendByEmailQueryOptions(email),
    enabled: false,
  });

  const addFriendMutation = useMutation({
    ...addFriendMutationOptions,
    onSuccess: () => {
      setEmail('');
      queryClient.invalidateQueries({ queryKey: ['friends', user?.id] });
    },
  });

  const handleAddFriend = async () => {
    if (!email || !user?.id) return;

    try {
      const searchResult = await searchFriendByEmail();
      const friendData = searchResult.data;

      if (friendData?.data) {
        await addFriendMutation.mutate({
          userId: user.id,
          friendId: friendData.data.id,
        });
      }
    } catch (err) {
      console.error('Error adding friend:', err);
    }
  };

  if (isFriendsLoading) {
    return (
      <div className='p-6 mx-auto max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Friends List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex space-x-2 mb-6'>
              <Skeleton className='h-10 flex-1' />
              <Skeleton className='h-10 w-32' />
            </div>
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex items-center space-x-4 p-2'>
                  <Skeleton className='h-12 w-12 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-4 w-48' />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='p-6 mx-auto max-w-2xl'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Friends List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex space-x-2 mb-6'>
            <Input
              type='email'
              placeholder='Add friend by email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={addFriendMutation.isPending}
            />
            <Button
              onClick={handleAddFriend}
              disabled={addFriendMutation.isPending}
              className='bg-gradient-to-b from-[#B5EF8A] to-[#0ACDFF] text-black hover:opacity-90'
            >
              {addFriendMutation.isPending ? 'Adding...' : 'Add Friend'}
            </Button>
          </div>

          {(isFriendsError || isSearchError || addFriendMutation.isError) && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>
                {friendsError?.message ||
                  searchError?.message ||
                  addFriendMutation.error?.message ||
                  'An error occurred. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {addFriendMutation.isSuccess && (
            <Alert className='mb-4'>
              <AlertDescription>Friend added successfully!</AlertDescription>
            </Alert>
          )}

          <div className='space-y-4'>
            {friendsData?.data?.map((friend) => (
              <div
                key={friend.id}
                className='flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100'
              >
                <Avatar>
                  <AvatarImage src={friend.picture} />
                  <AvatarFallback>
                    {friend.name?.charAt(0) ?? friend.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className='font-medium'>{friend.name}</div>
                  <div className='text-sm text-gray-500'>{friend.email}</div>
                </div>
              </div>
            ))}

            {(!friendsData?.data || friendsData.data.length === 0) && (
              <div className='text-center text-gray-500 py-8'>
                No friends added yet. Start by adding someone!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsPage;
