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

    const handleCheckboxChange = (event:any) => {
        const isChecked = event.target.checked;
        const value = event.target.value;
    
        if (isChecked) {
          setCheckedBoxes([...checkedBoxes, value]);
        } else {
          setCheckedBoxes(checkedBoxes.filter((box:any) => box !== value));
        }
      };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleFront = () => {
    navigate('/file-submission');
  };

  const allChecked = checkedBoxes.length === 5; 
    
    return(
        <>
        <Button className="mb-8" onClick={handleBack}>
        Back
      </Button>
        <div className='flex flex-col justify-center items-center'>

        <div>Check all the checkbox to proceed.</div>
        <div className='flex flex-col justify-center items-center space-y-8 h-96'>
        <div className='flex flex-col space-y-8'>
        <Checkbox onChange={handleCheckboxChange}>Checkbox</Checkbox>
        <Checkbox onChange={handleCheckboxChange}>Checkbox</Checkbox>
        <Checkbox onChange={handleCheckboxChange}>Checkbox</Checkbox>
        <Checkbox onChange={handleCheckboxChange}>Checkbox</Checkbox>
        <Checkbox onChange={handleCheckboxChange}>Checkbox</Checkbox>
        </div>
        <Button disabled={!allChecked} onClick={handleFront} style={{ width: "150px"}}>Proceed</Button>
        </div>
        </div>
        </>
    )
}
export default Agreement;