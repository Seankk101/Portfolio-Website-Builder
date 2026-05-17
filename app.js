let projects = [];
let projectId = 0;

// ---------- PROJECT ENTRIES ----------

function addProject() {
  const id = projectId++;
  projects.push({ id, name: '', desc: '', url: '' });
  renderProjectInputs();
  update();
}

function removeProject(id) {
  projects = projects.filter(p => p.id !== id);
  renderProjectInputs();
  update();
}

function renderProjectInputs() {
  document.getElementById('projects-list').innerHTML = projects.map(p => `
    <div class="project-entry">
      <button class="project-del" onclick="removeProject(${p.id})">✕</button>
      <input type="text" placeholder="Project name"
        value="${p.name}" oninput="updateProject(${p.id},'name',this.value)" />
      <input type="text" placeholder="Short description"
        value="${p.desc}" oninput="updateProject(${p.id},'desc',this.value)" />
      <input type="text" placeholder="URL (optional)"
        value="${p.url}" oninput="updateProject(${p.id},'url',this.value)" />
    </div>
  `).join('');
}

function updateProject(id, field, value) {
  const p = projects.find(p => p.id === id);
  if (p) p[field] = value;
  update();
}

// ---------- GATHER DATA ----------

function getData() {
  const color = document.getElementById('p-color').value;
  document.getElementById('color-display').textContent = color;
  return {
    name:     document.getElementById('p-name').value    || 'Your Name',
    title:    document.getElementById('p-title').value   || 'Frontend Developer',
    bio:      document.getElementById('p-bio').value     || 'Welcome to my portfolio.',
    email:    document.getElementById('p-email').value   || '',
    github:   document.getElementById('p-github').value  || '',
    linkedin: document.getElementById('p-linkedin').value|| '',
    skills:   document.getElementById('p-skills').value
                .split(',').map(s => s.trim()).filter(Boolean),
    color,
    layout:   document.getElementById('p-layout').value,
    projects: [...projects]
  };
}

// ---------- BUILD HTML ----------

function buildPortfolioHTML(d) {
  const skillBadges = d.skills.map(s =>
    `<span class="skill-badge">${s}</span>`).join('');

  const projectCards = d.projects.filter(p => p.name).map(p => `
    <div class="proj-card">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      ${p.url ? `<a href="${p.url}" target="_blank">View project →</a>` : ''}
    </div>
  `).join('');

  const links = [
    d.email    ? `<a href="mailto:${d.email}">Email</a>`       : '',
    d.github   ? `<a href="${d.github}" target="_blank">GitHub</a>`   : '',
    d.linkedin ? `<a href="${d.linkedin}" target="_blank">LinkedIn</a>` : '',
  ].filter(Boolean).join(' · ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${d.name} — Portfolio</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#222;background:#fff;line-height:1.6}
    a{color:${d.color};text-decoration:none}
    a:hover{text-decoration:underline}

    .hero{
      background:${d.layout === 'bold' ? d.color : '#f9fafb'};
      color:${d.layout === 'bold' ? '#fff' : '#222'};
      padding:80px 24px;
      text-align:center;
    }
    .hero h1{font-size:40px;font-weight:700;margin-bottom:10px}
    .hero .role{font-size:18px;opacity:0.75;margin-bottom:20px}
    .hero .bio{max-width:580px;margin:0 auto 24px;font-size:16px;opacity:0.85}
    .hero .links{font-size:14px;opacity:0.8}
    .hero .links a{color:${d.layout === 'bold' ? '#fff' : d.color};margin:0 8px}

    .container{max-width:800px;margin:0 auto;padding:60px 24px}

    section{margin-bottom:56px}
    section h2{font-size:22px;font-weight:700;margin-bottom:20px;
      padding-bottom:10px;border-bottom:2px solid ${d.color}}

    .skills{display:flex;flex-wrap:wrap;gap:10px}
    .skill-badge{
      background:${d.color}18;
      color:${d.color};
      border:1px solid ${d.color}44;
      padding:6px 16px;
      border-radius:20px;
      font-size:14px;
      font-weight:500;
    }

    .projects{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:20px;
    }
    .proj-card{
      border:1px solid #eee;
      border-radius:10px;
      padding:20px;
      transition:box-shadow 0.2s;
    }
    .proj-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.08)}
    .proj-card h3{font-size:16px;font-weight:600;margin-bottom:8px;color:${d.color}}
    .proj-card p{font-size:14px;color:#555;margin-bottom:12px}
    .proj-card a{font-size:13px;font-weight:600;color:${d.color}}

    footer{text-align:center;padding:32px;font-size:13px;color:#aaa;
      border-top:1px solid #f0f0f0}

    @media(max-width:600px){
      .hero h1{font-size:28px}
      .container{padding:40px 16px}
    }
  </style>
</head>
<body>

  <div class="hero">
    <h1>${d.name}</h1>
    <p class="role">${d.title}</p>
    <p class="bio">${d.bio}</p>
    <div class="links">${links}</div>
  </div>

  <div class="container">

    ${d.skills.length ? `
    <section>
      <h2>Skills</h2>
      <div class="skills">${skillBadges}</div>
    </section>` : ''}

    ${d.projects.filter(p => p.name).length ? `
    <section>
      <h2>Projects</h2>
      <div class="projects">${projectCards}</div>
    </section>` : ''}

    ${d.email ? `
    <section>
      <h2>Contact</h2>
      <p>I'm open to new opportunities. Reach me at
        <a href="mailto:${d.email}">${d.email}</a>.
      </p>
    </section>` : ''}

  </div>

  <footer>Built with Portfolio Builder</footer>

</body>
</html>`;
}

// ---------- UPDATE PREVIEW ----------

function update() {
  const d    = getData();
  const html = buildPortfolioHTML(d);
  const frame = document.getElementById('preview-frame');
  const doc   = frame.contentDocument || frame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
}

// ---------- DEVICE TOGGLE ----------

function setDevice(device) {
  const wrap = document.getElementById('frame-wrap');
  wrap.className = 'preview-frame-wrap ' + (device !== 'desktop' ? device : '');
  document.querySelectorAll('.device-btns button').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + device).classList.add('active');
}

// ---------- AI BIO ----------

async function improveBio() {
  const bioEl = document.getElementById('p-bio');
  const name  = document.getElementById('p-name').value  || 'a developer';
  const title = document.getElementById('p-title').value || 'Frontend Developer';
  const skills = document.getElementById('p-skills').value || '';

  const original = bioEl.value.trim();
  bioEl.value = 'AI is improving your bio...';
  update();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Write a compelling 2-sentence portfolio bio for ${name}, a ${title} with skills in ${skills}.
${original ? 'Improve this existing bio: ' + original : 'Make it professional, confident, and human.'}
Return ONLY the bio text, nothing else.`
        }]
      })
    });

    const data = await res.json();
    bioEl.value = data.content[0].text.trim();
  } catch (err) {
    bioEl.value = original;
    alert('Could not improve bio. Please try again.');
  }

  update();
}

// ---------- EXPORT ----------

function exportSite() {
  const d    = getData();
  const html = buildPortfolioHTML(d);
  const blob = new Blob([html], { type: 'text/html' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = (d.name.replace(/\s+/g, '-').toLowerCase() || 'portfolio') + '.html';
  a.click();
}

// ---------- INIT ----------
update();