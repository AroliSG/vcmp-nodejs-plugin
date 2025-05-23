const lastest               = 'https://api.github.com/repos/arolisg/vcmp-nodejs-plugin/releases/latest';
const javet_current_Version = __version;

function compareVersions(v1, v2) {
    // Remove the 'v' prefix if it exists
    v1 = v1.replace(/^v/, '');
    v2 = v2.replace(/^v/, '');

    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;

        if (v1Part > v2Part) {
            return true; // v1 is greater than v2
        } else if (v1Part < v2Part) {
            return false; // v1 is less than v2
        }
    }

    return false; // v1 is equal to v2
}


const DevelopmentMode = () => {
        // parser
    const root = path.dirname(__dirname);
    console.log(Colors.Bright + Colors.Cyan + '-> Development mode is activated!' + Colors.Reset);

    ParseI18n([path.join(root, 'node_modules') ], () => console.log(Colors.Bright + Colors.Green + 'DEV - Parser is ready.' + Colors.Reset));

        // check for updates
    ((url, callback) => {
        console.log(Colors.Bright + Colors.Green + 'DEV - Updater is ready.' + Colors.Reset);

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
            if (compareVersions(newVersion, javet_current_Version)) {
                console.log(`\x1b[33m WARNING: Your plugin version is outdated. Version ${newVersion} is now available. \x1b[0m`);

                const assetUrl = releaseData.assets[0]?.browser_download_url;
                if (assetUrl) {
                    const filePath = path.join(__dirname, 'vcmp-nodejs-plugin.jar');
                    downloadFile(assetUrl, filePath);

                }
            }
        } catch (e) {
            console.error('Error parsing the GitHub response:', e);
        }
    });
};