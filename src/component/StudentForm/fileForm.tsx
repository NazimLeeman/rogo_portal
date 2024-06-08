import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  SelectProps,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import { StudentFile, StudentInfo } from '../../interface/studentInfo.interface';
import toast from 'react-hot-toast';
import { useFile } from '../../context/FileContext';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const FileForm: React.FC = () => {
  //   const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  // const [students, setStudents] = useState<StudentInfo[] | null>([]);
  const { students, setStudents} = useFile();
  const formRef = useRef<any>(null);

  const { Option } = Select;

  const navigate = useNavigate();

  const onFinish = async (values: StudentFile) => {
    try {
        console.log('user',values)
        const { data, error } = await publicSupabase
          .from('studentFile')
          .insert({
            university_name: values.university_name,
            program: values.program,
            subject: values.subject,
            budget: values.budget,
            student_id: values.student_id
          })
          .select('id')
          .single();
        if (error) {
          toast.error("Error while creating StudentFile")
          throw error;
        } 
        const newStudentFileId = data.id;
        const { data: rpcData, error: rpcError } = await publicSupabase
      .rpc('append_student_file', {
        student_id: values.student_id,
        new_file_id: newStudentFileId
      });

    if (rpcError) {
      toast.error("Error while updating studentInfo with StudentFile ID");
      throw rpcError;
    }
      //   const { data: updateData, error: updateError } = await publicSupabase
      // .from('studentInfo')
      // .update({ student_files: newStudentFileId })
      // .eq('id', values.student_id); 
      // if(updateError) {
      //   toast.error("Error while updating studentInfo with StudentFile ID");
      // throw updateError;
      // }
        toast.success("Successfully created Student File");
        formRef.current.resetFields();
      } catch (error) {
        console.error('ERROR: ', error);
      }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="USD">$</Option>
        <Option value="BDT">৳</Option>
      </Select>
    </Form.Item>
  );

  const filterOption: SelectProps<string>['filterOption'] = (input, option) => {
    // Ensure option and option.children are defined
    return (
      (option?.children as unknown as string)
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  };

  return (
    <>
      {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}
      <Form
      ref={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        // disabled={componentDisabled}
        style={{ maxWidth: 600 }}
      >
        {/* <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
          <Checkbox>Checkbox</Checkbox>
        </Form.Item> */}
        <Form.Item
        label="Student Email"
        name="student_id"
          rules={[{ required: true, message: 'Please input student email!' }]}
        >
            {students !== null && (
        <Select
            showSearch
            style={{ width: 400 }}
            placeholder="nazim@gmail.com"
            optionFilterProp="children"
            // onChange={onChange}
            // onFocus={onFocus}
            // onBlur={onBlur}
            // onSearch={onSearch}
            filterOption={filterOption}
            >
            {students.map((student) => (
                <Option key={student.id} value={student.id}>
                {student.email}
                </Option>
            ))}
            </Select>
            )}
        </Form.Item>
        <Form.Item 
          label="University"
          name="university_name"
          rules={[{ required: true, message: 'Please input university name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
        name="program"
        label="Program"
        rules={[{ required: true, message: 'Please input program!' }]}>
          <Select>
            <Select.Option value="honors">Honors</Select.Option>
            <Select.Option value="masters">Masters</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item 
        label="Subject"
        name="subject"
          rules={[{ required: true, message: 'Please input subject!' }]}
          >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="budget"
          label="Budget"
          rules={[{ required: true, message: 'Please input budget!' }]}
        >
          <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
        </Form.Item>
        {/* <Form.Item
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item> */}
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FileForm;
