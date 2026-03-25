document.addEventListener('DOMContentLoaded', () => {
    const statusBadge = document.getElementById('statusBadge');
    const domainName = document.getElementById('domainName');
    const scoreBar = document.getElementById('scoreBar');
    const detailsDiv = document.getElementById('detailsDiv');
    const reportBtn = document.getElementById('reportBtn');
    const statsDiv = document.getElementById('statsDiv');
    const walletAddress = document.getElementById('walletAddress');

    let currentUrl = '';

    chrome.storage.local.get(['protectedCount', 'wallet'], (data) => {
        statsDiv.innerText = `Sites protected: ${data.protectedCount || 0}`;
        if (data.wallet) {
            walletAddress.innerText = `${data.wallet.substring(0,6)}...${data.wallet.slice(-4)}`;
        }
    });

    chrome.runtime.sendMessage({ type: 'GET_TAB_STATUS' }, (response) => {
        if (!response || !response.url) {
            statusBadge.innerText = 'IGNORED';
            domainName.innerText = 'System Page';
            return;
        }

        currentUrl = response.url;
        domainName.innerText = new URL(currentUrl).hostname;

        const res = response.result;
        if (!res) {
            statusBadge.className = 'status-badge unknown';
            statusBadge.innerText = 'UNKNOWN';
            reportBtn.style.display = 'block';
            return;
        }

        if (res.safe) {
            statusBadge.className = 'status-badge safe';
            statusBadge.innerText = 'SAFE';
            scoreBar.style.width = '10%';
            scoreBar.style.background = '#10B981';
            detailsDiv.innerHTML = `No threats detected.<br>ML Score: ${(res.mlScore || 0).toFixed(2)}`;
            reportBtn.style.display = 'block';
        } else {
            statusBadge.className = 'status-badge threat';
            statusBadge.innerText = 'THREAT DETECTED';
            scoreBar.style.width = `${Math.min((res.mlScore || 1) * 100, 100)}%`;
            scoreBar.style.background = '#DC2626';
            
            const threat = res.threat || {};
            let html = `<strong>Type:</strong> ${threat.threatType || 'Phishing'}<br>`;
            html += `<strong>Severity:</strong> ${threat.severity || 'Unknown'}<br>`;
            if (threat.verified) html += `✅ <strong>Verified on Stellar</strong><br>`;
            if (threat.onChainTxHash) html += `🔗 <a href="https://stellar.expert/explorer/testnet/tx/${threat.onChainTxHash}" target="_blank" style="color:#3B82F6;">View Tx</a>`;
            detailsDiv.innerHTML = html;
        }

        chrome.storage.local.get(['protectedCount'], (data) => {
            const newCount = (data.protectedCount || 0) + 1;
            chrome.storage.local.set({ protectedCount: newCount });
            statsDiv.innerText = `Sites protected: ${newCount}`;
        });
    });

    reportBtn.addEventListener('click', () => {
        reportBtn.innerText = 'Reporting...';
        reportBtn.disabled = true;
        chrome.runtime.sendMessage({ type: 'REPORT_URL', url: currentUrl }, (res) => {
            if (res && !res.error) {
                reportBtn.innerText = 'Report Submitted';
                reportBtn.style.background = '#10B981';
            } else {
                reportBtn.innerText = 'Report Failed (Please connect)';
                reportBtn.disabled = false;
            }
        });
    });
});
