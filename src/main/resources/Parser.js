const { argv0 } = require("process");
    // Colors
const Colors    = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Yellow: '\x1b[33m',
    Cyan: '\x1b[36m',
    Blue: '\x1b[34m',
    Magenta: '\x1b[35m',
    erase: "\x1b[2K\r",
};

const ParseI18n = (arrKit, finish, reducedLines=false) => {
    let totalFilesScanned = 0;
    let totalFilesModified = 0;
    let pendingOperations = 0;

    function replaceUnicode(input) {
        // may add more if needed
        const replacements = [
            { pattern: /\\p\{Letter\}/g, replacement: 'A-Za-z' },
            { pattern: /\\p\{Number\}/g, replacement: '0-9' },
            { pattern: /\\p\{L\}/g, replacement: 'A-Za-z' },
            { pattern: /\\p\{N\}/g, replacement: '0-9' },
            { pattern: /\\p\{No\}/g, replacement: '0-9' },
            { pattern: /\\p\{Nd\}/g, replacement: '0-9' },
            { pattern: /\\p\{N1\}/g, replacement: '0-9' },
            { pattern: /\\p\{Z\}/g, replacement: '\\s' },
            { pattern: /\\p\{Ll\}/g, replacement: 'a-z' },
            { pattern: /\\p\{Lu\}/g, replacement: 'A-Z' },
            { pattern: /\\p\{Lt\}/g, replacement: 'A-Za-z' },
            { pattern: /\\p\{Lm\}/g, replacement: 'A-Za-z' },
            { pattern: /\\p\{Lo\}/g, replacement: 'A-Za-z' },
            { pattern: /\\p\{Zl\}/g, replacement: '\n' },
            { pattern: /\\p\{Zp\}/g, replacement: '\n' },
            { pattern: /\\p\{Zs\}/g, replacement: '\\s' },
            { pattern: /\\p\{sc=Devanagari\}/g, replacement: '\\u0900-\\u097F' },
            { pattern: /\\p\{sc=Deva\}/g, replacement: '\\u0900-\\u097F' },
            { pattern: /\\p\{sc=Thai\}/g, replacement: '' },
            { pattern: /\\p\{Punct\}/g, replacement: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~' },
            { pattern: /\\p\{P\}/g, replacement: '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~' },
            { pattern: /\\p\{Graph\}/g, replacement: '^ \\t\\n\\r\\f\\v' },
            { pattern: /\\p\{Space\}/g, replacement: ' \\t\\n\\r\\f\\v' },
        ];

        replacements.forEach(({ pattern, replacement }) => input = input.replace(pattern, replacement));
        return input;
    }

        // Function to check if all operations are complete
    function checkCompletion() {
        if (pendingOperations === 0) {
            if (totalFilesModified > 0) {
                console.log('');
                console.log(Colors.Dim +  `Completed! | Scanned: ${totalFilesScanned}/${totalFilesScanned} | Parsed Items: ${totalFilesModified}`);
                console.log(Colors.Bright + Colors.Green + `You should start the server now!.` + Colors.Reset);
                process.exit(0);
            }

            // Return stats in the finish callback
            finish({
                totalFiles: totalFilesScanned,
                modifiedFiles: totalFilesModified
            });
        }
    }

    function processFile(filePath, fileList) {
        pendingOperations++;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                pendingOperations--;
                checkCompletion();
                return;
            }

            totalFilesScanned++;
            const sanitizedContent = replaceUnicode(data);
            const fileName = path.basename(filePath);

            // Compare and show only edited lines
            if (sanitizedContent !== data) {

                console.log(Colors.Bright, `file: ${fileName} was patched.`, Colors.Reset);

                fs.writeFile(filePath, sanitizedContent, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    } else {
                        totalFilesModified++;
                    }
                });
            };

            pendingOperations--;
            checkCompletion();
        });
    }

    function processFilesInFolder(folderPath, subPath = '') {
        pendingOperations++;

        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.error(Colors.Red + '- Error: Something went wrong with the directory.' + Colors.Reset);
                pendingOperations--;
                checkCompletion();
                return;
            }

            // Separate files and directories
            const fileList = [];
            const dirList = [];

            files.forEach(file => {
                const filePath = path.join(folderPath, file);
                try {
                    const stats = fs.statSync(filePath);
                    if (stats.isFile() && path.extname(file) === '.js') {
                        fileList.push(filePath);
                    } else if (stats.isDirectory()) {
                        dirList.push(filePath);
                    }
                } catch (error) {
                    console.error(`Error accessing ${filePath}:`, error);
                }
            });

            // Process files in the current folder
            fileList.forEach(filePath => processFile(filePath, fileList));
            // Process directories recursively
            dirList.forEach(dirPath => {
                const relativeSubPath = path.join(subPath, path.basename(dirPath));
                processFilesInFolder(dirPath, relativeSubPath);
            });

            pendingOperations--;
            checkCompletion();
        });
    }

    arrKit.forEach(folderPath => {
        processFilesInFolder(folderPath, '');
    });

};