import React, { useEffect } from 'react';
import { Steps } from 'antd';
import { useFile } from '../../context/FileContext';
import { publicSupabase } from '../../api/SupabaseClient';
import { useParams } from 'react-router-dom';

interface StepProps {
  statusType: 'payment' | 'fileStatus'; // Define the possible values for statusType
}

let description = 'This is a description.';
const Step: React.FC<StepProps> = ({ statusType }) => {
  const { fileId } = useParams();
  const { fileData, setFileData } = useFile();

  useEffect(() => {
    console.log('fileData', fileData);
  });

  const formatDate = (dataString: any) => {
    const date = new Date(dataString);

    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${month} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
  };

  const formattedDate = formatDate(fileData.created_at);

  return (
    <>
      {statusType === 'fileStatus' && (
        <Steps
          direction="vertical"
          current={1}
          items={[
            {
              title: fileData.fileStatus,
              description: `Submittted at ${formattedDate}`,
            },
            {
              title: 'In progress',
              description: 'Your document has been submitted.',
            },
            {
              title: 'Finished',
              description: 'File submission successfully done.',
            },
          ]}
        />
      )}
      {statusType === 'payment' && (
        <Steps
          direction="vertical"
          current={1}
          items={[
            {
              title: 'First installment',
              description: `Submittted at ${formattedDate}`,
            },
            {
              title: 'Second installment',
              description: 'Yet to be paid.',
            },
            {
              title: 'Third installment',
              description: 'Yet to be paid.',
            },
          ]}
        />
      )}
    </>
  );
};

export default Step;
