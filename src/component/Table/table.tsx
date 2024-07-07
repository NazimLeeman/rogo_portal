import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { StudentFile } from '../../interface/studentInfo.interface';
import { publicSupabase } from '../../api/SupabaseClient';
import { useFile } from '../../context/FileContext';
import { combineData } from '@/utils/helper';
import { CombinedDataSource } from '@/interface/filedetails.interface';

type DataIndex = keyof CombinedDataSource;

const SearchTable: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [fileDetails, setFileDetails] = useState<any>([])
  const { studentsFile, setStudentsFile } = useFile();
  const data: CombinedDataSource[] | null = studentsFile;

  const searchInput = useRef<InputRef>(null);

  useEffect(() => {
    getStudentFile();
    getStudentFileDetails()
  }, []);

  useEffect(() => {
    if(studentsFile && studentsFile.length > 0 && fileDetails && fileDetails.length > 0) {
      const final = combineData(studentsFile,fileDetails)
      console.log('final', final)
    }
  },[studentsFile,fileDetails])

  const getStudentFile = async () => {
    try {
      const { data: StudentInfo, error } = await publicSupabase
        .from('studentFile')
        .select(`*,studentInfo:student_id(*)`);
      setStudentsFile(StudentInfo);
      console.log('student info',StudentInfo)
      if (error) throw error;
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const getStudentFileDetails = async () => {
    try {
      // First, get all unique filedetailsids
      const { data: uniqueFileDetails, error: uniqueError } = await publicSupabase
        .from('statusSteps')
        .select('filedetailsid')
        .order('filedetailsid');
  
      if (uniqueError) throw uniqueError;
  
      // Extract unique filedetailsids
      const uniqueIds = [...new Set(uniqueFileDetails.map(item => item.filedetailsid))];
  
      // Now, get the latest status step for each unique filedetailsid
      const { data: allStatusSteps, error: statusError } = await publicSupabase
        .from('statusSteps')
        .select(`*,filedetails:filedetailsid(*)`)
        .in('filedetailsid', uniqueIds)
        .order('createdAt', { ascending: false });
  
      if (statusError) throw statusError;
  
      // Process the data to get only the latest entry for each filedetailsid
      const latestStatusSteps = uniqueIds.map(id => {
        return allStatusSteps.find(step => step.filedetailsid === id);
      }).filter(Boolean); // Remove any undefined entries
  
      console.log('Latest status steps:', latestStatusSteps);
      setFileDetails(latestStatusSteps)
      // return latestStatusSteps;
    } catch (error) {
      console.error('Error fetching latest status steps:', error);
      throw error;
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
//<T>(dataIndex: keyof T): Partial<TableColumnsType<T>[number]> 

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<CombinedDataSource> => ({
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
    onFilter: (value, record) => {
      const recordValue = record[dataIndex];
      return recordValue != null && typeof recordValue === 'string'
        ? recordValue.toLowerCase().includes((value as string).toLowerCase())
        : false;
},
      // record[dataIndex]
      //   .toString()
      //   .toLowerCase()
      //   .includes((value as string).toLowerCase()),
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

  const columns: TableColumnsType<CombinedDataSource> = [
    {
      title: 'Email',
      dataIndex: 'studentInfo',
      key: 'studentInfo.email',
      width: '30%',
      render: (studentInfo) => studentInfo?.email || 'N/A',
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
      // {
      //   title: 'Title',
      //   dataIndex: 'title',
      //   key: 'title',
      //   render: (title) => title || 'N/A',
      // },
    
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
