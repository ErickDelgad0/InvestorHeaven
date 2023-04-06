// Global Variables
let chart = null;
let stockDataAll;
let stockDataThreeMonths;
let stockDataPastWeek;


// Choose a Random Stock to Display
// Generate a random rounded number between 1 to 10;
var theRandomNumber = Math.floor(Math.random() * 7);
const rng_stocks = ['AMZN', 'GEO', 'NCLH', 'F', 'CANO', 'TSLA', 'DFFN'];

// Wait for the HTML document to load
// before running. DEFAULT SET TO AMAZON AMZN
document.addEventListener('DOMContentLoaded', () => {
    getStockData(rng_stocks[theRandomNumber]);
});


// Stock Charts
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
    
    if (chart != null){
        // destory old charts
        chart.destroy();
        chart2.destroy();
        chart3.destroy();
    }

    mybool = false;

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

// This method is how I could include news about any given stock.
function getNewsData(){
    var date = new Date();
    date.setDate(date.getDate() - 7);
    console.log(date);
    
    var url = 'https://newsapi.org/v2/everything?q=${symbol}&from=${date}&sortBy=popularity&apiKey=49d6fb02668f4e178341e719ff2920b2';
    
    var req = new Request(url);
    
    fetch(req)
    .then(function(response) {
        console.log(response.json());
    })
}