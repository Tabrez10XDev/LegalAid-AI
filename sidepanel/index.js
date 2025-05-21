import DOMPurify from 'dompurify';
import { marked } from 'marked';


const MAX_MODEL_CHARS = 1000000;

let pageContent = '';

const summaryElement = document.body.querySelector('#summary');
const warningElement = document.body.querySelector('#warning');
const summaryTypeSelect = document.querySelector('#type');
const summaryFormatSelect = document.querySelector('#format');
const summaryLengthSelect = document.querySelector('#length');

function onConfigChange() {
  const oldContent = pageContent;
  pageContent = '';
  onContentChange(oldContent);
}

// [summaryTypeSelect, summaryFormatSelect, summaryLengthSelect].forEach((e) =>
//   e.addEventListener('change', onConfigChange)
// );

chrome.storage.session.get('pageContent', ({ pageContent }) => {
  onContentChange(pageContent);
});

chrome.storage.session.onChanged.addListener((changes) => {
  const pageContent = changes['pageContent'];
  onContentChange(pageContent.newValue);
});

async function onContentChange(newContent) {
  if (pageContent == newContent) {
    // no new content, do nothing
    return;
  }
  pageContent = newContent;
  let summary;
  if (newContent) {
    if (newContent.length > MAX_MODEL_CHARS) {
      updateWarning(
        `Text is too long for summarization with ${newContent.length} characters (maximum supported content length is ~4000 characters).`
      );
    } else {
      updateWarning('');
    }
    showSummary('Loading...');
    summary = await generateSummary(newContent);
  } else {
    summary = "There's nothing to summarize";
  }
  showSummary(summary);
}

async function summarizeFurther(text) {
  // Step 1: Summarize chunks
  const firstSummary = await summarizeDocumentToBullets(text); // Your existing function

  // Step 2: Summarize the combined first summary again (single chunk)
  const condensedSummary = await summarizeChunk(firstSummary);

  // Optionally, convert to bullet points if you want
  const bulletPoints = condensedSummary
    .split(/(?<=\.)\s+/)
    .map(sentence => `• ${sentence.trim()}`)
    .filter(point => point.length > 3);

  return bulletPoints.join('\n');
}

async function generateSummary(text) {
  try {
    const summary = await summarizeDocumentToBullets(text);
    return summary;
  } catch (e) {
    console.log('Summary generation failed');
    console.error(e);
    return 'Error: ' + e.message;
  }
}



async function summarizeChunk(chunk) {
  const modelUrl = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
  const response = await fetch(modelUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
      inputs: chunk,
      options: { wait_for_model: true }
    })
  });

  const data = await response.json();

  if (Array.isArray(data) && data[0]?.summary_text) {
    return data[0].summary_text;
  } else {
    throw new Error("Invalid model response");
  }
}

function splitDocumentIntoChunks(text, maxWords = 700) {
  const words = text.split(' ');
  const chunks = [];

  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(' '));
  }

  return chunks;
}

async function summarizeDocumentToBullets(text) {
  const chunks = splitDocumentIntoChunks(text);
  const summaries = [];

  for (const chunk of chunks) {
    try {
      const summary = await summarizeChunk(chunk);
      summaries.push(summary);
    } catch (err) {
      console.error("Summarization failed for a chunk:", err.message);
    }
  }

  // Convert the collected summaries into bullet points
  const bulletPoints = summaries
    .flatMap(summary => summary.split(/(?<=\.)\s+/))  // split into sentences
    .map(sentence => `• ${sentence.trim()}`)
    .filter(point => point.length > 3);

  return bulletPoints.join('\n');
}





async function showSummary(text) {
  summaryElement.innerHTML = DOMPurify.sanitize(marked.parse(text));
}

async function updateWarning(warning) {
  warningElement.textContent = warning;
  if (warning) {
    warningElement.removeAttribute('hidden');
  } else {
    warningElement.setAttribute('hidden', '');
  }
}
