document.getElementById('share-button').addEventListener('click', async () => {
  const data = { title: 'Vijay Tupakula | Savvy Agents', text: "Let's stay in touch.", url: 'https://vijay.savvyagents.work/' };
  const status = document.getElementById('share-status');
  try {
    if (navigator.share) {
      await navigator.share(data);
    } else {
      await navigator.clipboard.writeText(data.url);
      status.textContent = 'Page link copied.';
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      status.textContent = 'You can copy the link above: vijay.savvyagents.work';
    }
  }
});
