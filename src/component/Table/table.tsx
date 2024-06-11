import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { StudentFile } from '../../interface/studentInfo.interface';
import { publicSupabase } from '../../api/SupabaseClient';
import { useFile } from '../../context/FileContext';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

type DataIndex = keyof StudentFile;

const SearchTable: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const { studentsFile, setStudentsFile } = useFile();
  const data: StudentFile[] | null = studentsFile;

  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    getStudentFile();
  }, []);

  const getStudentFile = async () => {
    try {
      const { data: StudentInfo, error } = await publicSupabase
        .from('studentFile')
        .select('*');
      setStudentsFile(StudentInfo);
      if (error) throw error;
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<StudentFile> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<StudentFile> = [
    {
      title: 'Student Id',
      dataIndex: 'student_id',
      key: 'student_id',
      width: '30%',
      //   ...getColumnSearchProps('name'),
    },
    {
      title: 'University',
      dataIndex: 'university_name',
      key: 'university_name',
      width: '20%',
      ...getColumnSearchProps('university_name'),
    },
    {
      title: 'Program',
      dataIndex: 'program',
      key: 'program',
      width: '20%',
      ...getColumnSearchProps('program'),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      width: '20%',
      ...getColumnSearchProps('subject'),
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      //   ...getColumnSearchProps('address'),
      //   sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  return (
    <>
      {data && data.length > 0 ? (
        <Table columns={columns} dataSource={data} />
      ) : (
        <div>Please Wait</div>
      )}
    </>
  );
};

export default SearchTable;
