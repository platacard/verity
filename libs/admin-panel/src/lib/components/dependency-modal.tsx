'use client';

import { FormEvent, useEffect, useState } from 'react';

import { App, Version } from '@prisma/client';

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
  readonly onFormSubmit: (versionId: number) => void;
}

export function DependencyModal({ currentAppId, onFormSubmit }: DependencyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);
  const [version, setVersion] = useState<Version | null>(null);
  const [appsIds, setAppsIds] = useState<string[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const showFetchError = useFetchErrorToast();

  useEffect(() => {
    const updateAppsIds = async () => {
      try {
        const response = await fetch('api/apps');
        const data: App[] = await response.json();

        if (!response.ok) return showFetchError();

        const ids = data.map(({ id }) => id).filter((id) => id !== currentAppId);
        setAppsIds(ids);
      } catch (error) {
        console.error('Error:', error);
        showFetchError();
      }
    };

    if (isOpen) {
      void updateAppsIds();
    } else {
      resetState();
    }
  }, [isOpen]);

  useEffect(() => {
    const updateVersions = async () => {
      try {
        const response = await fetch(`api/apps/${appId}/versions`);
        const data: Version[] = await response.json();

        if (!response.ok) return showFetchError();

        setVersions(data);
      } catch (error) {
        console.error('Error:', error);
        showFetchError();
      }
    };

    if (appId) {
      void updateVersions();
    }
  }, [appId]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!version?.id) return;
    onFormSubmit(version.id);
    setIsOpen(false);
  };

  const handleVersionChange = (id: number) => {
    const version = versions.find((version) => version.id === id) ?? null;
    setVersion(version);
  };

  const resetState = () => {
    setAppId(null);
    setVersion(null);
    setAppsIds([]);
    setVersions([]);
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
              <Select onValueChange={(id) => setAppId(id)}>
                <SelectTrigger>
                  <SelectValue>{appId}</SelectValue>
                </SelectTrigger>
                <SelectContent className="SelectContent">
                  {appsIds.map((appId) => (
                    <SelectItem key={appId} value={appId}>
                      {appId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Available Versions:</Label>
              <Select disabled={!appId} required onValueChange={(id) => handleVersionChange(+id)}>
                <SelectTrigger>
                  <SelectValue>{version?.value ?? ''}</SelectValue>
                </SelectTrigger>
                <SelectContent className="SelectContent">
                  {versions.map((version) => (
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
