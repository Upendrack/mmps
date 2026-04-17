const markdownpdf = require('markdown-pdf');
const fs = require('fs');

markdownpdf().from('Project_Documentation.md').to('Project_Documentation.pdf', function (err) {
  if (err) {
    console.error('Error generating PDF:', err);
  } else {
    console.log('PDF generated successfully!');
  }
});
