// 8302fc6d03b2477ba2794a6944b03e01

// Global Variables
let chart;
let stockDataAll;
let stockDataThreeMonths;
let stockDataPastWeek;

const TIMEFRAME_MAX = 'max';
const TIMEFRAME_THREE_MONTHS = 'three-months';
const TIMEFRAME_ONE_WEEK = 'one-week';

// Wait for the HTML document to load
// before running. DEFAULT SET TO AMAZON AMZN
document.addEventListener('DOMContentLoaded', () => {
    getStockData('AMZN');
});

function getStockData(symbol) {
    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=8302fc6d03b2477ba2794a6944b03e01`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            stockDataAll = data["Time Series (Daily)"];
            stockDataThreeMonths = filterStockDataByDate(stockDataAll, TIMEFRAME_THREE_MONTHS);
            stockDataPastWeek = filterStockDataByDate(stockDataAll, TIMEFRAME_ONE_WEEK);
            const chartData = filterChartData(stockDataAll);
            console.log(chartData);
            updateChart(chartData);
        })
        .catch(error => console.log(error));
}

function filterStockDataByDate(data, timeframe) {
    let stockData = {};
    const now = new Date();
    switch (timeframe) {
        case TIMEFRAME_THREE_MONTHS:
            now.setMonth(now.getMonth() - 3);
            break;
        case TIMEFRAME_ONE_WEEK:
            now.setDate(now.getDate() - 7);
            break;
    }
    const oldestDate = now.toISOString().slice(0, 10);
    for (const date in data) {
        if (date >= oldestDate) {
            stockData[date] = data[date];
        }
    }
    return stockData;
}

function filterChartData(data, symbol) {
    // Extract the data points from the data object and convert them to arrays
    let dates = Object.keys(data).reverse();
    let prices = dates.map(date => parseFloat(data[date]["4. close"]));

    // Create the chart data object
    return {
        labels: dates,
        prices: prices,
        symbol: symbol
    };
}

function drawChart(chartData, symbol) {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Closing Price',
                data: chartData.prices,
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: `${symbol} Stock Price`
            },
            legend: {
                position: 'bottom'
            },
            scales: {
                y: {
                    ticks: {
                        beginAtZero: false,
                        color: "black"
                    }
                },
                x: {
                    ticks: {
                        beginAtZero: false,
                        color: "black"
                    }
                }
            }
        }
    });
}


function updateChart(chartData) {
    const timeframe = document.querySelector('input[name="timeframe"]:checked').value;
    let filteredData = {};
    switch (timeframe) {
      case TIMEFRAME_MAX:
        filteredData = stockDataAll;
        break;
      case TIMEFRAME_THREE_MONTHS:
        filteredData = stockDataThreeMonths;
        break;
      case TIMEFRAME_ONE_WEEK:
        filteredData = stockDataPastWeek;
        break;
    }
    const newChartData = filterChartData(filteredData);
    if (chart) {
      chart.destroy();
    }
    drawChart(newChartData);
  }

const form = document.getElementById("stock-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  getStockData();
});