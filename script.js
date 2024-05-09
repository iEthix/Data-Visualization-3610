const predefinedColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#C9CB3D",
];

function fetchData() {
  fetch("nycpopulation.csv")
    .then((response) => response.text())
    .then((data) => {
      const parsedData = d3.csvParse(data);
      createLineChart(parsedData);
      createPieChart(parsedData);
    })
    .catch((error) => console.error("Error loading the CSV file:", error));
}

function createLineChart(data) {
  const years = Object.keys(data[0]).filter((key) => key.match(/^\d{4}$/));

  const boroughData = {};
  data.forEach((row) => {
    if (!boroughData[row.Borough]) {
      boroughData[row.Borough] = {};
      years.forEach((year) => {
        boroughData[row.Borough][year] = [];
      });
    }
    years.forEach((year) => {
      if (row[year]) {
        boroughData[row.Borough][year].push(+row[year]);
      }
    });
  });

  const datasets = Object.keys(boroughData).map((borough) => ({
    label: borough,
    data: years.map((year) => ({
      x: year,
      y:
        boroughData[borough][year].reduce((a, b) => a + b, 0) /
        boroughData[borough][year].length,
    })),
    fill: false,
    borderColor: getRandomColor(),
  }));

  const ctx = document.getElementById("line-chart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          type: "category",
          labels: years,
        },
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
    },
  });
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function createPieChart(data) {
  const boroughData = {};
  const years = Object.keys(data[0]).filter((key) => key.match(/^\d{4}$/));

  data.forEach((row) => {
    if (!boroughData[row.Borough]) {
      boroughData[row.Borough] = {};
      years.forEach((year) => {
        boroughData[row.Borough][year] = [];
      });
    }
    years.forEach((year) => {
      if (row[year]) {
        boroughData[row.Borough][year].push(+row[year]);
      } else {
        boroughData[row.Borough][year].push(0);
      }
    });
  });

  const labels = Object.keys(boroughData);
  const populations = labels.map((borough) =>
    Object.keys(boroughData[borough]).reduce(
      (total, year) =>
        total +
        boroughData[borough][year].reduce((sum, value) => sum + value, 0),
      0
    )
  );

  const ctxPie = document.getElementById("pie-chart").getContext("2d");
  const pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: populations,
          backgroundColor: predefinedColors.slice(0, labels.length),
          hoverBackgroundColor: predefinedColors.slice(0, labels.length),
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        position: "top",
      },
    },
  });
}

window.onload = fetchData;
