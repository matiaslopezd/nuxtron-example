import { app } from 'electron';
import {
  createWindow,
  exitOnChange,
} from './helpers';

const express = require('express');
const server = express();
server.use(express.static(__dirname));

const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    server.listen(4545, () => mainWindow.loadURL('http://localhost:4545/home')); // Open window when express is loaded
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  if (isProd) server.close();
  app.quit();
});
