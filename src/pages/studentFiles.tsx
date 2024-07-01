import FileForm from '@/component/StudentForm/fileForm';
import SearchTable from '@/component/Table/table';

export default function StudentFiles() {
  return (
    <div>
      <div>
        <div>
          <p className="text-xl">Search Student File</p>
        </div>
        <SearchTable />
      </div>
      <div className="p-5">
        <p className="text-xl">Create a New Student File</p>
        <span>
          You need to create a student account before creating a file.
        </span>
      </div>
      <FileForm />
    </div>
  );
}
