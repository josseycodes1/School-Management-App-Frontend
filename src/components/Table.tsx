import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps<T extends { id: string }> {
  columns: Column[];
  renderRow: (item: T) => ReactNode;
  data: T[];
  emptyMessage?: string;
}

const Table = <T extends { id: string }>({
  columns,
  renderRow,
  data,
  emptyMessage = 'No data available',
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            {columns.map((col) => (
              <th key={col.accessor} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                {renderRow(item)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;