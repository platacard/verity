'use client';

import { useState } from 'react';

import { User } from '@prisma/client';
import { Copy } from 'lucide-react';

import { Button } from '@verity/ui/button';
import { Toaster } from '@verity/ui/toaster';

import { useFetchErrorToast } from '../utils/show-fetch-error';
import { useSuccessToast } from '../utils/show-success-toast';

export interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const [currentUser, setCurrentUser] = useState<User>(user);
  const showFetchError = useFetchErrorToast();
  const showSuccessToast = useSuccessToast('Token copied to clipboard');

  const generateCiToken = async () => {
    try {
      const response = await fetch('/api/auth/generate-ci-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return showFetchError();

      const data = await response.json();
      setCurrentUser({ ...currentUser, ciToken: data.ciToken });
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast();
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    currentUser && (
      <div className="p-4">
        <h1 className="font-bold">User Profile</h1>
        <div>
          <b>Name:</b> {currentUser.name}
        </div>
        <div>
          <b>Email:</b> {currentUser.email}
        </div>
        <div className="font-bold">CI token:</div>
        {currentUser.ciToken && (
          <div className="flex mt-1">
            <pre className="border w-fit p-2">{currentUser.ciToken}</pre>
            <Button onClick={() => currentUser.ciToken && copyToClipboard(currentUser.ciToken)}>
              <Copy />
            </Button>
          </div>
        )}
        {!currentUser.ciToken && <Button onClick={generateCiToken}>Generate CI Token</Button>}
        <Toaster />
      </div>
    )
  );
};
