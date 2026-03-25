chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'THREAT_DETECTED') {
    const { data } = msg;
    const threat = data.threat || {};
    const domain = new URL(window.location.href).hostname;

    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '-150px';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.zIndex = '2147483647';
    banner.style.backgroundColor = '#DC2626';
    banner.style.color = '#FFFFFF';
    banner.style.padding = '16px';
    banner.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    banner.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    banner.style.display = 'flex';
    banner.style.flexDirection = 'column';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'center';
    banner.style.transition = 'top 0.4s ease-out';
    banner.style.boxSizing = 'border-box';

    const header = document.createElement('h2');
    header.innerHTML = `🛡️ ShieldWeb3 Security Alert`;
    header.style.margin = '0 0 8px 0';
    header.style.fontSize = '24px';
    header.style.fontWeight = 'bold';

    const text = document.createElement('p');
    text.innerHTML = `Warning! <strong>${domain}</strong> has been flagged as a ${threat.threatType || 'suspicious'} site (Severity: ${threat.severity || 'Unknown'}).`;
    text.style.margin = '0 0 12px 0';
    text.style.fontSize = '16px';

    const verifiedBadge = threat.verified ? `<span style="background:#10B981;padding:2px 8px;border-radius:12px;font-size:12px;margin-left:8px;font-weight:bold;">✅ Verified on Stellar</span>` : '';
    text.innerHTML += verifiedBadge;

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '16px';

    const backBtn = document.createElement('button');
    backBtn.innerText = 'Go Back (Recommended)';
    backBtn.style.padding = '10px 20px';
    backBtn.style.backgroundColor = '#FFFFFF';
    backBtn.style.color = '#DC2626';
    backBtn.style.border = 'none';
    backBtn.style.borderRadius = '6px';
    backBtn.style.fontWeight = 'bold';
    backBtn.style.cursor = 'pointer';
    backBtn.onclick = () => window.history.back();

    const dismissBtn = document.createElement('button');
    dismissBtn.innerText = 'Dismiss Risk';
    dismissBtn.style.padding = '10px 20px';
    dismissBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    dismissBtn.style.color = '#FFFFFF';
    dismissBtn.style.border = '1px solid rgba(255, 255, 255, 0.4)';
    dismissBtn.style.borderRadius = '6px';
    dismissBtn.style.cursor = 'pointer';
    dismissBtn.onclick = () => {
        banner.style.top = '-150px';
        setTimeout(() => banner.remove(), 400);
    };

    btnContainer.appendChild(backBtn);
    btnContainer.appendChild(dismissBtn);

    banner.appendChild(header);
    banner.appendChild(text);
    banner.appendChild(btnContainer);

    document.documentElement.appendChild(banner);

    // Trigger animation
    setTimeout(() => {
        banner.style.top = '0';
    }, 100);
  }
});
