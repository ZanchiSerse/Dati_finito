<template>
  <div>
    <br><br>
    <center>
      <h1>PRECIPITAZIONI</h1>
    </center>
    <div class="container">
      <div class="button-container-left">
        <button class="data-button" @click="addNewYearColumn('precipitazioni')">Aggiungi nuovo dato</button>
      </div>
      <table v-if="precipitazioniData.length">
        <thead>
          <tr>
            <th v-for="(value, key) in precipitazioniData[0]" :key="key" class="centered-text">{{ key }}</th>
            <th class="centered-text">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in precipitazioniData" :key="rowIndex">
            <td v-for="(value, key) in row" :key="key" class="centered-text" @click="editCell('precipitazioni', rowIndex, key)">
              <span v-if="!isEditing('precipitazioni', rowIndex, key)">{{ value }}</span>
              <input v-else v-model="precipitazioniData[rowIndex][key]" class="editable-cell">
            </td>
            <td class="centered-text">
              <button class="save-button" @click="saveRow('precipitazioni', rowIndex)">Salva</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <br><br>
    <center>
      <h1>TEMPERATURE</h1>
    </center>
    <div class="container">
      <div class="button-container-left">
        <button class="data-button" @click="addNewYearColumn('temperature')">Aggiungi nuovo dato</button>
      </div>
      <table v-if="temperatureData.length">
        <thead>
          <tr>
            <th v-for="(value, key) in temperatureData[0]" :key="key" class="centered-text">{{ key }}</th>
            <th class="centered-text">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in temperatureData" :key="rowIndex">
            <td v-for="(value, key) in row" :key="key" class="centered-text" @click="editCell('temperature', rowIndex, key)">
              <span v-if="!isEditing('temperature', rowIndex, key)">{{ value }}</span>
              <input v-else v-model="temperatureData[rowIndex][key]" class="editable-cell">
            </td>
            <td class="centered-text">
              <button class="save-button" @click="saveRow('temperature', rowIndex)">Salva</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'HomeView',
  data() {
    return {
      precipitazioniData: [],
      temperatureData: [],
      editedCells: [],
      localStorageKeys: {
        precipitazioni: 'precipitazioni_data',
        temperature: 'temperature_data'
      }
    };
  },
  mounted() {
    this.loadLocalData('precipitazioni');
    this.loadLocalData('temperature');
    if (!this.precipitazioniData.length) {
      this.loadExcelFile('precipitazioni');
    }
    if (!this.temperatureData.length) {
      this.loadExcelFile('temperature');
    }
  },
  methods: {
    async loadExcelFile(type) {
      try {
        const response = await fetch(new URL(`@/assets/${type}.xlsx`, import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (type === 'precipitazioni') {
          this.precipitazioniData = json;
        } else {
          this.temperatureData = json;
        }
        this.saveLocalData(type);
      } catch (error) {
        console.error(`Error loading ${type} Excel file:`, error);
      }
    },
    addNewYearColumn(type) {
      let data = type === 'precipitazioni' ? this.precipitazioniData : this.temperatureData;
      data.forEach((item, index) => {
        if (index === 0) {
          item.push(item[item.length - 1] + 1);
        } else {
          item.push(0);
        }
      });
      this.saveLocalData(type);
      this.updateExcelFile(type);
    },
    isEditing(type, rowIndex, key) {
      return this.editedCells.some(cell => cell.type === type && cell.rowIndex === rowIndex && cell.key === key);
    },
    editCell(type, rowIndex, key) {
      if (!this.isEditing(type, rowIndex, key)) {
        this.editedCells.push({ type, rowIndex, key });
      }
    },
    saveRow(type, rowIndex) {
      this.editedCells = this.editedCells.filter(cell => cell.rowIndex !== rowIndex || cell.type !== type);
      this.saveLocalData(type);
      this.updateExcelFile(type);
    },
    saveLocalData(type) {
      const data = type === 'precipitazioni' ? this.precipitazioniData : this.temperatureData;
      localStorage.setItem(this.localStorageKeys[type], JSON.stringify(data));
    },
    loadLocalData(type) {
      const localData = localStorage.getItem(this.localStorageKeys[type]);
      if (localData) {
        if (type === 'precipitazioni') {
          this.precipitazioniData = JSON.parse(localData);
        } else {
          this.temperatureData = JSON.parse(localData);
        }
      }
    },
    async updateExcelFile(type) {
      try {
        const data = type === 'precipitazioni' ? this.precipitazioniData : this.temperatureData;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

        await fetch(`/api/update-${type}-excel`, {
          method: 'POST',
          body: excelData,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });
      } catch (error) {
        console.error(`Errore durante l'aggiornamento del file Excel ${type}:`, error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 5%;
}

.button-container-left {
  text-align: left;
  margin-bottom: 20px;
}

.data-button {
  background-color: #ff7f50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
}

.data-button:hover {
  background-color: #ff4500;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid;
  padding: 8px;
  text-align: center; /* Centra il testo */
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.editing {
  background-color: red;
}

.comune-name {
  color: gray;
}

.save-button {
  background-color: yellow;
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #ffea00;
}

.editable-cell {
  width: 100%;
  max-width: 100px; /* Imposta una larghezza massima */
  overflow-x: auto; /* Aggiungi una scrollbar orizzontale */
  white-space: nowrap; /* Evita che il testo vada a capo */
}

.centered-text {
  text-align: center;
}
</style>
