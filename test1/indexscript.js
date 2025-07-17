
    let db, SQL;
    const STORAGE_KEY = "sqljs-login-db";

    // Save the database to localStorage
    function saveDB() {
      const data = db.export();
      const b64 = btoa(String.fromCharCode(...data));
      localStorage.setItem(STORAGE_KEY, b64);
    }

    // Load the database from localStorage
    function loadDB() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
        return new SQL.Database(bytes);
      }
      return null;
    }

    // Login function: Check if username & password match a row in users table
    function login() {
      const u = document.getElementById("username").value.trim();
      const p = document.getElementById("password").value.trim();

      const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
      stmt.bind([u, p]);

      if (stmt.step()) {
        document.getElementById("current-user").innerText = u;
        document.getElementById("login-panel").style.display = "none";
        document.getElementById("user-info").style.display = "block";
        document.getElementById("status").innerText = "✅ Login successful";
      } else {
        document.getElementById("status").innerText = "❌ Login failed";
      }
      stmt.free();
    }

    // Log the user out
    function logout() {
      document.getElementById("login-panel").style.display = "block";
      document.getElementById("user-info").style.display = "none";
      document.getElementById("status").innerText = "Logged out";
    }

    // Initialise the SQLite database in the browser
    initSqlJs({ locateFile: f => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` }).then(SQLLib => {
      SQL = SQLLib;
      db = loadDB();

      // If no DB is found in localStorage, create a fresh one with a users table
      if (!db) {
        db = new SQL.Database();
        db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);
                INSERT INTO users (username, password) VALUES ('demo', '1234');`);
        saveDB();
      }

      document.getElementById("status").innerText = "✅ Database loaded.";
    });

