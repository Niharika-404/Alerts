// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Papa from 'papaparse';
// import Chart from 'react-apexcharts';

// const Dashboard = () => {
//   const [data, setData] = useState([]);
//   const [zoneOptions, setZoneOptions] = useState([]);
//   const [uniqueAlerts, setUniqueAlerts] = useState([]);
//   const [priorityCounts, setPriorityCounts] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('https://docs.google.com/spreadsheets/d/17e_YlTfAXZ44mU_6GB3bwAWTPsRNYnHWAONPMh1NNhU/export?format=csv&id=17e_YlTfAXZ44mU_6GB3bwAWTPsRNYnHWAONPMh1NNhU&gid=1316218754');
//         const parsedData = Papa.parse(response.data, { header: true });
//         const tableData = parsedData.data;
//         setData(tableData);

//         // Extract unique zones
//         const uniqueZones = Array.from(new Set(tableData.map(row => row.Zone)));
//         setZoneOptions(uniqueZones);

//         // Extract unique alerts
//         const uniqueAlertNames = Array.from(new Set(tableData.map(row => row['Alert Name'])));
//         setUniqueAlerts(uniqueAlertNames);

//         // Extract priority-wise counts for open alerts
//         const priorities = ['P1', 'P2', 'P3', 'P4', 'P5'];
//         const priorityCounts = priorities.map(priority => ({
//           priority,
//           count: tableData.filter(row => row.Priority === priority && row.Status === 'open').length,
//         }));
//         setPriorityCounts(priorityCounts);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Chart configuration
//   const chartOptions = {
//     labels: priorityCounts.map(item => item.priority),
//   };

//   const chartSeries = priorityCounts.map(item => item.count);

//   return (
//     <div>
//       <div id='zone-dropdown'>
//         {/* Filter Dropdown for Zones */}
//         <select>
//           {zoneOptions.map((zone, index) => (
//             <option key={index}>{zone}</option>
//           ))}
//         </select>
//       </div>
//       <div id='alerts-container'>
//         <div id='unique-alerts'>
//           {/* List of All Unique Alerts */}
//           <h3>Unique Alerts</h3>
//           <ul>
//             {uniqueAlerts.map((alert, index) => (
//               <li key={index}>{alert}</li>
//             ))}
//           </ul>
//         </div>
//         <div id='priority-alerts'>
//           {/* Donut Chart for Open Alerts in Each Priority */}
//           <h3>Opened Priority Alerts</h3>
//           <Chart options={chartOptions} series={chartSeries} type="donut" width="400" />
//         </div>
//       </div>
//       {/* Additional content can be added here */}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import Chart from 'react-apexcharts';
import TreemapChart from './TreemapChart.jsx';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [uniqueAlerts, setUniqueAlerts] = useState([]);
  const [priorityCounts, setPriorityCounts] = useState([]);
  const [selectedZone, setSelectedZone] = useState(''); // Set a default selected zone here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://docs.google.com/spreadsheets/d/17e_YlTfAXZ44mU_6GB3bwAWTPsRNYnHWAONPMh1NNhU/export?format=csv&id=17e_YlTfAXZ44mU_6GB3bwAWTPsRNYnHWAONPMh1NNhU&gid=1316218754');
        const parsedData = Papa.parse(response.data, { header: true });
        const tableData = parsedData.data;
        setData(tableData);

        // Extract unique zones
        const uniqueZones = Array.from(new Set(tableData.map(row => row.Zone)));
        setZoneOptions(uniqueZones);

        // Extract unique alerts
        const uniqueAlertNames = Array.from(new Set(tableData.map(row => row['Alert Name'])));
        setUniqueAlerts(uniqueAlertNames);

        // Extract priority-wise counts for open alerts
        const priorities = ['P1', 'P2', 'P3', 'P4', 'P5'];
        const priorityCounts = priorities.map(priority => ({
          priority,
          count: tableData.filter(row => row.Priority === priority && row.Status === 'open').length,
        }));
        setPriorityCounts(priorityCounts);

        // Set a default selected zone
        if (uniqueZones.length > 0) {
          setSelectedZone(uniqueZones[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter unique alerts based on the selected zone
  const filteredAlerts = uniqueAlerts.filter(alert =>
    selectedZone ? data.some(row => row.Zone === selectedZone && row['Alert Name'] === alert) : true
  );

  // Filter priority counts based on the selected zone
  const filteredPriorityCounts = priorityCounts.filter(priorityCount =>
    selectedZone
      ? data.some(row => row.Zone === selectedZone && row.Priority === priorityCount.priority && row.Status === 'open')
      : true
  );

  // Chart configuration
  const chartOptions = {
    labels: filteredPriorityCounts.map(item => item.priority),
  };

  const chartSeries = filteredPriorityCounts.map(item => item.count);

//   const treemapChartOptions = {
//     series: [{
//         name: data.find(row => row.Zone === selectedZone)?.Namespace || '',
//         data: filteredAlerts.map(alert => ({
//         x: alert,
//         y: data.find(row => row.Zone === selectedZone && row['Alert Name'] === alert )?.Count || 0,
//     })),
//     }],
//     legend: {
//       show: false,
//     },
//     chart: {
//       height: 350,
//       type: 'treemap',
//     },
//     title: {
//       text: `Treemap Chart - ${selectedZone}`, // Use the selected zone as the title
//       align: 'center',
//     },
//   };

  

  return (
    <div>
      <div id='zone-dropdown'>
        {/* Filter Dropdown for Zones */}
        <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
          {zoneOptions.map((zone, index) => (
            <option key={index} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>
      <div id='alerts-container'>
        <div id='unique-alerts'>
          {/* List of Unique Alerts for the Selected Zone */}
          <h3>Unique Alerts</h3>
          <ul>
            {filteredAlerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </div>
        <div id='priority-alerts'>
          {/* Donut Chart for Open Alerts in Each Priority for the Selected Zone */}
          <h3>Opened Priority Alerts</h3>
          <Chart options={chartOptions} series={chartSeries} type="donut" width="400" />
        </div>
      </div>
      {/* Additional content can be added here */}
      <div id='treemap-chart'>
          {/* Treemap Chart for Unique Alerts in the Selected Zone */}
          {/* <Chart options={treemapChartOptions} series={treemapChartOptions.series} type="treemap" height={600} /> */}

          <TreemapChart data={data} selectedZone={selectedZone} filteredAlerts={filteredAlerts} />
        </div>    
        </div>
  );
};

export default Dashboard;





