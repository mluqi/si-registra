import React from "react";

const PrintableReport = React.forwardRef(
  ({ data, columns, reportTitle, startDate, endDate, total }, ref) => {
    const numericColumnKey = columns.find((c) => c.isNumeric)?.key;
    const numericColumnIndex = numericColumnKey
      ? columns.findIndex((c) => c.key === numericColumnKey)
      : -1;

    return (
      <div ref={ref} className="printable-content">
        {/* Report Header */}
        <div className="report-header text-center mb-6">
          <h1 className="text-xl font-bold uppercase">
            LAPORAN {reportTitle.toUpperCase()}
          </h1>
          <h2 className="text-lg font-semibold">PENGADILAN NEGERI SINGARAJA</h2>
          <p className="text-sm">
            Periode: {startDate} s/d {endDate}
          </p>
        </div>

        {/* Report Table */}
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black p-1.5 text-center font-bold">
                No
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="border border-black p-1.5 text-left font-bold"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                <td className="border border-black p-1.5 text-center">
                  {index + 1}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`border border-black p-1.5 align-top ${
                      col.isNumeric ? "text-right" : "text-left"
                    }`}
                  >
                    {col.isNumeric
                      ? new Intl.NumberFormat("id-ID").format(
                          item[col.key] || 0
                        )
                      : item[col.key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total Row */}
            {total !== null && numericColumnIndex !== -1 && (
              <tr className="font-bold bg-gray-100">
                <td
                  colSpan={numericColumnIndex + 1}
                  className="border border-black p-1.5 text-right"
                >
                  TOTAL
                </td>
                <td className="border border-black p-1.5 text-right">
                  {new Intl.NumberFormat("id-ID").format(total)}
                </td>
                {/* Fill remaining cells if any */}
                {columns.length - (numericColumnIndex + 1) > 0 && (
                  <td
                    colSpan={columns.length - (numericColumnIndex + 1) - 1}
                    className="border border-black p-1.5"
                  ></td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

export default PrintableReport;
