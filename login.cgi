#!/usr/bin/env python3

import cgi
import pymssql
import os

print("Content-Type: text/html")
print()

form = cgi.FieldStorage()

username = form.getvalue("username")
password = form.getvalue("password")

if username is None or password is None:
    print("Please enter both username and password.")
    exit()

# Database connection settings
server = "sql.bsite.net\\MSSQL2016"
user = "mrvalevale_"
password_db = "tenletters"
database = "mrvalevale_"

try:
    conn = pymssql.connect(server, user, password_db, database)
    cursor = conn.cursor()
    
    # Check if the username already exists
    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    row = cursor.fetchone()
    if row:
        print("Username already taken.")
    else:
        # Insert the new user into the database
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        conn.commit()
        print("Registration successful. You can now login.")
except pymssql.Error as e:
    print(f"Database error: {e}")
finally:
    if conn:
        conn.close()
