export const calculateStatistics = (results: any[]) => {
  let created = 0;
  let updated = 0;
  let errors = 0;

  results.forEach((result) => {
    switch (result.status) {
      case "created":
        created++;
        break;
      case "updated":
        updated++;
        break;
      case "error":
        errors++;
        break;
      default:
        break;
    }
  });

  return { created, updated, errors };
};

export const getStatusClass = (status: string) => {
  switch (status) {
    case "created":
      return "bg-green-200 text-green-800";
    case "updated":
      return "bg-blue-200 text-blue-800";
    case "error":
      return "bg-red-200 text-red-800";
    default:
      return "";
  }
};

export const calculateChunkSize = (dataLength: number) => {
  if (dataLength <= 10) return 1;
  if (dataLength <= 100) return 10;
  if (dataLength <= 1000) return 100;
  if (dataLength <= 10000) return 1000;
  return 5000;
};
