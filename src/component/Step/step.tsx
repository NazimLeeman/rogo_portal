import React, { useEffect, useState } from 'react';
import { Button, message, Steps, theme  } from 'antd';
import { useFile } from '../../context/FileContext';
import { publicSupabase } from '../../api/SupabaseClient';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../utils/helper';

interface StepProps {
  statusType: 'payment' | 'fileStatus'; // Define the possible values for statusType
}

const steps = [
  {
    title: 'Submitted',
    description: 'This is a description.',
    content: 'First-content',
  },
  {
    title: 'In Progress',
    description: 'This is a description.',
    content: 'Second-content',
  },
  {
    title: 'Completed',
    description: 'This is a description.',
    content: 'Last-content',
  },
];

// let description = 'This is a description.';
const Step: React.FC<StepProps> = ({ statusType }) => {
  const { fileId } = useParams();
  const { fileData, setFileData, currentStatus, setCurrentStatus } = useFile();
  const { token } = theme.useToken();
  // const [currentStatus, setCurrentStatus] = useState(0);

  useEffect(() => {
    console.log('fileData', fileData);
  });

  const formattedDate = formatDate(fileData.created_at);


  const next = () => {
    setCurrentStatus(currentStatus + 1);
  };

  const prev = () => {
    setCurrentStatus(currentStatus - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title, description: item.description }));

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
