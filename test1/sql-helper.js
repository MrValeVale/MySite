// sql-helper.js
let SQL_HELPER_DB = null;
const STORAGE_KEY = "sqljs-login-db";

// Load and cache the database from localStorage
async function initHelperDB() {
  if (SQL_HELPER_DB) return SQL_HELPER_DB;
  const SQL = await initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` });
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
    SQL_HELPER_DB = new SQL.Database(bytes);
  } else {
    SQL_HELPER_DB = new SQL.Database();
  }
  return SQL_HELPER_DB;
}

// Display a table from the database into a <div> by ID
async function showTable(tableName, elementId) {
  const db = await initHelperDB();
  let html = "";

  try {
    const res = db.exec(`SELECT * FROM ${tableName}`);
    if (res.length === 0) {
      html = "<em>No data found in table.</em>";
    } else {
      const table = res[0];
      html += "<table border='1'><tr>";
      html += table.columns.map(c => `<th>${c}</th>`).join("");
      html += "</tr>";
      table.values.forEach(row => {
        html += "<tr>" + row.map(cell => `<td>${cell}</td>`).join("") + "</tr>";
      });
      html += "</table>";
    }
  } catch (e) {
    html = `<em style="color:red;">Error: ${e.message}</em>`;
  }

  document.getElementById(elementId).innerHTML = html;
}

// Optional: get number of rows in a table
async function getRowCount(tableName) {
  const db = await initHelperDB();
  try {
    const res = db.exec(`SELECT COUNT(*) as count FROM ${tableName}`);
    return res[0].values[0][0];
  } catch {
    return 0;
  }
}
