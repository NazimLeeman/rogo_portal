import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme  } from 'antd';
import { useFile } from '../../context/FileContext';
import { publicSupabase } from '../../api/SupabaseClient';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../utils/helper';

interface StepProps {
  statusType: 'payment' | 'fileStatus'; // Define the possible values for statusType
}


// let description = 'This is a description.';
const Step: React.FC<StepProps> = ({ statusType }) => {
  const { fileId } = useParams();
  const { fileData, setFileData, currentStatus, setCurrentStatus, step, setStep } = useFile();
  const { token } = theme.useToken();
  // const [currentStatus, setCurrentStatus] = useState(0);
  
  useEffect(() => {
    console.log('setStep', step);
    console.log('satteeeeeee', currentStatus)
    });

    useEffect(() => {
      stepsData()
    })

    const formattedDate = formatDate(step[0].description);
    const title = step[0].title;
    const content = step[0].content;
    
      const steps = [
        {
          title: "",
          description: "",
          content: 'First-content',
          state: 0
        },
        {
          title: 'In Progress',
          description: 'Not Started',
          content: 'Second-content',
          state: 1
        },
        {
          title: 'Completed',
          description: 'Not Started',
          content: 'Last-content',
          state: 2
        },
      ];

      const stepsData = () => {
        console.log('updated states',updatedSteps)
      }

      const updatedSteps = steps.map(stepItem => {
        const matchingItem = step.find((item:any) => item.state === stepItem.state);

        if (matchingItem) {
          return {
            ...stepItem,
            title: matchingItem.title,
            description: matchingItem.description
          };
        }
        
        return stepItem;
      });
    



  const next = () => {
    setCurrentStatus(currentStatus + 1);
  };

  const prev = () => {
    setCurrentStatus(currentStatus - 1);
  };

  const items = updatedSteps.map((item) => ({ key: item.title, title: item.title, description: item.description }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '100px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      {statusType === 'fileStatus' && (
        <>
        <Steps current={currentStatus} items={items} />
        <div style={contentStyle}>{steps[currentStatus].content}</div>
        <div style={{ marginTop: 24 }}>
          {currentStatus < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {currentStatus === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {currentStatus > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
        </>
        // <Steps
        //   direction="vertical"
        //   current={1}
        //   items={[
        //     {
        //       title: fileData.fileStatus,
        //       description: `Submittted at ${formattedDate}`,
        //     },
        //     {
        //       title: 'In progress',
        //       description: 'Your document has been submitted.',
        //     },
        //     {
        //       title: 'Finished',
        //       description: 'File submission successfully done.',
        //     },
        //   ]}
        // />
      )}
      {statusType === 'payment' && (
        <>
        <Steps current={currentStatus} items={items} />
        <div style={contentStyle}>{steps[currentStatus].content}</div>
        <div style={{ marginTop: 24 }}>
          {currentStatus < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {currentStatus === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {currentStatus > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
        </>
        // <Steps
        //   direction="vertical"
        //   current={1}
        //   items={[
        //     {
        //       title: 'First installment',
        //       description: `Submittted at ${formattedDate}`,
        //     },
        //     {
        //       title: 'Second installment',
        //       description: 'Yet to be paid.',
        //     },
        //     {
        //       title: 'Third installment',
        //       description: 'Yet to be paid.',
        //     },
        //   ]}
        // />
      )}
    </>
  );
};

export default Step;
