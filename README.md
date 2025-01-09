S-DES Encryption/Decryption Tool

A web-based tool that demonstrates the Simplified Data Encryption Standard (S-DES) algorithm for educational purposes. This project provides functionality to encrypt and decrypt text or files using the S-DES algorithm, making it a hands-on way to understand encryption concepts.

Features

Encrypt/Decrypt Text: Input plain text or binary data and encrypt it using a 10-bit binary key.
File Encryption: Upload files for encryption or decryption, with results available for download.
4-Round S-DES Algorithm: Implements a simplified DES algorithm with permutations, key generation, and Feistel functions.
Real-Time Processing: View encryption and decryption results immediately.
Interactive UI: A clean and modern interface built with HTML, CSS, JavaScript, and Bootstrap.
How It Works

Input Text:
Converts plain text to binary.
Encrypts the binary data using the S-DES algorithm.
Decrypts the encrypted binary back to plain text.
Key:
Uses a 10-bit binary key for key generation and encryption.
Generates four keys for the 4 encryption rounds.
File Handling:
Supports text files for encryption/decryption.
Outputs the processed files for download.
Technologies Used

Frontend:
HTML, CSS, JavaScript
Bootstrap for responsive and modern design.
Backend:
Algorithms:
Simplified DES (S-DES) with custom key generation and permutations.
How to Use

Run Locally:
Use Python to start a simple HTTP server:
python3 -m http.server 8080
Open the project in your browser at http://localhost:8080.
Input Data:
Enter plain text or binary data into the input field.
Provide a 10-bit binary key.
Click Encrypt to encrypt the data or Decrypt to reverse the process.
File Upload:
Upload a .txt file for encryption or decryption.
Download the processed file.
View Results:
Encrypted and decrypted data are displayed in the output section.
Key Components

Key Generation:
Permutations (P10, P8) and left shifts to generate four sub-keys.
Feistel Function:
Expansion permutation, XOR operation, S-box substitution, and final permutation.
Binary Conversion:
Converts text to binary and vice versa.
File Handling:
Processes .txt files and ensures compatibility.
Future Enhancements

Add support for other file types.
Integrate a backend for secure key management and larger data handling.
Extend the UI with visualization of the S-DES process.
Contributing

Contributions are welcome! If you'd like to improve the project or add new features, feel free to fork the repository and submit a pull request.

License

This project is licensed under the MIT License.
