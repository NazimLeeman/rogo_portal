import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import Text from '@/component/ui/text';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadFeature from '../component/Upload/supabaseUpload';
import { useFile } from '../context/FileContext';

const StudentFileSubmission: React.FC = () => {
  const { studentInfo, studentFiles } = useFile();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/agreement');
  };

  return (
    <div className="max-w-screen-md mx-auto px-8 py-14 md:py-8 space-y-10">
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
          Review your information and upload your documents
        </Text>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label>First Name</Label>
            <Input defaultValue={studentInfo?.first_name} disabled />
          </div>
          <div className="grid gap-1.5">
            <Label>Last Name</Label>
            <Input defaultValue={studentInfo?.last_name} disabled />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input defaultValue={studentInfo?.email} disabled />
          </div>
          <div className="grid gap-1.5">
            <Label>Phone</Label>
            <Input defaultValue={studentInfo?.phone_number ?? ''} disabled />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label>University</Label>
            <Input defaultValue={studentFiles?.university_name} disabled />
          </div>
          <div className="grid gap-1.5">
            <Label>Program</Label>
            <Input defaultValue={studentFiles?.program} disabled />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label>Subject</Label>
            <Input defaultValue={studentFiles?.subject} disabled />
          </div>
          <div className="grid gap-1.5">
            <Label>Payment</Label>
            <Input defaultValue={studentFiles?.budget} disabled />
          </div>
        </div>
      </div>

      <UploadFeature />
    </div>
  );
};

export default StudentFileSubmission;
