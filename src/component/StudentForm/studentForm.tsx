import React, { useState } from 'react';
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
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const StudentForm: React.FC = () => {
  //   const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

  const { Option } = Select;

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
        <Option value="BDT">¥</Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        // disabled={componentDisabled}
        style={{ maxWidth: 600 }}
      >
        {/* <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
          <Checkbox>Checkbox</Checkbox>
        </Form.Item> */}
        <Form.Item label="First Name">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name">
          <Input />
        </Form.Item>
        <Form.Item label="Email">
          <Input />
        </Form.Item>
        <Form.Item label="Program">
          <Select>
            <Select.Option value="honors">Honors</Select.Option>
            <Select.Option value="masters">Masters</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          // rules={[{ required: true, message: 'Please input phone number!' }]}
        >
          <Input addonBefore={prefixSelector} />
        </Form.Item>
        <Form.Item
          name="budget"
          label="Budget"
          // rules={[{ required: true, message: 'Please input amount!' }]}
        >
          <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
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
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default StudentForm;
