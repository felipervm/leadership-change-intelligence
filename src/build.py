"""Generate a transparent, source-linked verification queue from official public evidence.

This is an illustrative workflow, not an audit of Leadership Connect records.
Scores are editorial heuristics; they are not trained or calibrated predictions.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data' / 'events.json'
OUT = ROOT / 'site' / 'case.json'

TASK_TYPES = [
    ('profile', 'Confirm person-to-role association', 4, 'confirmed', 'Both official sources name the appointee.'),
    ('hierarchy', 'Confirm organizational placement', 3, 'confirmed', 'Official FDA chart includes the role or center under the Commissioner.'),
    ('transition', 'Verify prior appointment status and effective-date window', 2, 'partial', 'The acting-to-permanent transition is documented for three leaders; the exact effective dates remain open. The fourth role was newly created.'),
]

def build(data):
    source_ids = {s['id'] for s in data['sources']}
    assert len(source_ids) == len(data['sources'])
    tasks = []
    for i, event in enumerate(data['changes']):
        assert all(src in source_ids for src in event['evidence'])
        assert len(event['evidence']) >= 2
        for kind, title, weight, status, reason in TASK_TYPES:
            # Hypothesis: new cross-agency technology office has greater topology impact.
            impact = 3 if 'cross_agency_scope' in event['risk_tags'] else 1
            source_gap = 2 if kind == 'transition' else 0
            score = weight + impact + source_gap + (1 if event['type']=='new_role' else 0)
            tasks.append({
                'id':f"{event['id']}-{kind.upper()}", 'event_id':event['id'],
                'kind':kind,'title':title,'person':event['person'],
                'status': ('needs_research' if kind=='transition' and event['type']=='new_role' else status),
                'why': (event['unresolved'] if kind=='transition' else reason),
                'research_note': (event['prior_status'] if kind=='transition' else ''),
                'score':score,'source_ids':(event['transition_evidence'] if kind=='transition' else event['evidence']),
                'score_factors':{'task_weight':weight,'impact_assumption':impact,'evidence_gap':source_gap,'new_role_flag':int(event['type']=='new_role')}
            })
    ranked=sorted(tasks,key=lambda x:(-x['score'],x['id']))
    fifo=tasks[:]  # chronological ingestion, then profile/hierarchy/transition per person
    rank_lookup={t['id']:i+1 for i,t in enumerate(ranked)}
    fifo_lookup={t['id']:i+1 for i,t in enumerate(fifo)}
    for t in tasks:
        t['rank_priority']=rank_lookup[t['id']]
        t['rank_fifo']=fifo_lookup[t['id']]
    return {
        'case':data,
        'tasks':tasks,
        'summary':{'official_sources':len(data['sources']), 'announced_selections':len(data['changes']),
                   'verification_tasks':len(tasks),'source_supported_checks':sum(t['status']=='confirmed' for t in tasks),
                   'open_research_tasks':sum(t['status']=='needs_research' for t in tasks),
                   'partial_checks':sum(t['status']=='partial' for t in tasks),
                   'documented_transition_patterns':sum(e['transition_status']=='acting_to_director_confirmed' for e in data['changes'])},
        'disclaimer':'Public-source exercise. No access to Leadership Connect data, no inferred defects, no verified internal ROI.',
        'method':'Scores are illustrative editorial priorities, not an empirically validated risk model.'
    }

def main():
    data=json.loads(DATA.read_text(encoding='utf-8'))
    result=build(data)
    OUT.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    page = ROOT / 'site' / 'index.html'
    html = page.read_text(encoding='utf-8')
    payload = json.dumps(result,ensure_ascii=False).replace('</', '<\\/')
    updated = re.sub(r'<script type="application/json" id="embedded-case">.*?</script>', lambda m: '<script type="application/json" id="embedded-case">'+payload+'</script>', html, count=1, flags=re.S)
    assert updated != html or payload in html, 'Embedded dataset placeholder missing'
    page.write_text(updated,encoding='utf-8')
    root_page = updated.replace('href="styles.css"', 'href="site/styles.css"').replace('src="app.js"', 'src="site/app.js"').replace('src="assets/', 'src="site/assets/')
    (ROOT / 'index.html').write_text(root_page,encoding='utf-8')
    print(json.dumps(result['summary'],indent=2))

if __name__=='__main__':main()