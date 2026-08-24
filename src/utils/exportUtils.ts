/**
 * Utility functions for exporting data to CSV and downloading templates
 */

export const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || rows.length === 0) {
    alert("No data available to export.");
    return;
  }

  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            if (typeof cell === 'object') {
              cell = JSON.stringify(cell).replace(/"/g, '""');
            } else {
              cell = cell.toString().replace(/"/g, '""');
            }
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadTenantCSVTemplate = () => {
  const sampleData = [
    {
      "FullName": "Jane Wanjiku",
      "Email": "jane.wanjiku@example.com",
      "Phone": "+254712345678",
      "PropertyName": "Emerald Heights Luxury Residences",
      "UnitNumber": "Unit 3A",
      "MonthlyRent": 48000,
      "SecurityDeposit": 48000,
      "LeaseStart": "2026-09-01",
      "LeaseEnd": "2027-08-31",
      "VehiclePlate": "KDF 889Q"
    },
    {
      "FullName": "Robert Kiprop",
      "Email": "robert.k@example.com",
      "Phone": "+254722998877",
      "PropertyName": "Sapphire Palms Executive Suites",
      "UnitNumber": "Suite 101",
      "MonthlyRent": 55000,
      "SecurityDeposit": 55000,
      "LeaseStart": "2026-09-01",
      "LeaseEnd": "2027-08-31",
      "VehiclePlate": "KDG 123M"
    }
  ];

  exportToCSV("tenants_bulk_import_template.csv", sampleData);
};
