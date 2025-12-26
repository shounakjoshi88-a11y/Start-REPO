const jsonInput = document.getElementById('jsonInput');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const csvOutput = document.getElementById('csvOutput');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const outputSection = document.getElementById('outputSection');
const statusMessage = document.getElementById('statusMessage');

convertBtn.addEventListener('click', convertJSON);
clearBtn.addEventListener('click', clearAll);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadCSV);

function convertJSON() {
    const jsonText = jsonInput.value.trim();
    
    if (!jsonText) {
        showStatus('Please enter JSON data', 'error');
        return;
    }
    
    try {
        const data = JSON.parse(jsonText);
        
        if (!Array.isArray(data) || data.length === 0) {
            showStatus('JSON must be a non-empty array', 'error');
            return;
        }
        
        const csv = generateCSV(data);
        csvOutput.value = csv;
        outputSection.style.display = 'block';
        showStatus('✓ Successfully converted to CSV!', 'success');
    } catch (error) {
        showStatus('Invalid JSON: ' + error.message, 'error');
    }
}

function generateCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const headerRow = headers.map(h => `"${h}"`).join(',');
    
    const rows = data.map(obj => {
        return headers.map(header => {
            let value = obj[header] ?? '';
            if (typeof value === 'string') {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',');
    });
    
    return [headerRow, ...rows].join('\n');
}

function clearAll() {
    jsonInput.value = '';
    csvOutput.value = '';
    outputSection.style.display = 'none';
    statusMessage.style.display = 'none';
    jsonInput.focus();
}

function copyToClipboard() {
    csvOutput.select();
    document.execCommand('copy');
    showStatus('✓ Copied to clipboard!', 'success');
}

function downloadCSV() {
    const csv = csvOutput.value;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showStatus('✓ CSV file downloaded!', 'success');
}

function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message ' + type;
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

jsonInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        convertJSON();
    }
});
