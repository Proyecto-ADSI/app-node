var chartLlamadas = document.getElementById('Llamadas-Chart').getContext('2d');
var myChartLlamadas = new Chart(chartLlamadas, {
    type: 'bar',
    data: {
        labels: ['No efectiva','Llamar nuevamente','Efectivas'],
        datasets: [{
            label: 'Llamadas',
            data: [17, 43, 56],
            backgroundColor: [
                'rgba(240, 29, 2, 0.7)',
                'rgba(240, 230, 2, 0.7)',
                'rgba(2, 95, 168, 0.75)'
            ],
            // borderColor: [
            //     'rgb(239, 83, 80)',
            //     'rgb(255, 178, 43)',
            //     'rgb(25, 118, 210)'
            // ],
            borderWidth: 1,
            borderColor:"#777",
            hoverBorderWith:3,
            hoverBorderColor:'#777'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: false,
         },
    }

});

var chartOperadores = document.getElementById('Operadores-Chart').getContext('2d');
var myChartOperadores = new Chart(chartOperadores, {
    type: 'doughnut',
    data: {
        labels: ['Claro','Movistar','Tigo'],
        datasets: [{
            label: 'Llamadas',
            data: [37,43,64],
            backgroundColor: [
                'rgba(240, 29, 2, 0.7)',
                'rgba(3, 198, 65, 0.7)',
                'rgba(3, 112, 198, 0.7)'
            ],
            // borderColor: [
            //     'rgb(239, 83, 80)',
            //     'rgb(255, 178, 43)',
            //     'rgb(25, 118, 210)'
            // ],
            borderWidth: 1,
            borderColor:"#777",
            hoverBorderWith:3,
            hoverBorderColor:'#777'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: false,
         },
    }

});

