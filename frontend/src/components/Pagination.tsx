interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handlePageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  const maxPageButtons = 5; // Max number of page buttons to display
  const halfMaxButtons = Math.floor(maxPageButtons / 2);

  const startPage = Math.max(1, currentPage - halfMaxButtons);
  const endPage = Math.min(totalPages, currentPage + halfMaxButtons);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-end mt-4">
      <nav>
        <ul className="flex list-none">
          {currentPage > 1 && (
            <>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  First
                </button>
              </li>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Previous
                </button>
              </li>
            </>
          )}
          {pageNumbers.map((number) => (
            <li key={number} className="mx-1">
              <button
                onClick={() => handlePageChange(number)}
                className={`px-3 py-1 rounded ${
                  number === currentPage
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          {currentPage < totalPages && (
            <>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Next
                </button>
              </li>
              <li className="mx-1">
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  Last
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
