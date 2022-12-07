import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import data from "./near-earth-asteroids.json";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// enable sorting on all columns by default
const defaultColDef = {
  sortable: true,
  floatingFilter: true
};

const valueGetter = (params: any) => {
  if (params.data.pha === 'Y') {
    return 'Yes';
  } else if (params.data.pha === 'N') {
    return 'No';
  } else {
    return '';
  }
}

const dateFormatter = (params: any) => {
  let currentDate = new Date(params.data.discovery_date);
  let month: number | string  = currentDate.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let dateOfMonth: number | string = currentDate.getDate();
  let year = currentDate.getFullYear();
  const formattedDate = month + "/" + dateOfMonth + "/" + year;
  return formattedDate;
};

const filterParams = {
  comparator: function (filterLocalDateAtMidnight: any, cellValue: any) {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('/');
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[0]) - 1,
      Number(dateParts[1]),
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
  suppressAndOrCondition: true,
};

const numberFilterParams =  {
  allowedCharPattern: '/^\\d+(\\.\\d+)?$/',
  numberParser: function(number: any) {
      return number  == null ? null : parseFloat(number);
  }
}

const columnDefs: ColDef[] = [
  { field: "designation", headerName: "Designation", filter: 'agTextColumnFilter' },
  { field: "discovery_date", headerName: "Discovery Date", 
    valueGetter: dateFormatter, 
    filter: 'agDateColumnFilter', 
    filterParams: filterParams, 
  },
  { field: "h_mag", headerName: "H (mag)", 
    filter: 'agNumberColumnFilter', 
    valueGetter: params => Number(params.data.h_mag),
    filterParams: numberFilterParams
  },
  { field: "moid_au", headerName: "MOID (au)",
    filter: 'agNumberColumnFilter', 
    valueGetter: params => Number(params.data.moid_au),
    filterParams: numberFilterParams
  },
  { field: "q_au_1", headerName: "q (au)",
    filter: 'agNumberColumnFilter', 
    valueGetter: params => Number(params.data.q_au_1),
    filterParams: numberFilterParams
  },
  { field: "q_au_2", headerName: "Q (au)",
    filter: 'agNumberColumnFilter', 
    valueGetter: params => Number(params.data.q_au_2),
    filterParams: numberFilterParams
  },
  { field: "period_yr", headerName: "Period (yr)",
    filter: 'agNumberColumnFilter', 
    valueGetter: params => Number(params.data.period_yr),
    filterParams: numberFilterParams
  },
  { field: "i_deg", headerName: "Inclination (deg)", 
    filter: 'agNumberColumnFilter', 
    valueGetter: params => Number(params.data.i_deg),
    filterParams: numberFilterParams
  },
  { field: "pha", headerName: "Potentially Hazardous", 
    valueGetter: valueGetter, filter: 'agTextColumnFilter' },
  { field: "orbit_class", headerName: "Orbit Class", enableRowGroup: true, filter: 'agTextColumnFilter' },
];


const NeoGrid = (): JSX.Element => {

  return (
    <div className="ag-theme-alpine" style={{ height: 900, width: 1920 }}>
      
        <h1>Near-Earth Object Overview</h1> 
      <AgGridReact
        rowData={data}
        defaultColDef={defaultColDef}
        columnDefs={columnDefs}
        rowGroupPanelShow={'always'}
      />
    </div>
  );
};

export default NeoGrid;
