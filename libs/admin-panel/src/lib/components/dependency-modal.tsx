'use client';

import { FormEvent, useEffect, useState } from 'react';

import { Version } from '@prisma/client';

import { AppWithVersionsAndDeps } from '@verity/app';
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
import { Label } from '@verity/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@verity/ui/select';

import { useFetchErrorToast } from '../utils/show-fetch-error';

export interface DependencyModalProps {
  readonly currentAppId: string;
  readonly onFormSubmit: (versionId: string) => void;
}

export function DependencyModal({ currentAppId, onFormSubmit }: DependencyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [appsList, setAppsList] = useState<AppWithVersionsAndDeps[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppWithVersionsAndDeps | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const showFetchError = useFetchErrorToast();

  useEffect(() => {
    const updateAppsList = async () => {
      try {
        const response = await fetch('api/apps');
        const data: AppWithVersionsAndDeps[] = await response.json();

        if (!response.ok) return showFetchError();

        const apps = data.filter(({ id }) => id !== currentAppId);
        setAppsList(apps);
      } catch (error) {
        console.error('Error:', error);
        showFetchError();
      }
    };

    if (isOpen) {
      void updateAppsList();
    } else {
      resetState();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVersion) return;
    onFormSubmit(selectedVersion.id);
    setIsOpen(false);
  };

  const handleAppSelect = (id: string) => {
    const app = appsList.find((app) => app.id === id) ?? null;

    setSelectedApp(app);
    setSelectedVersion(null);
  };

  const handleVersionChange = (id: string) => {
    const version = selectedApp?.versions.find((version) => version.id === id) ?? null;
    setSelectedVersion(version);
  };

  const resetState = () => {
    setSelectedApp(null);
    setSelectedVersion(null);
    setAppsList([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs" onClick={() => setIsOpen(true)}>
          + Add Dependency
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Dependency</DialogTitle>
          <DialogDescription>Create new Dependency for Application version</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label>Available Apps:</Label>
              <Select onValueChange={(id) => handleAppSelect(id)}>
                <SelectTrigger>
                  <SelectValue>{selectedApp ? selectedApp.name : 'Select an app'}</SelectValue>
                </SelectTrigger>
                <SelectContent className="SelectContent">
                  {appsList.map((app) => (
                    <SelectItem key={app.id} value={app.id.toString()}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Available Versions:</Label>
              <Select
                disabled={!selectedApp}
                required
                onValueChange={(id) => handleVersionChange(id)}
              >
                <SelectTrigger>
                  <SelectValue>{selectedVersion?.value ?? ''}</SelectValue>
                </SelectTrigger>
                <SelectContent className="SelectContent">
                  {selectedApp?.versions.map((version) => (
                    <SelectItem key={version.id} value={version.id.toString()}>
                      {version.value}
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
}
