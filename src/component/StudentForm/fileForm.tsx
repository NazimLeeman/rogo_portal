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
import {
  StudentFile,
  StudentInfo,
} from '../../interface/studentInfo.interface';
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
  const { students, setStudents } = useFile();
  const formRef = useRef<any>(null);

  const { Option } = Select;

  const navigate = useNavigate();

  const onFinish = async (values: StudentFile) => {
    try {
      console.log('user', values);
      const { data, error } = await publicSupabase
        .from('studentFile')
        .insert({
          university_name: values.university_name,
          program: values.program,
          subject: values.subject,
          budget: values.budget,
          student_id: values.student_id,
          course: values.course,
        })
        .select('id')
        .single();
      if (error) {
        toast.error('Error while creating StudentFile');
        throw error;
      }
      const newStudentFileId = data.id;
      const { data: rpcData, error: rpcError } = await publicSupabase.rpc(
        'append_student_file',
        {
          student_id: values.student_id,
          new_file_id: newStudentFileId,
        },
      );

      if (rpcError) {
        toast.error('Error while updating studentInfo with StudentFile ID');
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
      toast.success('Successfully created Student File');
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
          {/* <Input /> */}
          <Select>
            <Select.Option value="Mardovia State University">
              Mardovia State University
            </Select.Option>
            <Select.Option value="Russian State University for the Humanities">
              Russian State University for the Humanities
            </Select.Option>
            <Select.Option value="Moscow Aviation Institue">
              Moscow Aviation Institue
            </Select.Option>
            <Select.Option value="Kazan State Medical Universtiy">
              Kazan State Medical Universtiy
            </Select.Option>
            <Select.Option value="Higher School of Economics">
              Higher School of Economics
            </Select.Option>
            <Select.Option value="MIREA — Russian Technological University">
              MIREA — Russian Technological University
            </Select.Option>
            <Select.Option value="RANEPA - The Presidential Academy">
              RANEPA - The Presidential Academy
            </Select.Option>
            <Select.Option value="D. Mendeleev University of Chemical Technology">
              D. Mendeleev University of Chemical Technology
            </Select.Option>
            <Select.Option value="FinU - Financial University">
              FinU - Financial University
            </Select.Option>
            <Select.Option value="MPEI - Moscow Power Engineering Institute">
              MPEI - Moscow Power Engineering Institute
            </Select.Option>
            <Select.Option value="MIET - National Research University of Electronic Technology">
              MIET - National Research University of Electronic Technology
            </Select.Option>
            <Select.Option value="St Petersburg University">
              St Petersburg University
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="course"
          label="Course"
          rules={[{ required: true, message: 'Please input course!' }]}
        >
          <Select>
            <Select.Option value="Main Course">Main Course</Select.Option>
            <Select.Option value="Preparatory Course">
              Preparatory Course
            </Select.Option>
            <Select.Option value="Language Course">
              Language Course
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="program"
          label="Program"
          rules={[{ required: true, message: 'Please input program!' }]}
        >
          <Select>
            <Select.Option value="Bachelors">Bachelors</Select.Option>
            <Select.Option value="Masters">Masters</Select.Option>
            <Select.Option value="PhD">PhD</Select.Option>
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
          label="Payment"
          rules={[{ required: true, message: 'Please input payment amount!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
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
