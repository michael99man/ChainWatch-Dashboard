// Trend Chart Options
var trendsOptions = {
  maintainAspectRatio:false,
  responsive: true,
  legend: {
    position: 'top'
  },
  elements: {
    line: {
        // A higher value makes the line look skewed at this ratio.
        tension: 0.3
      },
      point: {
        radius: 0
      }
    },
    scales: {
      xAxes: [{
        gridLines: false,
        type: "time",
        ticks:{ 
          autoSkip: true,
          padding: 10
        },
        time: {
          unit: "day",
          unitStepSize: 1,
          displayFormats: {
            'millisecond': 'h:mm a',
            'second': 'h:mm a',
            'minute': 'h:mm a',
            'hour': 'h:mm a',
            'day': 'MMM DD',
            'week': 'MMM DD',
            'month': 'MMM DD',
            'quarter': 'MMM DD',
            'year': 'MMM DD',
          }
        }
      }],
      yAxes: "NOT-SET",
    },
    animation: {
      duration: 500
    },
    hover: {
      mode: 'nearest',
      intersect: false
    },
    tooltips: {
      custom: false,
      mode: 'nearest',
      intersect: false,
      callbacks: {
        title: function(tooltipItem, data) {
            // process dates
            var datestring = data.labels[tooltipItem[0].index];
            return moment(datestring).format('MMM D, hh:mm A');
          },
          label: function(tooltipItem, data) {
            return "NOT-SET";
          },
          labelColor: function(tooltipItem, chart) {
            var index = tooltipItem.datasetIndex;
            return {
              borderColor: chart.data.datasets[index].borderColor,
              backgroundColor: chart.data.datasets[index].backgroundColor
            };
          }
        }
      }
    };

  // Options
  function boSmallStatsOptions(max) {
    return {
      maintainAspectRatio: true,
      responsive: true,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
        custom: false
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          tension: .4
        }
      },
      scales: {
        xAxes: [{
          gridLines: false,
          scaleLabel: false,
          ticks: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: false,
          scaleLabel: false,
          ticks: {
            display: false,
              // Avoid getting the graph line cut of at the top of the canvas.
              // Chart.js bug link: https://github.com/chartjs/Chart.js/issues/4790
              suggestedMax: max
            }
          }],
        },
      };
    }

    function generateOptions(dataType, labels, dataset, max){
  // Dataset options
  var trendsData = {
    // Generate the labels on the X axis.
    labels: labels,
    datasets: "NOT-SET"
  };

  if(!fullRange){
    // general scale labeling
    var duration = moment.duration(datetimeEnd.diff(datetimeStart));
    if(duration.asDays() >= 4){
      trendsOptions.scales.xAxes[0].time.unit="day";
      trendsOptions.scales.xAxes[0].time.unitStepSize = 1;
      // use full days ticks (default)
    } else if(duration.asDays() >= 2){
      // use hour but smaller ticks
      trendsOptions.scales.xAxes[0].time.unit="hour";
      trendsOptions.scales.xAxes[0].time.unitStepSize = 4;
    } else {
      trendsOptions.scales.xAxes[0].time.unit="hour";
      trendsOptions.scales.xAxes[0].time.unitStepSize = 1;
    } 
  }

  if(dataType == 1){
    trendsData.datasets = [{
      label: 'Network Hashrate',
      fill: 'start',
      responsive:true,
      data: dataset,
      backgroundColor: 'rgba(0,123,255,0.1)', // change for other options
      borderColor: 'rgba(0,123,255,1)',
      pointBackgroundColor: '#ffffff',
      pointHoverBackgroundColor: 'rgb(0,123,255)',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 3
    }];

    trendsOptions.scales.yAxes = [{
      ticks: {
        min: 0,
        max: max,
        callback: function (tick, index, ticks) {
          if (tick === 0) {
            return tick;
          }
            // Format the amounts using units/s
            return tick >= exponents[sessionStorage.network] ? Math.round(tick/exponents[sessionStorage.network]) + ' ' + unit() + '/s' : '';
          }
        }
      }];

      trendsOptions.tooltips.callbacks.label = function(tooltipItem, data) {
        var d = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        return (d/exponents[sessionStorage.network]).toFixed(2) +  ' ' + unit() +'/s';
      }

    } else if (dataType == 2){
    // block time graph
    trendsData.datasets = [{
      label: 'Average Time Per Block',
      fill: 'start',
      responsive:true,
      data: dataset,
      backgroundColor: 'rgba(255,180,0,0.1)', // change for other options
      borderColor: 'rgb(255,180,0)',
      pointBackgroundColor: '#ffffff',
      pointHoverBackgroundColor: 'rgb(255,180,0)',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 3
    }];

    // scale y axis
    trendsOptions.scales.yAxes = [{
      ticks: {
        min: 0,
        max: max,
        callback: function (tick, index, ticks) {
          if (tick === 0) {
            return tick;
          }
            // Format the amounts using TH/s
            return tick + ' s';
          }
        }
      }];

      trendsOptions.tooltips.callbacks.label = function(tooltipItem, data) {
        var d = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        return (d).toFixed(2) +  ' seconds';
      }
    } else if (dataType == 3){
    // difficulty graph

    trendsData.datasets = [{
      label: 'Network Difficulty',
      fill: 'start',
      data: dataset,
      responsive:true,
      backgroundColor: 'rgba(255,65,105,0.1)',
      borderColor: 'rgb(255,65,105)',
      pointBackgroundColor: '#ffffff',
      pointHoverBackgroundColor: 'rgb(255,65,105)',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 3
    }];

    // scale y axis
    trendsOptions.scales.yAxes = [{
      ticks: {
        min: 0,
        max: max,
        callback: function (tick, index, ticks) {
          if (tick === 0) {
            return 0;
          }
            // Format the amounts using TH/s
            return tick >= exponents[sessionStorage.network] ? Math.round(tick/exponents[sessionStorage.network]) + ' ' +  unit() : '';
          }
        }
      }];

      trendsOptions.tooltips.callbacks.label = function(tooltipItem, data) {
        var d = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        return (d/exponents[sessionStorage.network]).toFixed(2) +  ' ' + unit();
      }
    }

    return [trendsData, trendsOptions]; 
  }