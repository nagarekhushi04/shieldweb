const API_BASE = 'https://shieldweb3-api.railway.app';
const CACHE_TTL = 5 * 60 * 1000;
const threatCache = new Map();
const safeCache = new Map();

async function checkUrl(url) {
  if (!url?.startsWith('http')) return null;
  if (url.includes('localhost') || url.includes('chrome-extension://')) return null;
  const domain = new URL(url).hostname;
  const now = Date.now();
  if (safeCache.has(domain) && now - safeCache.get(domain) < CACHE_TTL) return { safe: true, source: 'cache' };
  if (threatCache.has(domain) && now - threatCache.get(domain).ts < CACHE_TTL) return threatCache.get(domain).data;
  try {
    const res = await fetch(`${API_BASE}/api/threats/check?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    if (data.safe) safeCache.set(domain, now);
    else threatCache.set(domain, { data, ts: now });
    return data;
  } catch { return null; }
}

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return;
  const result = await checkUrl(details.url);
  if (!result) return;
  
  if (result.safe) {
    chrome.action.setBadgeText({ text: '', tabId: details.tabId });
    return;
  }
  
  chrome.action.setBadgeText({ text: '!', tabId: details.tabId });
  chrome.action.setBadgeBackgroundColor({ color: '#DC2626', tabId: details.tabId });
  chrome.tabs.sendMessage(details.tabId, { type: 'THREAT_DETECTED', data: result, url: details.url }).catch(() => {});
  
  if (result.threat?.severity >= 3) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.svg',
      title: 'ShieldWeb3: Phishing Site Detected',
      message: `${new URL(details.url).hostname} is flagged as ${result.threat?.threatType || 'suspicious'}`,
      priority: 2
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'CHECK_URL') { 
    checkUrl(msg.url).then(sendResponse); 
    return true; 
  }
  if (msg.type === 'GET_TAB_STATUS') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0];
      checkUrl(tab?.url).then((res) => sendResponse({ result: res, url: tab?.url }));
    });
    return true;
  }
  if (msg.type === 'REPORT_URL') {
    chrome.storage.local.get('authToken', async ({ authToken }) => {
      if (!authToken) { sendResponse({ error: 'not authenticated' }); return; }
      try {
        const res = await fetch(`${API_BASE}/api/reports/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify({ url: msg.url, threatType: 'phishing', severity: 2 })
        });
        sendResponse(await res.json());
      } catch (e) { sendResponse({ error: e.message }); }
    });
    return true;
  }
});
