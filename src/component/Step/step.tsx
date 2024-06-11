import React, { useEffect } from 'react';
import { Steps } from 'antd';
import { useFile } from '../../context/FileContext';
import { publicSupabase } from '../../api/SupabaseClient';
import { useParams } from 'react-router-dom';


let description = 'This is a description.';
const Step: React.FC = () => {

  const { fileId } = useParams();
//   const {
//     fileData,
//     setFileData,
//   } = useFile();
  useEffect(() => {
    fetchFileDetails();
  })
    const fetchFileDetails = async () => {
        try {
          const { data, error } = await publicSupabase
            .from('filedetails')
            .select('*')
            .eq('id', fileId);
    
          if (error) {
            throw error;
          }
    
          console.log(data);
        //   setFileData(data);
        } catch (error) {
          console.error('Error fetching file details:', error);
        }
      };
  return (
    <Steps
      direction="vertical"
      current={1}
      items={[
        {
          title: 'Pending',
          description,
        },
        {
          title: 'Wating',
          description,
        },
        {
          title: 'Waiting',
          description,
        },
      ]}
    />
  );
};

export default Step;
