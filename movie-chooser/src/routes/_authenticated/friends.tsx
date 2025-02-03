import React, { useState } from 'react';
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

const FriendsPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [friends, setFriends] = useState([
    { id: 1, name: 'Demo User', email: 'demo@example.com', avatar: '' },
  ]);

  const handleAddFriend = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      const newFriend = {
        id: friends.length + 1,
        name: 'New Friend',
        email: email,
        avatar: '',
      };

      setFriends([...friends, newFriend]);
      setSuccess('Friend added successfully!');
      setEmail('');
      setError('');
    } catch (err) {
      setError('Failed to add friend. Please try again.');
    }
  };

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
            />
            <Button
              onClick={handleAddFriend}
              className='bg-gradient-to-b from-[#B5EF8A] to-[#0ACDFF] text-black hover:opacity-90'
            >
              Add Friend
            </Button>
          </div>

          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className='mb-4'>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-4'>
            {friends.map((friend) => (
              <div
                key={friend.id}
                className='flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100'
              >
                <Avatar>
                  <AvatarImage src={friend.avatar} />
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

            {friends.length === 0 && (
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
