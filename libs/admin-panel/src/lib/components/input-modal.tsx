'use client';

import { FormEvent, ReactNode, useState } from 'react';

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

export interface InputModalProps {
  readonly buttonLabel: string;
  readonly title: string;
  readonly description?: string;
  readonly onFormSubmit: (values: Record<string, string>) => void;
  readonly children: ReactNode;
}

export function InputModal({ buttonLabel, title, description, onFormSubmit, children }: InputModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form) as unknown as Iterable<[string, string]>;
    const values = Object.fromEntries(formData) as Record<string, string>;
    onFormSubmit(values);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>{buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <InputModalContent>{children}</InputModalContent>
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

export function InputModalContent({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 py-4">{children}</div>;
}
