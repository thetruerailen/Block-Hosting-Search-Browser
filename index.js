const { app, BrowserWindow } = require('electron');
const axios = require('axios');
const { dialog } = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL('https://search.blockhosting.host/');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Check for new version on GitHub
    checkForNewVersion();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

async function checkForNewVersion() {
    try {
        const response = await axios.get('https://api.github.com/repos/Block-Hosting-Development/Block-Hosting-Search-Browser/releases/latest');
        const latestVersion = response.data.tag_name;
        const currentVersion = app.getVersion();

        if (latestVersion !== currentVersion) {
            const dialogOptions = {
                type: 'info',
                buttons: ['Download', 'Cancel'],
                defaultId: 0,
                title: 'New Version Available',
                message: 'A new version of Block Hosting Search Browser is available. Do you want to download it?',
            };

            const choice = await dialog.showMessageBox(mainWindow, dialogOptions);

            if (choice.response === 0) {
                // Open a browser window to the release page for the user to download
                const releaseURL = `https://github.com/Block-Hosting-Development/Block-Hosting-Search-Browser/releases/tag/${latestVersion}`;
                const downloadWindow = new BrowserWindow({ width: 800, height: 600 });
                downloadWindow.loadURL(releaseURL);
            }
        }
    } catch (error) {
        console.error('Error checking for new version:', error);
    }
}
