const https = require('https');
const fs    = require('fs');
const path  = require('path');

const javet_github_headers  = { headers: { 'User-Agent': 'AroliSG' }};


function downloadFile(url, filePath) {
    https.get(url, javet_github_headers, (response) => {
        const { statusCode, headers } = response;

        // Handle redirects (status codes 301, 302, 303, 307, 308)
        if (statusCode >= 300 && statusCode < 400 && headers.location) {
            downloadFile(headers.location, filePath); // Follow the redirect
            return;
        }

        if (statusCode !== 200) {
            console.error(`Failed to download file. Status Code: ${statusCode}`);
            return;
        }

        const file = fs.createWriteStream(filePath);
        const totalSize = parseInt(headers['content-length'], 10);
        let downloadedSize = 0;

        response.on('data', (chunk) => {
            downloadedSize += chunk.length;
            const percentage = ((downloadedSize / totalSize) * 100).toFixed(2);

            process.stdout.write(`\rNodejs plugin is being download to the lastest version\n`);
            process.stdout.write(`\rDownloading: ${percentage}%`);
        });

        response.pipe(file);

        file.on('finish', () => {
            file.close();
            console.log(`\nDownloaded latest release to ${filePath}`);
        });

    }).on('error', (err) => {
        console.error('Error downloading the file:', err);
    });
};