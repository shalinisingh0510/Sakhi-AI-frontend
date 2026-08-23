const fs = require('fs');
const path = require('path');
const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(messagesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.common) {
    data.common = { appName: "Sakhi AI" };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log('Fixed', file);
  }
}
