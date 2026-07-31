(function () {
  const $ = (id) => document.getElementById(id);

  function releaseDownloadUrl(data, latest) {
    if (latest.url && String(latest.url).trim()) return latest.url.trim();
    const owner = data.github && data.github.owner;
    const repo = data.github && data.github.repo;
    const tag = latest.tag || (`v${latest.version}`);
    const file = latest.file;
    if (!owner || owner === 'YOUR_GITHUB_USERNAME' || !repo || !file) return '';
    return `https://github.com/${owner}/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(file)}`;
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + (iso.length <= 10 ? 'T12:00:00Z' : ''));
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function setDownloadButtons(url) {
    const ids = ['btnDownload', 'btnDownloadMain'];
    for (const id of ids) {
      const el = $(id);
      if (!el) continue;
      if (url) {
        el.href = url;
        el.rel = 'noopener';
        el.removeAttribute('aria-disabled');
        el.classList.remove('is-disabled');
      } else {
        el.href = '#download';
        el.classList.add('is-disabled');
        el.setAttribute('aria-disabled', 'true');
      }
    }
  }

  function render(data) {
    const latest = data.latest || {};
    const url = releaseDownloadUrl(data, latest);

    $('heroMeta').textContent = latest.version
      ? `Latest · ${latest.version} · Windows · ~${latest.sizeMb || '?'} MB`
      : 'Latest build coming soon';

    $('dlVersion').textContent = latest.version || '—';
    $('dlFile').textContent = latest.file
      ? `${latest.file}${latest.releasedAt ? ' · ' + formatDate(latest.releasedAt) : ''}`
      : 'Upload a GitHub Release, then set github.owner / github.repo in releases.json';

    const hint = $('dlHint');
    if (!url) {
      hint.textContent = 'Download link not ready yet. Edit docs/releases.json (github.owner, github.repo) and publish a GitHub Release with the .exe attached.';
    } else {
      hint.textContent = 'Same personal beta key as before. Install over the previous build to keep activation.';
    }
    setDownloadButtons(url);

    const notesHost = $('latestNotes');
    notesHost.innerHTML = '';
    const notes = Array.isArray(latest.notes) ? latest.notes : [];
    if (!notes.length) {
      notesHost.innerHTML = '<p class="section-lede">Release notes will appear here.</p>';
    } else {
      const ul = document.createElement('ul');
      ul.className = 'notes';
      notes.forEach((n, i) => {
        const li = document.createElement('li');
        li.className = 'note-item';
        li.style.animationDelay = `${0.05 * i}s`;
        li.textContent = n;
        ul.appendChild(li);
      });
      notesHost.appendChild(ul);
    }

    const hist = $('history');
    hist.innerHTML = '';
    const history = Array.isArray(data.history) ? data.history : [];
    if (history.length) {
      const title = document.createElement('p');
      title.className = 'dl-label';
      title.textContent = 'Earlier builds';
      hist.appendChild(title);
      history.forEach((h) => {
        const item = document.createElement('article');
        item.className = 'hist-item';
        const head = document.createElement('div');
        head.className = 'hist-head';
        head.innerHTML = `<span class="hist-ver">${escapeHtml(h.version || '')}</span>` +
          (h.releasedAt ? `<span class="hist-date">${escapeHtml(formatDate(h.releasedAt))}</span>` : '');
        item.appendChild(head);
        if (Array.isArray(h.notes) && h.notes.length) {
          const ul = document.createElement('ul');
          ul.className = 'hist-notes';
          h.notes.forEach((n) => {
            const li = document.createElement('li');
            li.textContent = n;
            ul.appendChild(li);
          });
          item.appendChild(ul);
        }
        hist.appendChild(item);
      });
    }

    if (data.expiresAt) {
      $('expiryLine').textContent = `Closed beta window ends ${formatDate(data.expiresAt)}. Commercial release will use new licenses.`;
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  fetch('releases.json', { cache: 'no-store' })
    .then((r) => {
      if (!r.ok) throw new Error('releases.json missing');
      return r.json();
    })
    .then(render)
    .catch(() => {
      $('heroMeta').textContent = 'Could not load releases.json';
      $('dlHint').textContent = 'Add docs/releases.json and enable GitHub Pages from the /docs folder.';
      setDownloadButtons('');
    });
})();
