"""Cross-case schema validation for independently sourced public announcements."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def validate(fda, other):
    ids={s['id'] for s in fda['sources']}
    assert len(ids)==len(fda['sources'])
    for event in fda['changes']:
        assert set(event['evidence']).issubset(ids)
        assert set(event.get('transition_evidence',[])).issubset(ids)
    if 'reporting_manager' in fda:
        assert set(fda['reporting_manager']['evidence']).issubset(ids)
    other_id=other['source']['id']
    names=[x['person'] for x in other['new_members']]
    assert len(names)==len(set(names))
    assert all(x['evidence']==[other_id] for x in other['new_members'])
    assert sum(x['member_role']=='Chair' for x in other['new_members'])==1
    fda_changes={'acting_to_director':sum(x['transition_status']=='acting_to_director_confirmed' for x in fda['changes']),
                 'new_organizational_role':sum(x['type']=='new_role' for x in fda['changes'])}
    membership={'new_members_named':len(other['new_members']), 'named_chair':sum(x['member_role']=='Chair' for x in other['new_members'])}
    return {'source_documents':len(ids)+1,'fda':fda_changes,'task_force':membership,
            'appointments_total':len(fda['changes'])+len(other['new_members']),
            'effective_dates_verified':0,
            'external_validation_scope':'Schema and event-pattern generalization; not a statistical test of precision, recall, or workload savings.'}
def main():
    fda=json.loads((ROOT/'data/events.json').read_text())
    other=json.loads((ROOT/'data/external_validation.json').read_text())
    r=validate(fda,other)
    (ROOT/'site/cross_case.json').write_text(json.dumps(r,indent=2)+'\n')
    print(json.dumps(r,indent=2))
if __name__=='__main__':main()