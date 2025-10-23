import React from "react";

const DataTable = ({ data, columns, isLoading, title }) => {
  if (isLoading) {
    return <div className="text-center py-4">Memuat data...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4">Tidak ada data untuk ditampilkan.</div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      {title && <h3 className="text-xl font-semibold p-4 border-b">{title}</h3>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td
                  key={col.key || colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {/* Ini adalah bagian krusial: memeriksa apakah ada fungsi render */}
                  {col.render ? col.render(row) : row[col.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
