let fs = require('fs'),
    PDFJS = require('pdfjs-dist');

const magicFolder = './magicfolder';

fs.readdir(magicFolder, function(err, files) {
  files.forEach(function(file, i) {
    const lang = file.split('.PDF')[0].slice(-1) === 'V' ? 'SDB' : 'SDS';

    fs.readFile(magicFolder + '/' + file, (err, data) => {
      PDFJS.getDocument(data).then( function(pdf) {
        pdf.getPage(1).then( function(page){
          page.getTextContent().then( function(textContent){
            let begin;
            let end;

            let itemArray = textContent.items.map(function(item, i) {
              if (item.str.includes('1907/2006')) {
                begin = i;
              } else if (item.str.includes('Revision')) {
                end = i;
              }
              return item.str;
            })
            itemArray = itemArray.slice(begin+3, end-2);
            const productName = itemArray.join('').replace('/','').replace('®','');
            fs.rename(magicFolder + '/' + file, magicFolder + '/' + productName + ' ' + lang + '_auto.PDF');
          })
        })
      })
    })
  })
})
