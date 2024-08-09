'use client';

import { useEffect, useState } from 'react';

import { ScopeExtended } from '@verity/scopes';
import { DefaultUserRoles } from '@verity/user-roles';

import { useFetchErrorToast } from '../utils/show-fetch-error';
import { ConfirmationModal } from './confirmation-modal';
import { InputModal } from './input-modal';

export const ScopesComponent = ({ userRole }: { userRole: DefaultUserRoles }) => {
  const [scopes, setScopes] = useState<ScopeExtended[]>([]);
  const showFetchError = useFetchErrorToast();

  useEffect(() => void updateScopes(), []);

  const updateScopes = async () => {
    try {
      const response = await fetch('api/scopes');
      const data: ScopeExtended[] = await response.json();

      if (!response.ok) return showFetchError();

      setScopes(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddScope = async (name: string) => {
    try {
      const response = await fetch('api/scopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data: ScopeExtended = await response.json();

      if (!response.ok) return showFetchError();

      setScopes([...scopes, data]);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`api/scopes/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) return showFetchError();

      await updateScopes();
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold">Scopes</h1>
        <InputModal
          config={{
            buttonLabel: '+ Create Scope',
            title: 'Create new Scope',
            description: 'Create new scope',
            inputLabel: 'Name:',
          }}
          onFormSubmit={handleAddScope}
        />
      </div>
      <div className="mt-4">
        {scopes.map((scope) => (
          <div key={scope.id} className="p-4 bg-white shadow rounded-lg mt-4 relative">
            {userRole === DefaultUserRoles.ADMIN && (
              <div className="absolute right-1 top-1">
                <ConfirmationModal
                  title={`Remove scope: ${scope.name}`}
                  message={
                    'You are going to completely remove the scope with all nested entities. Are you sure?'
                  }
                  onConfirm={() => handleDelete(scope.id)}
                />
              </div>
            )}

            <h2 className="text-lg font-bold">{scope.name}</h2>
            <p className="text-sm mt-2">ID: {scope.id}</p>
            <p className="text-sm text-gray-500 mt-2">
              Users: {scope.users?.map((user) => user.email + ', ')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Apps: {scope.apps?.map((app) => app.name + ', ')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Versions: {scope.versions?.map((version) => version.value + ', ')}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Dependencies: {scope.dependencies?.map((dep) => dep.id + ', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
