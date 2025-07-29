const fs = require('fs');
const path = require('path');

// Function to check for apostrophe issues
function checkApostrophes(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    lines.forEach((line, index) => {
      // Check for unescaped apostrophes in JSX
      if (line.includes("'") && (line.includes('<') || line.includes('>'))) {
        // Look for patterns like: text='don't' or text="don't"
        const apostropheInJSX = line.match(/[\w\s]+'[\w\s]*'/g);
        if (apostropheInJSX) {
          issues.push({
            line: index + 1,
            content: line.trim(),
            issue: 'Unescaped apostrophe in JSX text',
            suggestion: 'Use &apos; instead of \''
          });
        }
      }
      
      // Check for smart quotes
      if (line.includes(''') || line.includes(''') || line.includes('"') || line.includes('"')) {
        issues.push({
          line: index + 1,
          content: line.trim(),
          issue: 'Smart quotes detected',
          suggestion: 'Use regular quotes'
        });
      }
    });
    
    return {
      file: filePath,
      issues: issues,
      status: issues.length === 0 ? 'OK' : 'ISSUES'
    };
  } catch (error) {
    return {
      file: filePath,
      issues: [`Error reading file: ${error.message}`],
      status: 'ERROR'
    };
  }
}

// Files to check
const filesToCheck = [
  'src/app/catalog/page.tsx',
  'src/app/collections/page.tsx',
  'src/app/collections/[id]/page.tsx',
  'src/app/products/page.tsx',
  'src/components/ui/MagazineSection/MagazineSection.tsx',
  'src/components/ui/MagazineCard/MagazineCard.tsx',
  'src/components/ui/MagazineGrid/MagazineGrid.tsx',
  'src/components/products/MagazineProductCard/MagazineProductCard.tsx',
  'src/components/products/MagazineProductGrid/MagazineProductGrid.tsx'
];

console.log('Checking for apostrophe and quote issues...\n');

let totalIssues = 0;

filesToCheck.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  const result = checkApostrophes(fullPath);
  
  console.log(`📄 ${result.file}`);
  console.log(`Status: ${result.status}`);
  
  if (result.issues.length > 0) {
    totalIssues += result.issues.length;
    console.log('Issues:');
    result.issues.forEach(issue => {
      if (typeof issue === 'string') {
        console.log(`  ❌ ${issue}`);
      } else {
        console.log(`  ❌ Line ${issue.line}: ${issue.issue}`);
        console.log(`     Content: ${issue.content}`);
        console.log(`     Suggestion: ${issue.suggestion}`);
      }
    });
  } else {
    console.log('  ✅ No issues found');
  }
  
  console.log('');
});

console.log(`Check complete! Found ${totalIssues} total issues.`);
