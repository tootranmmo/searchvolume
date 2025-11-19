document.getElementById('toggleBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggleSidebar
  });

  document.getElementById('status').textContent = 'Sidebar toggled!';
  setTimeout(() => {
    document.getElementById('status').textContent = 'Ready to use!';
  }, 2000);
});

function toggleSidebar() {
  const event = new CustomEvent('xpath-toggle-sidebar');
  window.dispatchEvent(event);
}
