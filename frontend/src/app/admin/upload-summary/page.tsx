// pages/upload-summary.tsx
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const UploadSummary = () => {
  const searchParams = useSearchParams();
  const recordsCreated = searchParams.get('recordsCreated');
  const recordsUpdated = searchParams.get('recordsUpdated');
  const errors = searchParams.get('errors');
  const [summary, setSummary] = useState({
    recordsCreated: 0,
    recordsUpdated: 0,
    errors: 0,
  });

  useEffect(() => {
    if (recordsCreated && recordsUpdated && errors) {
      setSummary({
        recordsCreated: parseInt(recordsCreated as string, 10),
        recordsUpdated: parseInt(recordsUpdated as string, 10),
        errors: parseInt(errors as string, 10),
      });
    }
  }, [recordsCreated, recordsUpdated, errors]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Summary</h1>
      <p>Records Created: {summary.recordsCreated}</p>
      <p>Records Updated: {summary.recordsUpdated}</p>
      <p>Errors: {summary.errors}</p>
    </div>
  );
};

export default UploadSummary;
