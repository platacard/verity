'use client';

import { useState } from 'react';

import { Trash2 } from 'lucide-react';

import { Button } from '@verity/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@verity/ui/dialog';

export interface ConfirmationModalProps {
  readonly title: string;
  readonly message: string;
  readonly onConfirm: () => void;
}

export function ConfirmationModal({ title, message, onConfirm }: ConfirmationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="icon" asChild>
          <div>
            <Trash2 size="16" color="red" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{message}</DialogDescription>
        <DialogFooter>
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
