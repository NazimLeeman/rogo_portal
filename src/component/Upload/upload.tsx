// import React, { useState } from 'react';
// import { UploadOutlined } from '@ant-design/icons';
// import { Button, message, Upload } from 'antd';
// import type { GetProp, UploadFile, UploadProps } from 'antd';

// type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

// const UploadFeature: React.FC = () => {
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [uploading, setUploading] = useState(false);

//   const handleUpload = () => {
//     const formData = new FormData();
//     fileList.forEach((file) => {
//       formData.append('files[]', file as FileType);
//     });
//     setUploading(true);
//     // You can use any AJAX library you like
//     fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then(() => {
//         setFileList([]);
//         message.success('upload successfully.');
//       })
//       .catch(() => {
//         message.error('upload failed.');
//       })
//       .finally(() => {
//         setUploading(false);
//       });
//   };

//   const props: UploadProps = {
//     onRemove: (file) => {
//       const index = fileList.indexOf(file);
//       const newFileList = fileList.slice();
//       newFileList.splice(index, 1);
//       setFileList(newFileList);
//     },
//     beforeUpload: (file) => {
//       setFileList([...fileList, file]);

//       return false;
//     },
//     fileList,
//   };

//   return (
//     <>
//       <Upload {...props}>
//         <Button icon={<UploadOutlined />}>Select File</Button>
//       </Upload>
//       <Button
//         type="primary"
//         onClick={handleUpload}
//         disabled={fileList.length === 0}
//         loading={uploading}
//         style={{ marginTop: 16 }}
//       >
//         {uploading ? 'Uploading' : 'Start Upload'}
//       </Button>
//     </>
//   );
// };

// export default UploadFeature;
import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';

const props: UploadProps = {
  name: 'file',
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default props;

