'use client';

import { FormEvent, useState } from 'react';

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

export interface ModalProps {
  readonly config: {
    readonly buttonLabel: string;
    readonly title: string;
    readonly description: string;
    readonly inputLabel: string;
  };
  readonly onFormSubmit: (value: string) => void;
}

export function InputModal({ config, onFormSubmit }: ModalProps) {
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFormSubmit(name);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>{config.buttonLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label htmlFor="name" className="text-right">
                {config.inputLabel}
              </Label>
              <Input
                required={true}
                id="name"
                className="col-span-3"
                onChange={(e) => setName(e.target.value)}
              />
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
