import { Button } from '@/component/ui/button';
import Text from '@/component/ui/text';
import { Checkbox } from 'antd';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Agreement: React.FC = () => {
  const [checkedBoxes, setCheckedBoxes] = useState<any[]>([]);

  const navigate = useNavigate();

  const handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    const value = event.target.value;

    if (isChecked) {
      setCheckedBoxes([...checkedBoxes, value]);
    } else {
      setCheckedBoxes(checkedBoxes.filter((box: any) => box !== value));
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleFront = () => {
    navigate('/file-submission');
  };

  const allChecked = checkedBoxes.length === 5;

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
          Before continuing, please make sure all the checklists are ticked from
          your end.
        </Text>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <Checkbox onChange={handleCheckboxChange}>
            SSC Marksheet + Certificate
          </Checkbox>
          <Checkbox onChange={handleCheckboxChange}>
            HSC Marksheet + Certificate (Can be provisional)
          </Checkbox>
          <Checkbox onChange={handleCheckboxChange}>
            Bachelors Certificates + marksheets (For Master's students only)
          </Checkbox>
          <Checkbox onChange={handleCheckboxChange}>
            Attestation from Education board + Education Ministry + Foreign
            Ministry (backside of the main copy and front side of the photocopy
            (4 pieces))
          </Checkbox>
          <Checkbox onChange={handleCheckboxChange}>Valid Passport</Checkbox>
        </div>
        <Button disabled={!allChecked} onClick={handleFront}>
          Proceed
        </Button>
      </div>
    </div>
  );
};
export default Agreement;
