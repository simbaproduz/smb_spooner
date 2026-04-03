// smb_spooner — file writer integrado
// Usa Node.js fs para gravar arquivos sem sandbox do FXServer
// (io.open e os.execute são sandboxeados no Lua server-side do FXServer; Node.js não é)

const fs = require('fs');
const path = require('path');

on('smb:writeFile', (filePath, content) => {
    try {
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, content, 'utf8');
        const t = new Date().toLocaleString('pt-BR');
        console.log(`[smb_spooner/filewriter] OK: ${filePath} — ${t}`);
    } catch (e) {
        console.log(`[smb_spooner/filewriter] ERRO: ${filePath} — ${e.message}`);
    }
});
