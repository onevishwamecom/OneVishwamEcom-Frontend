const fs = require('fs');
let content = fs.readFileSync('src/data/dummyProperties.js', 'utf8');

// The objects are in an array: export const DUMMY_PROPERTIES = [ { ... }, { ... } ];
// We can use a regex with a replacer function to match each property object block
content = content.replace(/\{[^}]*?propertyType:\s*['"]([^'"]+)['"][^}]*?\}/g, (match, propType) => {
  // Determine correct possession based on propType
  const isPlot = /(plot|site|land)/i.test(propType);
  const correctPossession = isPlot ? 'Ready for Registration' : 'Ready for Occupy';
  
  // Replace the possession line
  if (match.includes('possession:')) {
    return match.replace(/possession:\s*['"][^'"]+['"]/, `possession: '${correctPossession}'`);
  } else {
    // If possession doesn't exist, maybe add it before approval or somewhere?
    // Let's assume it exists in all
    return match;
  }
});

fs.writeFileSync('src/data/dummyProperties.js', content, 'utf8');
console.log('Fixed possession statuses.');
