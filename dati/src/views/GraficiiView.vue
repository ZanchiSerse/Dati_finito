<template> <br><br>
  <div>

    <!-- Grafico a barre della temperatura -->
    <div v-if="temperature.length">
      <h3>Grafico a Barre della Temperatura</h3>
      <apexchart type="bar" :options="temperatureChartOptions" :series="temperatureChartData"></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      precipitazioni: [],
      temperature: [],
      precipitazioniChartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#1E90FF'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Millimetri (mm)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " mm";
            }
          }
        },
        title: {
          text: 'Precipitazioni annuali',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }
      },
      precipitazioniChartData: [{
        name: 'Precipitazioni',
        data: []
      }],
      temperatureChartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#FF6347'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Gradi Celsius (°C)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " °C";
            }
          }
        },
        title: {
          text: 'Temperature annuali',
          align: 'center',
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }
      },
      temperatureChartData: [{
        name: 'Temperatura',
        data: []
      }]
    };
  },
  mounted() {
    this.loadLocalData();
  },
  methods: {
    updateChartData(data, chartDataArray, options) {
      if (Array.isArray(data) && data.length > 1) {
        options.xaxis.categories = data.slice(1).map(item => item[0]);
        chartDataArray[0].data = data.slice(1).map(item => parseFloat(item[1]));
      }
    },
    loadLocalData() {
      const localTemperatureData = localStorage.getItem('dati2');
      
      if (localTemperatureData) {
        this.updateChartData(this.precipitazioni, this.precipitazioniChartData, this.precipitazioniChartOptions);
        
        this.temperature = JSON.parse(localTemperatureData);
        this.updateChartData(this.temperature, this.temperatureChartData, this.temperatureChartOptions);
      } else {
        console.error('I dati non sono presenti nel localStorage.');
      }
    }
  }
};
</script>