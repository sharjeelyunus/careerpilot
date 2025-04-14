import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  open?: boolean;
}

export function Modal({ title, children, className, onClose, open: controlledOpen }: ModalProps) {
  const [open, setOpen] = useState(false);
  
  // Handle controlled open state
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen);
    }
  }, [controlledOpen]);
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' className={className}>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-auto'>
        {children}
      </DialogContent>
    </Dialog>
  );
}
