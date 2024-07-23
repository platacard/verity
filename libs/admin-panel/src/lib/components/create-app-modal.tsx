'use client';

import { FormEvent, useEffect, useState } from 'react';

import { AppWithVersionsAndDeps } from '@verity/app';
import { ScopeExtended } from '@verity/scopes';
import { Button } from '@verity/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@verity/ui/dialog';
import { Input } from '@verity/ui/input';
import { Label } from '@verity/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@verity/ui/select';

import { useFetchErrorToast } from '../utils/show-fetch-error';

export interface CreateAppModalResult {
  readonly name: string | null;
  readonly scopeId: number | null;
}

export const CreateAppModal = ({
  onFormSubmit,
}: {
  onFormSubmit: (result: CreateAppModalResult) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<CreateAppModalResult>({ name: null, scopeId: null });
  const [scopesList, setScopesList] = useState<ScopeExtended[]>([]);
  const [selectedScope, setSelectedScope] = useState<ScopeExtended | null>(null);
  const showFetchError = useFetchErrorToast();

  useEffect(() => {
    if (isOpen) {
      void updateScopesList();
    } else {
      setResult({ name: null, scopeId: null });
      setSelectedScope(null);
    }
  }, [isOpen]);

  const updateScopesList = async () => {
    try {
      const response = await fetch('api/scopes');
      const data: ScopeExtended[] = await response.json();

      if (!response.ok) return showFetchError();

      setScopesList(data);
    } catch (error) {
      console.error('Error:', error);
      showFetchError();
    }
  };

  const handleNameChange = (name: string) => {
    setResult((prev) => ({ ...prev, name }));
  };

  const handleScopeChange = (scopeId: number) => {
    const scope = scopesList.find((scope) => scope.id === scopeId);
    setSelectedScope(scope || null);
    setResult((prev) => ({ ...prev, scopeId }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFormSubmit(result);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>+ Create App</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new App</DialogTitle>
          <DialogDescription>Create new application instance</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label htmlFor="name" className="text-right">
                Name:
              </Label>
              <Input
                required={true}
                id="name"
                className="col-span-3"
                onChange={(e) => handleNameChange(e.target.value)}
              />
              <Label className="mt-4">Scope:</Label>
              <Select required={true} onValueChange={(id) => handleScopeChange(+id)}>
                <SelectTrigger>
                  <SelectValue>{selectedScope ? selectedScope.name : 'Select a Scope'}</SelectValue>
                </SelectTrigger>
                <SelectContent className="SelectContent">
                  {scopesList.map((scope) => (
                    <SelectItem key={scope.id} value={scope.id.toString()}>
                      {scope.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">OK</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
