import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import Text from '@/component/ui/text';
import { ChevronLeft } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadFeature from '../component/Upload/supabaseUpload';
import { useFile } from '../context/FileContext';
import { useRole } from '@/hooks/useRole';

const StudentFileSubmission: React.FC = () => {
  const { userRole } = useRole();
  const { studentInfo, studentFiles } = useFile();
  const [formData, setFormData] = useState<any>({
    firstName: studentInfo?.first_name || '',
    lastName: studentInfo?.last_name || '',
    email: studentInfo?.email || '',
    phone: studentInfo?.phone_number || '',
    university: studentFiles?.university_name || '',
    program: studentFiles?.program || '',
    subject: studentFiles?.subject || '',
    payment: studentFiles?.budget || '',
  });

  const [changedFields, setChangedFields] = useState<any>({});

  useEffect(() => {
    // Update formData when props change
    setFormData({
      firstName: studentInfo?.first_name || '',
      lastName: studentInfo?.last_name || '',
      email: studentInfo?.email || '',
      phone: studentInfo?.phone_number || '',
      university: studentFiles?.university_name || '',
      program: studentFiles?.program || '',
      subject: studentFiles?.subject || '',
      payment: studentFiles?.budget || '',
    });
    // Reset changedFields when props change
    setChangedFields({});
  }, [studentInfo, studentFiles]);

  const handleInputChange = useCallback((field: any, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setChangedFields((prev: any) => ({ ...prev, [field]: true }));
  }, []);

  const getChangedValues = useCallback(() => {
    return Object.keys(changedFields).reduce((acc: any, field: string) => {
      if (changedFields[field]) {
        acc[field] = formData[field];
      }
      return acc;
    }, {});
  }, [changedFields, formData]);

  const navigate = useNavigate();

  const isAdmin = userRole === 'Admin';

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
            <Input
              defaultValue={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Last Name</Label>
            <Input
              defaultValue={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input
              defaultValue={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Phone</Label>
            <Input
              defaultValue={formData.phone ?? ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label>University</Label>
            <Input
              defaultValue={formData.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Program</Label>
            <Input
              defaultValue={formData.program}
              onChange={(e) => handleInputChange('program', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-1.5">
            <Label>Subject</Label>
            <Input
              defaultValue={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Payment</Label>
            <Input
              defaultValue={formData.payment}
              onChange={(e) => handleInputChange('payment', e.target.value)}
              disabled={!isAdmin}
            />
          </div>
        </div>
      </div>

      <UploadFeature changedValues={getChangedValues()} />
    </div>
  );
};

export default StudentFileSubmission;
