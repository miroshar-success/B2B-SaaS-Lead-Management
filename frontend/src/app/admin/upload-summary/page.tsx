// pages/admin/upload-summary.tsx
import { useRouter } from 'next/router';

const UploadSummary = () => {
  const router = useRouter();
  const { recordsCreated, recordsUpdated, errors } = router.query;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Summary</h1>
      <div className="bg-white shadow-md rounded p-4">
        <p className="mb-2"><strong>Records Created:</strong> {recordsCreated}</p>
        <p className="mb-2"><strong>Records Updated:</strong> {recordsUpdated}</p>
        <p className="mb-2"><strong>Errors:</strong> {errors}</p>
      </div>
      <button
        onClick={() => router.push('/admin')}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700"
      >
        Back to Upload
      </button>
    </div>
  );
};

export default UploadSummary;
