// Global Variables
let chart;
let stockDataAll;
let stockDataThreeMonths;
let stockDataPastWeek;

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
            const chartData = filterChartData(stockDataAll, symbol);
            console.log(chartData);
            drawChart(chartData, symbol);
        })
        .catch(error => console.log(error));
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
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: symbol,
                    color: 'black'
                }
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
                    },
                    title: {
                        display: true,
                        color: "black"
                    }
                }
            }
        }
    });

    const ctx3 = document.getElementById('chartPast3').getContext('2d');
    
    let newChartData3 = chartData
    
    newChartData3.labels = newChartData3.labels.slice(newChartData3.labels.length - 60)
    
    newChartData3.prices = newChartData3.prices.slice(newChartData3.prices.length - 60)
    chart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: newChartData3.labels,
            datasets: [{
                label: 'Closing Price',
                data: newChartData3.prices,
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: symbol,
                    color: 'black'
                }
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
                    },
                    title: {
                        display: true,
                        color: "black"
                    }
                }
            }
        }
    });

    const ctx2 = document.getElementById('chartPastWeek').getContext('2d');
    
    let newChartData = chartData

    newChartData.labels = newChartData.labels.slice(newChartData.labels.length - 7)
    newChartData.prices = newChartData.prices.slice(newChartData.prices.length - 7)
    chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: newChartData.labels,
            datasets: [{
                label: 'Closing Price',
                data: newChartData.prices,
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: symbol,
                    color: 'black'
                }
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
                    },
                    title: {
                        display: true,
                        color: "black"
                    }
                }
            }
        }
    });
}