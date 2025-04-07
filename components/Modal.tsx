import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ title, children, className }: ModalProps) {
  return (
    <Dialog>
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
