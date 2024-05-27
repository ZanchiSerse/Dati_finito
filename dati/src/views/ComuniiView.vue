<template> <br><br>
  <center>
    <h1>TEMPERATURE</h1>
  </center>
  <div class="container">
    <table v-if="jsonData.length">
      <thead>
        <tr>
          <th v-for="(value, key) in jsonData[0]" :key="key"
            :class="{ 'text-left': key === 'Comuni', 'text-right': key !== 'Comuni' }">{{ key }}</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in top10ComuniCaldi" :key="rowIndex">
          <td v-for="(value, key) in row" :key="key" :class="[
            { 'text-left': key === 'Comuni', 'text-right': key !== 'Comuni', 'comune-name': key === 'Comuni' },
            isEditing(rowIndex, key) ? 'editing' : ''
          ]" @click="editCell(rowIndex, key)">
            <span v-if="!isEditing(rowIndex, key)">{{ value }}</span>
            <input v-else v-model="jsonData[rowIndex][key]">
          </td>
          <td>
            <button class="save-button" @click="saveRow(rowIndex)">Salva</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'ComuneView',
  data() {
    return {
      jsonData: [],
      originalData: [],
      editedCells: [],
      localStorageKey: 'temperature_data'
    }
  },
  computed: {
    top10ComuniCaldi() {
      return this.jsonData
        .slice()
        .sort((a, b) => b.Temperature - a.Temperature)
        .slice(0, 10);
    }
  },
  mounted() {
    this.loadLocalData();
    if (!this.jsonData.length) {
      this.loadExcelFile();
    }
    this.saveLocalData(); // Aggiunta la chiamata per salvare i dati appena la pagina si apre
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch(new URL('@/assets/temperature.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet);

        // Rimuove intestazioni vuote
        json = json.filter(row => Object.values(row).some(cell => cell !== ''));

        this.jsonData = json;
        this.originalData = JSON.parse(JSON.stringify(json));
        this.saveLocalData();

        console.log('Array di elementi:', this.jsonData);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    },
    isEditing(rowIndex, key) {
      return this.editedCells.some(cell => cell.rowIndex === rowIndex && cell.key === key);
    },
    editCell(rowIndex, key) {
      if (!this.isEditing(rowIndex, key)) {
        this.editedCells.push({ rowIndex, key });
      }
    },
    saveRow(rowIndex) {
      console.log('Salva riga:', this.jsonData[rowIndex]);
      this.editedCells = this.editedCells.filter(cell => cell.rowIndex !== rowIndex);
      this.updateExcelFile();
      this.saveLocalData(); // Aggiunta la chiamata per salvare i dati dopo aver salvato le modifiche
    },
    saveLocalData() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.jsonData));
      localStorage.setItem('dati2', JSON.stringify(this.top10ComuniCaldi));
      console.log('Dati salvati:', JSON.parse(localStorage.getItem('dati2')));
    },
    loadLocalData() {
      const localData = localStorage.getItem(this.localStorageKey);
      if (localData) {
        this.jsonData = JSON.parse(localData);
      }
    },
    async updateExcelFile() {
      try {
        const worksheet = XLSX.utils.json_to_sheet(this.jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelData = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

        // Invio dati al server per sovrascrivere il file Excel
        await fetch('/api/update-excel', {
          method: 'POST',
          body: excelData,
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        });

        console.log('File Excel aggiornato con successo');
      } catch (error) {
        console.error('Errore durante l\'aggiornamento del file Excel:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  margin: 0 5%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
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
</style>
