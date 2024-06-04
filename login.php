<?php
// Start the session
session_start();

// Database connection settings
$servername = "localhost";
$username = "root"; // replace with your database username
$password = ""; // replace with your database password
$dbname = "my_database";

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
        $pass = md5($conn->real_escape_string($pass)); // Password should be hashed in the same way as stored

        // Query to check the credentials
        $sql = "SELECT * FROM users WHERE username='$user' AND password='$pass'";
        $result = $conn->query($sql);

        if ($result->num_rows == 1) {
            // Login successful
            $_SESSION['username'] = $user;
            header("Location: welcome.php"); // Redirect to a welcome page
            exit();
        } else {
            // Login failed
            echo "Invalid username or password.";
        }
    } else {
        echo "Please enter both username and password.";
    }
}

$conn->close();
?>
