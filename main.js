// Permutation 
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
const P8 = [6, 3, 7, 4, 8, 5, 10, 9];
const IP = [2, 6, 3, 1, 4, 8, 5, 7];
const IPI = [4, 1, 3, 5, 7, 2, 8, 6];
const P4 = [2, 4, 3, 1];
const EP = [4, 1, 2, 3, 2, 3, 4, 1];
const S0 = [[1, 0, 3, 2], [3, 2, 1, 0], [0, 2, 1, 3], [3, 1, 3, 2]];
const S1 = [[0, 1, 2, 3], [2, 0, 1, 3], [3, 0, 1, 2], [2, 1, 0, 3]];

// Helper functions
function permute(bits, matrix) {
    return matrix.map((pos) => bits[pos - 1]).join('');
}

function rotateLeft(bits, n) {
    return bits.slice(n) + bits.slice(0, n);
}

function xor(bits1, bits2) {
    return bits1.split('').map((b, i) => b ^ bits2[i]).join('');
}

function sBox(input, box) {
    const row = parseInt(input[0] + input[3], 2);
    const col = parseInt(input[1] + input[2], 2);
    return box[row][col].toString(2).padStart(2, '0');
}

// Key generation
function generateKeys(key) {
    const p10 = permute(key, P10);
    let left = p10.slice(0, 5);
    let right = p10.slice(5);

    const keys = [];
    for (let i = 1; i <= 4; i++) {
        left = rotateLeft(left, i);
        right = rotateLeft(right, i);
        keys.push(permute(left + right, P8));
    }
    return keys;
}

// Feistel function
function f(bits, key) {
    const ep = permute(bits, EP);
    const xorResult = xor(ep, key);
    const left = xorResult.slice(0, 4);
    const right = xorResult.slice(4);
    const s0 = sBox(left, S0);
    const s1 = sBox(right, S1);
    return permute(s0 + s1, P4);
}


// Binary-to-Text and Text-to-Binary Conversion
function textToBinary(text) {
    return [...text].map((char) =>
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
}
function sanitizeBinary(binary) {
    return binary
        .replace(/[^01]/g, '') // Remove non-binary characters
        .match(/.{1,8}/g) || []; // Split into valid 8-bit chunks
}

function binaryToText(binary) {
    const sanitizedChunks = sanitizeBinary(binary);
    return sanitizedChunks
        .map((byte) => {
            const charCode = parseInt(byte, 2);
            // Only allow printable ASCII characters
            if (charCode >= 32 && charCode <= 126) {
                return String.fromCharCode(charCode);
            } else {
                console.warn(`Invalid character for binary chunk: ${byte}`);
                return ''; // Ignore invalid characters
            }
        })
        .join('');
}




// Validation function
function validateInputs(input, key) {
    if (!key || key.length !== 10 || !/^[01]+$/.test(key)) {
        alert('Key must be a 10-bit binary number.');
        return false;
    }
    if (!input) {
        alert('Input cannot be empty.');
        return false;
    }
    return true;
}

function encrypt(input, key) {
    const keys = generateKeys(key);
    let bits = permute(input, IP);
    for (let i = 0; i < 4; i++) {
        const left = bits.slice(0, 4);
        const right = bits.slice(4);
        const fk = xor(left, f(right, keys[i]));
        bits = right + fk;
        if (i !== 3) bits = bits.slice(4) + bits.slice(0, 4); // Swap after each round except last
    }
    return permute(bits, IPI);
}


function decrypt(input, key) {
    const keys = generateKeys(key).reverse();
    let bits = permute(input, IP);
    for (let i = 0; i < 4; i++) {
        const left = bits.slice(0, 4);
        const right = bits.slice(4);
        const fk = xor(left, f(right, keys[i]));
        bits = right + fk;
        if (i !== 3) bits = bits.slice(4) + bits.slice(0, 4); // Swap after each round except last
    }
    return permute(bits, IPI);
}

function encryptText() {
    const input = document.getElementById('inputText').value.trim();
    const key = document.getElementById('keyInput').value.trim();
    if (!validateInputs(input, key)) return;

    const binaryInput = /^[01\s]+$/.test(input) ? input : textToBinary(input);
    console.log('Binary Input:', binaryInput);

    const encrypted = binaryInput.split(' ').map((binary) =>
        encrypt(binary, key)
    ).join(' ');
    console.log('Encrypted Output:', encrypted);

    document.getElementById('outputText').innerText = `Encrypted: ${encrypted}`;
}



function decryptText() {
    const input = document.getElementById('inputText').value.trim();
    const key = document.getElementById('keyInput').value.trim();
    if (!validateInputs(input, key)) return;

    console.log('Decrypting Input:', input);

    const decryptedBinary = input.split(' ').map((binary) => {
        console.log('Decrypting Binary:', binary);
        return decrypt(binary, key);
    }).join(' ');

    console.log('Decrypted Binary:', decryptedBinary);

    // Convert sanitized binary to text
    const output = binaryToText(decryptedBinary);
    console.log('Decrypted Output:', output);

    document.getElementById('outputText').innerText = `Decrypted: ${output}`;
}




function processFile(mode) {
    const fileInput = document.getElementById('fileInput');
    const key = document.getElementById('keyInput').value.trim();
    if (!fileInput.files.length || !validateInputs('', key)) {
        alert('Please upload a file and provide a valid 10-bit binary key.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result.trim();
        const binaryInput = /^[01\s]+$/.test(content) ? content : textToBinary(content);
        console.log('File Binary Input:', binaryInput);

        const processed = binaryInput.split(' ').map((binary) =>
            mode === 'encrypt' ? encrypt(binary, key) : decrypt(binary, key)
        ).join(' ');

        const output = mode === 'decrypt' ? binaryToText(processed) : processed;
        console.log(`${mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Output:`, output);

        downloadFile(`processed_${mode}.txt`, output);
    };
    reader.readAsText(fileInput.files[0]);
}

function downloadFile(filename, content) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: 'text/plain' });
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}
