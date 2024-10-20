const https = require('https');
const fs    = require('fs');
const path  = require('path');

const javet_current_Version = __version;
const javet_github_headers  = { headers: { 'User-Agent': 'AroliSG' }};
const lastest               = 'https://api.github.com/repos/arolisg/vcmp-nodejs-plugin/releases/latest';


function downloadFile(url, filePath) {
    https.get(url, javet_github_headers, (response) => {
        const { statusCode, headers } = response;

        // Handle redirects (status codes 301, 302, 303, 307, 308)
        if (statusCode >= 300 && statusCode < 400 && headers.location) {
            console.log(`Redirecting to ${headers.location}`);
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

            process.stdout.write(`\rNodejs plugin is being download to the lastest version`);
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
}

((url, callback) => {
    https.get(url, javet_github_headers, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => callback(null, data));
    }).on('error', (err) => callback(err, null));
}) (lastest, (err, content) => {
    if (err) return console.error(Colors.Red +'- Failed to load the url, try later.'+ Colors.Reset, err);

    try {
        // Parse JSON content
        const releaseData   = JSON.parse(content);
        const newVersion    = releaseData.tag_name;

        // Check if there's a newer version
        if (newVersion !== javet_current_Version) {
            process.stdout.write('\x1Bc');
            console.log(`\x1b[33m WARNING: Your plugin version is outdated. Version ${newVersion} is now available. \x1b[0m`);

            const assetUrl = releaseData.assets[0]?.browser_download_url;
            if (assetUrl) {
                const filePath = path.join(__dirname, 'vcmp-nodejs-plugin.jar');
                downloadFile(assetUrl, filePath);

            } else {
                console.log('No assets available for download.');
            }
        }
    } catch (e) {
        console.error('Error parsing the GitHub response:', e);
    }
});