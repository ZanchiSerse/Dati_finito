<template>
  <div> <br><br>
    <!-- Grafico a onde delle precipitazioni -->
    <div v-if="precipitazioni.length">
      <h3>Grafico a Onde delle Precipitazioni</h3>
      <apexchart type="area" :options="precipitazioniChartOptions" :series="precipitazioniChartData"></apexchart>
    </div>

    <!-- Grafico a onde della temperatura -->
    <div v-if="temperature.length">
      <h3>Grafico a Onde della Temperatura</h3>
      <apexchart type="area" :options="temperatureChartOptions" :series="temperatureChartData"></apexchart>
    </div>
  </div>
</template>


<script>
import VueApexCharts from 'vue3-apexcharts';
import * as XLSX from 'xlsx';

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
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#1E90FF'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Millimetri (mm)'
          }
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
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#FF6347'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: []
        },
        yaxis: {
          title: {
            text: 'Gradi Celsius (°C)'
          }
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
    if (!this.precipitazioni.length || !this.temperature.length) {
      this.loadExcelFiles();
    }
  },
  methods: {
    async loadExcelFiles() {
      try {
        // Carica i dati delle precipitazioni
        const precipitazioniResponse = await fetch(new URL('@/assets/precipitazioni.xlsx', import.meta.url));
        const precipitazioniArrayBuffer = await precipitazioniResponse.arrayBuffer();
        const precipitazioniData = new Uint8Array(precipitazioniArrayBuffer);
        const precipitazioniWorkbook = XLSX.read(precipitazioniData, { type: 'array' });
        const precipitazioniFirstSheetName = precipitazioniWorkbook.SheetNames[0];
        const precipitazioniWorksheet = precipitazioniWorkbook.Sheets[precipitazioniFirstSheetName];
        const precipitazioniJsonData = XLSX.utils.sheet_to_json(precipitazioniWorksheet, { header: 1 });
        this.precipitazioni = precipitazioniJsonData;
        this.updateChartData(this.precipitazioni, this.precipitazioniChartData, this.precipitazioniChartOptions);

        // Carica i dati della temperatura
        const temperatureResponse = await fetch(new URL('@/assets/temperature.xlsx', import.meta.url));
        const temperatureArrayBuffer = await temperatureResponse.arrayBuffer();
        const temperatureData = new Uint8Array(temperatureArrayBuffer);
        const temperatureWorkbook = XLSX.read(temperatureData, { type: 'array' });
        const temperatureFirstSheetName = temperatureWorkbook.SheetNames[0];
        const temperatureWorksheet = temperatureWorkbook.Sheets[temperatureFirstSheetName];
        const temperatureJsonData = XLSX.utils.sheet_to_json(temperatureWorksheet, { header: 1 });
        this.temperature = temperatureJsonData;
        this.updateChartData(this.temperature, this.temperatureChartData, this.temperatureChartOptions);

        // Salva i dati nel localStorage
        localStorage.setItem('precipitazioni_data', JSON.stringify(this.precipitazioni));
        localStorage.setItem('temperature_data', JSON.stringify(this.temperature));
      } catch (error) {
        console.error('Errore durante il caricamento dei file Excel:', error);
      }
    },
    updateChartData(data, chartDataArray, options) {
      if (Array.isArray(data) && data.length > 1) {
        options.xaxis.categories = data.slice(1).map(item => item[0]);
        chartDataArray[0].data = data.slice(1).map(item => parseFloat(item[1]));
      }
    },
    loadLocalData() {
      const localPrecipitazioniData = localStorage.getItem('precipitazioni_data');
      const localTemperatureData = localStorage.getItem('temperature_data');
      
      if (localPrecipitazioniData) {
        this.precipitazioni = JSON.parse(localPrecipitazioniData);
        this.updateChartData(this.precipitazioni, this.precipitazioniChartData, this.precipitazioniChartOptions);
      }

      if (localTemperatureData) {
        this.temperature = JSON.parse(localTemperatureData);
        this.updateChartData(this.temperature, this.temperatureChartData, this.temperatureChartOptions);
      }
    }
  }
};
</script>
