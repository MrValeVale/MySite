<?php
// Database connection settings
$servername = "sql.bsite.net\\MSSQL2016";
$username = "mrvalevale_"; // replace with your database username
$password = "tenletters"; // replace with your database password
$dbname = "mrvalevale_";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // Validate the inputs
    if (!empty($user) && !empty($pass)) {
        // Sanitize the inputs
        $user = $conn->real_escape_string($user);
        $pass = md5($conn->real_escape_string($pass)); // Password should be hashed

        // Query to check if the username already exists
        $sql = "SELECT * FROM users WHERE username='$user'";
        $result = $conn->query($sql);

        if ($result->num_rows == 0) {
            // Username is available, proceed to insert
            $sql = "INSERT INTO users (username, password) VALUES ('$user', '$pass')";
            if ($conn->query($sql) === TRUE) {
                echo "Registration successful. You can now <a href='index.html'>login</a>.";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        } else {
            // Username already exists
            echo "Username already taken. Please choose another username.";
        }
    } else {
        echo "Please enter both username and password.";
    }
}

$conn->close();
?>
