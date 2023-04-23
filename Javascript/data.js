// Global Variables
let chart = null;
let stockDataAll;
let stockDataThreeMonths;
let stockDataPastWeek;

const apiKey = "8302fc6d03b2477ba2794a6944b03e01";


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
    const timeseries = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${apiKey}`;
    const company_overview = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;

    Promise.all([
        fetch(timeseries).then(response => response.json()),
        fetch(company_overview).then(response => response.json())
    ]).then(([graphData, overviewData]) => {
        const latestDate = Object.keys(graphData["Time Series (Daily)"])[0];
        const latestPrice = parseFloat(graphData["Time Series (Daily)"][latestDate]["4. close"]);

        const chartData = filterChartData(graphData["Time Series (Daily)"], symbol);
        drawChart(chartData, symbol);

        const companyName = overviewData.Name;
        const target = overviewData.AnalystTargetPrice;
        const peRatio = overviewData.PERatio === "None" ? overviewData.PEGRatio : overviewData.PERatio;
        const pbRatio = overviewData.PriceToBookRatio;
        const bookval = overviewData.BookValue;
        const EVToEBITDA = overviewData.EVToEBITDA;

        displayCompany(companyName, symbol);
        displayStockRatios(peRatio, pbRatio, EVToEBITDA, bookval, target);

        BuySell(target, latestPrice)
    }).catch(error => console.log(error));
}

function displayCompany(stockname, symbol){
    const stockName = document.getElementById("stock-name");
    const html = `
      <h2>${stockname} (${symbol})</h2>
    `;
    stockName.innerHTML = html;
}

function displayStockRatios(peRatio, pbRatio, EVToEBITDA, bookval, target) {
    const stockRatiosDiv = document.getElementById("stock-ratios");
    const html = `
      <p>P/E Ratio: ${peRatio}</p>
      <p>P/B Ratio: ${pbRatio}</p>

      <p>EV/ EBITDA: ${EVToEBITDA}</p>
      <p>Booking value: ${bookval}</p>
      <p>Analyst Target Price: ${target}</p>
    `;
    stockRatiosDiv.innerHTML = html;
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
                    display: false,
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
                    display: false,
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
                    display: false,
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

function calculatePreferredStockValue(dividendRate) {
    const dividendRateDecimal = dividendRate / 100;

    // The preffered stock value will be evaluted by an 8%
    // return on investment
    const preferredStockValue = dividendRateDecimal / 8;
    return preferredStockValue;
}

function BuySell(targetPrice, closingPrice){
    const percentageDifference = Math.abs(targetPrice - closingPrice) / closingPrice * 100;
  
    if (targetPrice > closingPrice) {
        if (percentageDifference <= 5) {
            displayImage("../img/hold.png", "hold");
        } else {
            displayImage("../img/buy.png", "buy");
        }
    } else {
        if (percentageDifference <= 5) {
            displayImage("../img/hold.png", "hold");
        } else {
            displayImage("../img/sell.png", "sell");
        }
    }
}

function displayImage(imageFileName, Other) {
    const dashboard = document.getElementById("buy-sell-hold");
    dashboard.innerHTML = `<img src="${imageFileName}" alt=${Other}>`;
    
}


// function BuySell(symbol, currentPrice, pbRatio, peRatio) {
//     const income_url = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${apiKey}`;
//     const BalanceSheet_url = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbol}&apikey=${apiKey}`;

//     Promise.all([
//         fetch(income_url).then(response => response.json()),
//         fetch(BalanceSheet_url).then(response => response.json())
//     ]).then(([income_data, balance_data]) => {
//         // Extract the relevant fields from the API response
//         const annualDividend = parseFloat(income_data.annualDividend);
//         const outstandingShares = parseFloat(income_data.outstandingShares);
  
//         // Calculate the annual dividend payment
//         const annualDividendPayment = annualDividend * outstandingShares;
//         const dividendRate = annualDividendPayment / (currentPrice * outstandingShares);


//         if (!balance_data.balancesheet) {
//             console.error(`No balance sheet data found for symbol: ${symbol}`);
//             return false;
//         }

//         const balanceSheet = balance_data.balancesheet[0];
//         const currentAssets = parseFloat(balanceSheet.currentassets);
//         const totalLiabilities = parseFloat(balanceSheet.totalliabilities);

//         const NetValue = currentAssets - totalLiabilities - calculatePreferredStockValue(dividendRate);

//         // price and earning based on ratios
//         const price = pbRatio * NetValue;
//         const earnings = NetValue / peRatio;

//         if (price < NetValue && earnings < NetValue) {
//             console.log("true");
//             return true;
//         } else {
//             console.log("false");
//             return false;
//         }

//     }).catch(error => console.log(error));
// }

  

// This method is how I could include news about any given stock.

// function getNewsData(){
//     var date = new Date();
//     date.setDate(date.getDate() - 7);
//     console.log(date);
    
//     var url = 'https://newsapi.org/v2/everything?q=${symbol}&from=${date}&sortBy=popularity&apiKey=49d6fb02668f4e178341e719ff2920b2';
    
//     var req = new Request(url);
    
//     fetch(req)
//     .then(function(response) {
//         console.log(response.json());
//     })
// } python Simplehttpserver