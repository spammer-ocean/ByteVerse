import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, message = 'Loading...' }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          // Slow down as it approaches 90%
          if (prevProgress >= 90) {
            return prevProgress;
          }
          const diff = Math.random() * 10;
          return Math.min(prevProgress + diff, 90);
        });
      }, 800);
      
      return () => {
        clearInterval(timer);
        setProgress(100);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose={true}>
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fintech-600"></div>
          </div>
          <h3 className="font-medium text-lg mb-2">Processing</h3>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">This may take a minute or two</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;