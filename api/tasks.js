// Vercel Serverless Function — Live Asana sync
// Fetches all incomplete tasks assigned to the authenticated user
// Requires: ASANA_PAT environment variable in Vercel project settings

const WORKSPACE_GID = '34125054317482';

// Known section mapping — updated from last full sync.
// Tasks not in this map show as "Recently assigned".
const SECTION_MAP = {
  "1207201740646157": "Need to discuss - Kanban",
  "1207996971727134": "Need to discuss - Kanban",
  "1208147394481279": "Need to discuss - Kanban",
  "1208508156972078": "Need to discuss - Kanban",
  "1208722111638975": "Need to provide update later",
  "1209116798682838": "Need to provide update later",
  "1209908330531726": "Taken up - Kanban",
  "1210021181928881": "Need to scope",
  "1209420028216555": "Need to provide update later",
  "1210269753639009": "Need to scope",
  "1210096688604041": "Taken up - Kanban",
  "1210592070607361": "Need to provide update later",
  "1210351179571894": "Groomed - Kanban",
  "1211146188399809": "Groomed - Kanban",
  "1211801890475244": "KPI's",
  "1211801849898758": "Need to discuss - Kanban",
  "1210349612429362": "Need to discuss - Kanban",
  "1210913480438271": "Need to discuss - Kanban",
  "1211848454163988": "Need to discuss - Kanban",
  "1211895521862967": "Taken up - Kanban",
  "1211784680833029": "Need to provide update later",
  "1211506344528089": "Need to discuss - Kanban",
  "1213146303134655": "KPI's",
  "1212486750797587": "Need to discuss - Kanban"
};

function parseNotes(notes = '') {
  const get = (label) => {
    const m = notes.match(new RegExp(label + '\\s*\\n\\s*([^\\n]+)', 'i'));
    return m ? m[1].trim() : null;
  };
  return {
    platform: get('Platform') || 'General',
    severity: get('Severity') || get('Importance') || null,
    client:   get('CompanyName') || get('Client') || '',
  };
}

function toImportance(sev = '', tags = []) {
  const all = [sev, ...tags].join(' ').toLowerCase();
  if (all.includes('x16')) return 'x16';
  if (all.includes('x8'))  return 'x8';
  if (all.includes('x4'))  return 'x4';
  if (all.includes('x2'))  return 'x2';
  return 'unknown';
}

function toPriority(sev = '', tags = []) {
  const imp = toImportance(sev, tags);
  if (imp === 'x16') return 'P0';
  if (imp === 'x8')  return 'P1';
  return 'P2';
}

function transform(raw) {
  const notes  = raw.notes || '';
  const tags   = (raw.tags || []).map(t => t.name);
  const parsed = parseNotes(notes);
  const sev    = parsed.severity || tags.find(t => /^[xX]\d+/.test(t)) || '';

  return {
    gid:           raw.gid,
    name:          raw.name || '',
    due_on:        raw.due_on || null,
    modified:      (raw.modified_at || '').slice(0, 10),
    follower_count: (raw.followers || []).length,
    importance:    toImportance(sev, tags),
    platform:      parsed.platform,
    client:        parsed.client,
    priority:      toPriority(sev, tags),
    section:       SECTION_MAP[raw.gid] || 'Recently assigned',
    notes_preview: notes.replace(/\n/g, ' ').slice(0, 200),
    num_subtasks:  raw.num_subtasks || 0,
    tags,
    asana_url:     `https://app.asana.com/1/${WORKSPACE_GID}/task/${raw.gid}`,
  };
}

async function fetchAllTasks(pat) {
  const fields = [
    'gid', 'name', 'due_on', 'modified_at', 'completed',
    'followers', 'num_subtasks', 'notes', 'tags.name'
  ].join(',');

  const firstPage = `https://app.asana.com/api/1.0/tasks`
    + `?assignee=me&workspace=${WORKSPACE_GID}`
    + `&completed_since=now&limit=100&opt_fields=${fields}`;

  const allTasks = [];
  let url = firstPage;

  while (url && allTasks.length < 500) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${pat}`, Accept: 'application/json' }
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Asana API ${res.status}: ${body.slice(0, 200)}`);
    }

    const data = await res.json();
    const page = data.data || [];

    for (const t of page) {
      if (!t.completed) allTasks.push(transform(t));
    }

    url = data.next_page?.uri || null;
  }

  return allTasks;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pat = process.env.ASANA_PAT;
  if (!pat) {
    return res.status(500).json({
      error: 'ASANA_PAT environment variable is not set in Vercel.',
      fix: 'Go to Vercel → Project → Settings → Environment Variables → add ASANA_PAT'
    });
  }

  try {
    const tasks = await fetchAllTasks(pat);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json({
      tasks,
      syncedAt: new Date().toISOString(),
      totalSections: [...new Set(tasks.map(t => t.section))],
    });
  } catch (err) {
    console.error('[Asana sync error]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
