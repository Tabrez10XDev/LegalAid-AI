import { isProbablyReaderable, Readability } from '@mozilla/readability';

function canBeParsed(document) {
  return isProbablyReaderable(document, {
    minContentLength: 100
  });
}

function parse(document) {
  if (!canBeParsed(document)) {
    console.log("Parsing failed");
    
    return false;
  }
  console.log("Parsing Success");
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();
  
  return article.textContent;
}

parse(window.document);
