"""Exercise the publishing pipeline, including both research payloads and Pages paths."""
import contextlib
import io
import json
import re
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from src import build as builder

ROOT = Path(__file__).resolve().parents[1]

class PresentationBuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix=".test-build-", dir=ROOT)
        self.root = Path(self.temp.name).resolve()
        assert self.root.is_relative_to(ROOT.resolve())
        self.addCleanup(self.temp.cleanup)
        (self.root / 'data').mkdir()
        (self.root / 'site').mkdir()
        for name in ('events.json', 'external_validation.json'):
            (self.root / 'data' / name).write_text((ROOT / 'data' / name).read_text(encoding='utf-8'),encoding='utf-8')
        (self.root / 'site' / 'index.html').write_text((ROOT / 'site' / 'index.html').read_text(encoding='utf-8'),encoding='utf-8')

    def run_build(self):
        with patch.multiple(builder, ROOT=self.root, DATA=self.root/'data/events.json', OUT=self.root/'site/case.json'), contextlib.redirect_stdout(io.StringIO()):
            builder.main()
        return (self.root / 'site/index.html').read_text(encoding='utf-8')

    def test_both_payloads_follow_source_changes_and_escape_script_boundaries(self):
        path=self.root/'data/external_validation.json'
        data=json.loads(path.read_text(encoding='utf-8'))
        data['note']='Test-only update </script> must stay inside JSON.'
        path.write_text(json.dumps(data),encoding='utf-8')
        html=self.run_build()
        embedded=re.search(r'id="embedded-comparison">(.*?)</script>',html,re.S).group(1)
        self.assertEqual(json.loads(embedded),data)
        self.assertNotIn('</script>',embedded)
        fda=re.search(r'id="embedded-case">(.*?)</script>',html,re.S).group(1)
        self.assertEqual(json.loads(fda),json.loads((self.root/'site/case.json').read_text(encoding='utf-8')))

    def test_root_entry_uses_site_assets_without_rewriting_external_links(self):
        html=self.run_build()
        expected=html.replace('href="styles.css','href="site/styles.css').replace('src="app.js','src="site/app.js').replace('src="assets/','src="site/assets/')
        root=(self.root/'index.html').read_text(encoding='utf-8')
        self.assertEqual(root,expected)
        self.assertIn('https://www.linkedin.com/in/felipervm/',root)
        self.assertIn('href="site/styles.css?v=',root)
        self.assertIn('src="site/app.js?v=',root)

    def test_repeat_build_is_idempotent_and_keeps_all_story_sections(self):
        first=self.run_build()
        self.assertEqual(first,self.run_build())
        self.assertEqual(len(re.findall(r'<section\b',first)),5)
        for section in ('signal','discovery','decision','evidence','takeaway'):
            self.assertIn('id="'+section+'"',first)

if __name__=='__main__':unittest.main()
