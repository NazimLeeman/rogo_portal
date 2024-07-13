import { Button } from '@/component/ui/button';
import Text from '@/component/ui/text';
import { Checkbox } from 'antd';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileRejection: React.FC = () => {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleFront = () => {
    navigate('/agreement');
  };

  return (
    <div className="flex max-w-screen-md mx-auto flex-col space-y-6 px-8 py-14 md:py-8">
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-max"
          onClick={handleBack}
          size="sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Text variant="heading-lg" className="mt-6">
          Sorry this file was rejected.
        </Text>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
            This is reason for your rejection. You will need to submit your files again.
        </div>
        <Button onClick={handleFront}>
          Click here
        </Button>
      </div>
    </div>
  );
};
export default FileRejection;
