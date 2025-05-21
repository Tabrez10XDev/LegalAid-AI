chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onActivated.addListener((activeInfo) => {
  showSummary(activeInfo.tabId);
});
chrome.tabs.onUpdated.addListener(async (tabId) => {
  showSummary(tabId);
});


async function findTermsInTab(tabId) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const links = anchors
        .map(a => a.href)
        .filter(href => href && href.startsWith('http'));

      const uniqueLinks = [...new Set(links)];
      const matchingLinks = uniqueLinks.filter(link => link.includes("term"));
      return matchingLinks.length > 0 ? matchingLinks[0] : null;
    }
  });

  return result;
}


async function fetchPageText(url) {
  try {
    finalUrl = "http://127.0.0.1:5000/scrape?url="+url
    const res = await fetch(finalUrl);
    const json = await res.json();
    const content = json.content;

    

    return content
    // Extract text content from HTML
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(html, 'text/html');

    // // Collect all <p> tag text
    // const text = Array.from(doc.querySelectorAll('p'))
    //   .map(p => p.textContent.trim())
    //   .filter(Boolean)
    //   .join('\n\n');

    // return text.slice(0, 3000); // limit length if needed
  } catch (e) {
    console.error(`Failed to fetch or parse ${url}`, e.message);
    return null;
  }
}


async function showSummary(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url.startsWith('http')) {
    return;
  }

  

  link = await findTermsInTab(tabId)

  if(link == null)
    return

  
  textInject = await fetchPageText(link)

  chrome.storage.session.set({ pageContent: textInject});

  
  // const injection = await chrome.scripting.executeScript({
  //   target: { tabId },
  //   files: ['scripts/extract-content.js']
  // });
  // chrome.storage.session.set({ pageContent: injection[0].result });
}
