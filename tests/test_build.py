import json
import unittest
from pathlib import Path
from src.build import build
ROOT=Path(__file__).resolve().parents[1]
class TestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result=build(json.loads((ROOT/'data/events.json').read_text()))
    def test_four_events(self):self.assertEqual(len(self.result['case']['changes']),4)
    def test_twelve_tasks(self):self.assertEqual(len(self.result['tasks']),12)
    def test_no_silent_verification(self):self.assertEqual(self.result['summary']['open_research_tasks'],1);self.assertEqual(self.result['summary']['partial_checks'],3)
    def test_two_official_sources_for_each_event(self):
        self.assertTrue(all(len(x['evidence'])==2 for x in self.result['case']['changes']))
    def test_historical_sources_linked(self):
        transitions=[t for t in self.result["tasks"] if t["kind"]=="transition" and t["status"]=="partial"]
        self.assertEqual(len(transitions),3)
        self.assertTrue(all("FDA-AUG30" in t["source_ids"] and "FDA-SEP20" in t["source_ids"] for t in transitions))
    def test_new_role_prioritized(self):
        tasks=sorted(self.result['tasks'],key=lambda x:x['rank_priority'])
        self.assertEqual(tasks[0]['person'],'Jared Seehafer')
    def test_scores_have_factors(self):
        for t in self.result['tasks']:
            self.assertEqual(t['score'],sum(t['score_factors'].values()))
    def test_fifo_vs_priority_distinct(self):
        self.assertTrue(any(t['rank_priority'] != t['rank_fifo'] for t in self.result['tasks']))
if __name__=='__main__': unittest.main()