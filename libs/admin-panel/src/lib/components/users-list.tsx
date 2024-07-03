'use client';

import { useEffect, useState } from 'react';

import { UserRole } from '@prisma/client';

import { UserWithRole } from '@verity/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@verity/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@verity/ui/table';

import { useFetchErrorToast } from '../utils/show-fetch-error';

export interface UsersListProps {
  currentUser: UserWithRole;
}

export const UsersList = ({ currentUser }: UsersListProps) => {
  const [userList, setUserList] = useState<UserWithRole[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const showFetchError = useFetchErrorToast();

  useEffect(() => {
    void fetchUsers();
    void fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('api/users');
      const data: UserWithRole[] = await response.json();

      if (!response.ok) return showFetchError();

      setUserList(data);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('api/user-roles');
      const data: UserRole[] = await response.json();

      if (!response.ok) return showFetchError();

      setRoles(data);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const handleUserRoleChange = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(`api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) return showFetchError();

      void fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  return (
    <div className="p-4">
      <h1 className="font-bold">Users List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Select
                  disabled={currentUser.id === user.id}
                  value={user.role ? user.role.id : ''}
                  onValueChange={(roleId) => handleUserRoleChange(user.id, roleId)}
                >
                  <SelectTrigger>
                    <SelectValue>{user.role ? user.role.name : 'not assigned'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="SelectContent">
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
