import json, unittest
from pathlib import Path
from src.cross_case import validate
P=Path(__file__).resolve().parents[1]
class CrossCaseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fda=json.loads((P/'data/events.json').read_text())
        cls.other=json.loads((P/'data/external_validation.json').read_text())
        cls.report=validate(cls.fda,cls.other)
    def test_second_case_has_eight_named_people(self):self.assertEqual(self.report['task_force']['new_members_named'],8)
    def test_chair_is_not_lost(self):self.assertEqual(self.report['task_force']['named_chair'],1)
    def test_transition_patterns_differ(self):self.assertEqual(self.report['fda']['acting_to_director'],3)
    def test_total_cases(self):self.assertEqual(self.report['appointments_total'],12)
    def test_no_fabricated_effective_dates(self):self.assertEqual(self.report['effective_dates_verified'],0)
    def test_source_ids_validate(self):self.assertTrue(validate(self.fda,self.other))
if __name__=='__main__':unittest.main()