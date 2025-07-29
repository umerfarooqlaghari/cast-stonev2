const fs = require('fs');
const path = require('path');

// Function to check if a file has syntax errors
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    const openBrackets = (content.match(/\[/g) || []).length;
    const closeBrackets = (content.match(/\]/g) || []).length;
    
    const issues = [];
    
    if (openBraces !== closeBraces) {
      issues.push(`Mismatched braces: ${openBraces} open, ${closeBraces} close`);
    }
    
    if (openParens !== closeParens) {
      issues.push(`Mismatched parentheses: ${openParens} open, ${closeParens} close`);
    }
    
    if (openBrackets !== closeBrackets) {
      issues.push(`Mismatched brackets: ${openBrackets} open, ${closeBrackets} close`);
    }
    
    // Check for common JSX issues
    if (content.includes('<div') && !content.includes('</div>')) {
      issues.push('Potential unclosed div tags');
    }
    
    // Check for missing imports
    if (content.includes('React.FC') && !content.includes('import React')) {
      issues.push('Missing React import');
    }
    
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

// Pages and components to check
const pagesToCheck = [
  'src/app/catalog/page.tsx',
  'src/app/collections/page.tsx',
  'src/app/collections/[id]/page.tsx',
  'src/app/products/page.tsx',
  'src/components/ui/MagazineSection/MagazineSection.tsx',
  'src/components/ui/MagazineCard/MagazineCard.tsx',
  'src/components/ui/MagazineGrid/MagazineGrid.tsx',
  'src/components/products/MagazineProductCard/MagazineProductCard.tsx',
  'src/components/products/MagazineProductGrid/MagazineProductGrid.tsx',
  'src/utils/cloudinaryUtils.ts'
];

console.log('Checking pages for syntax issues...\n');

pagesToCheck.forEach(pagePath => {
  const fullPath = path.join(__dirname, pagePath);
  const result = checkFile(fullPath);
  
  console.log(`📄 ${result.file}`);
  console.log(`Status: ${result.status}`);
  
  if (result.issues.length > 0) {
    console.log('Issues:');
    result.issues.forEach(issue => {
      console.log(`  ❌ ${issue}`);
    });
  } else {
    console.log('  ✅ No issues found');
  }
  
  console.log('');
});

console.log('Page check complete!');
