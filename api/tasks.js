// Vercel Serverless Function — fetches live tasks from Asana API
// Requires ASANA_PAT environment variable set in Vercel project settings

const WORKSPACE_GID = '34125054317482';

// Known section mapping (gid → section name).
// Tasks not in this map default to "Recently assigned".
// Update this map whenever you move tasks between sections.
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

// Parse structured notes fields (Platform, Severity, CompanyName etc.)
function parseNotes(notes) {
  if (!notes) return {};
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

// Map severity tag or field → priority
function toPriority(sev, tags) {
  const all = [sev, ...tags].join(' ').toLowerCase();
  if (all.includes('x16') || all.includes('16')) return 'P0';
  if (all.includes('x8')  || all.includes('8'))  return 'P1';
  return 'P2';
}

// Fetch one page from Asana
async function fetchPage(pat, url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${pat}` }
  });
  if (!res.ok) throw new Error(`Asana API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// Fetch all incomplete tasks assigned to me (handles pagination)
async function fetchAllTasks(pat) {
  const fields = [
    'gid', 'name', 'due_on', 'modified_at', 'created_at',
    'followers', 'num_subtasks', 'notes', 'tags.name', 'assignee.name'
  ].join(',');

  const base = `https://app.asana.com/api/1.0/tasks`
    + `?assignee=me&workspace=${WORKSPACE_GID}`
    + `&completed_since=now&limit=100&opt_fields=${fields}`;

  let allTasks = [];
  let url = base;

  while (url) {
    const data = await fetchPage(pat, url);
    allTasks = allTasks.concat(data.data || []);
    url = data.next_page?.uri || null;
    // Safety cap: max 500 tasks
    if (allTasks.length >= 500) break;
  }

  return allTasks;
}

// Transform raw Asana task → dashboard format
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
    importance:    sev.replace(/\s*\(.*\)/, '').toLowerCase() || 'unknown',
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

export default async function handler(req, res) {
  // CORS headers so the Vite dev server can call this too
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const pat = process.env.ASANA_PAT;
  if (!pat) {
    return res.status(500).json({ error: 'ASANA_PAT environment variable is not set.' });
  }

  try {
    const raw   = await fetchAllTasks(pat);
    const tasks = raw.map(transform);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // cache 5 min on Vercel
    return res.status(200).json(tasks);
  } catch (err) {
    console.error('Asana fetch error:', err);
    return res.status(500).json({ error: err.message });
  }
}
