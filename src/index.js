import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Theme

// Custom Cell Renderer (Display logos based on cell value)
const CompanyLogoRenderer = ({ value }) => (
  <span
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
    }}
  >
    {value && (
      <img
        alt={`${value} Flag`}
        src={`https://www.ag-grid.com/example-assets/space-company-logos/${value.toLowerCase()}.png`}
        style={{
          display: 'block',
          width: '25px',
          height: 'auto',
          maxHeight: '50%',
          marginRight: '12px',
          filter: 'brightness(1.1)',
        }}
      />
    )}
    <p
      style={{
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </p>
  </span>
);

/* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
const MissionResultRenderer = ({ value }) => (
  <span
    style={{
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      alignItems: 'center',
    }}
  >
    {
      <img
        alt={`${value}`}
        src={`https://www.ag-grid.com/example-assets/icons/${
          value ? 'tick-in-circle' : 'cross-in-circle'
        }.png`}
        style={{ width: 'auto', height: 'auto' }}
      />
    }
  </span>
);

/* Format Date Cells */
const dateFormatter = (params) => {
  return new Date(params.value).toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Create new GridExample component
const GridExample = () => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState([]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState([
    {
      field: 'mission',
      width: 150,
      checkboxSelection: true,
    },
    {
      field: 'company',
      width: 130,
      cellRenderer: CompanyLogoRenderer,
    },
    {
      field: 'location',
      width: 225,
    },
    {
      field: 'date',
      valueFormatter: dateFormatter,
    },
    {
      field: 'price',
      width: 130,
      valueFormatter: (params) => {
        return '₹' + params.value.toLocaleString();
      },
    },
    {
      field: 'successful',
      width: 120,
      cellRenderer: MissionResultRenderer,
    },
    { field: 'rocket' },
  ]);

  const [chartOptions, setChartOptions] = useState({
    // Data: Data to be displayed in the chart
    data: [
      { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
      { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
      { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
      { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
      { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
      { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    // Series: Defines which chart type and data to use
    series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }],
  });

  // Fetch data & update rowData state
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/space-mission-data.json')
      .then((result) => result.json())
      .then((rowData) => {
        console.log(rowData);
        setRowData(rowData);
        setChartOptions({ data: rowData });
      });
  }, []);

  // Apply settings across all columns
  const defaultColDef = useMemo(() => ({
    filter: true,
    editable: true,
  }));

  // Container: Defines the grid's theme & dimensions.
  return (
    <div
      className={'ag-theme-quartz-dark'}
      style={{ width: '100%', height: '100%' }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        rowSelection="multiple"
        onSelectionChanged={(event) => console.log('Row Selected!')}
        onCellValueChanged={(event) =>
          console.log(`New Cell Value: ${event.value}`)
        }
      />
    </div>
  );
};

// Render GridExample
const root = createRoot(document.getElementById('root'));
root.render(<GridExample />);
