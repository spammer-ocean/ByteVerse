import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GradientLoader from './GradientLoader';

interface LoadingModalProps {
  open: boolean;
  text?: string;
}

const LoadingModal = ({ open, text = "Processing your application" }: LoadingModalProps) => {
  return (
    <Dialog open={open} modal={true}>
      <DialogContent className="sm:max-w-md border-none bg-[#131c24]/80 backdrop-blur-md">
        <div className="flex flex-col items-center justify-center py-8">
          <GradientLoader text={text} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;