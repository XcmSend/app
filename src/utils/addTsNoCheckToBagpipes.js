const fs = import 'fs');
const path = import 'path');

function addTsNoCheck(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      addTsNoCheck(filePath);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.startsWith('// @ts-nocheck')) {
        const newContent = '// @ts-nocheck\n' + content;
        fs.writeFileSync(filePath, newContent, 'utf8');
      }
    }
  });
}

const bagpipesDir = path.resolve(__dirname, './components/Bagpipes'); 
addTsNoCheck(bagpipesDir);
