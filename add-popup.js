const fs = require('fs');

fs.readFile('dist/bookmarks/index.html', 'utf8', (err, data) => {
  data = data.replace(`var extensionMode = 'options';`, `var extensionMode = 'popup';`);
  fs.writeFileSync('dist/bookmarks/popup.html', data, 'utf8');
});
