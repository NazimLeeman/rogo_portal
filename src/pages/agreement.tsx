import React, { useState } from 'react';
import { Button, Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import { useNavigate } from 'react-router-dom';

// const onChange: CheckboxProps['onChange'] = (e) => {
//   console.log(`checked = ${e.target.checked}`);
// };

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
    <>
      <Button className="mb-8" onClick={handleBack}>
        Back
      </Button>
      <div className="flex flex-col justify-center items-center">
        <div>
          Before continuing a file, please make sure all the checklists are
          ticked from your end.
        </div>
        <div className="flex flex-col justify-center items-center space-y-8 h-96">
          <div className="flex flex-col space-y-8">
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
              Ministry (backside of the main copy and front side of the
              photocopy (4 pieces))
            </Checkbox>
            <Checkbox onChange={handleCheckboxChange}>Valid Passport</Checkbox>
          </div>
          <Button
            disabled={!allChecked}
            onClick={handleFront}
            style={{ width: '150px' }}
          >
            Proceed
          </Button>
        </div>
      </div>
    </>
  );
};
export default Agreement;
