import unittest
import tempfile
from pathlib import Path
from importlib.util import spec_from_file_location, module_from_spec

# Import the module with a dash in its name
script_path = Path(__file__).parent.parent / "scripts" / "validate-frontmatter.py"
spec = spec_from_file_location("validate_frontmatter", script_path)
vf = module_from_spec(spec)
spec.loader.exec_module(vf)

class TestFrontmatterKeys(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_no_frontmatter(self):
        p = self.temp_path / "test1.md"
        p.write_text("Hello\nworld\n", encoding="utf-8")
        self.assertIsNone(vf.frontmatter_keys(p))

    def test_short_file(self):
        p = self.temp_path / "test2.md"
        p.write_text("---\n", encoding="utf-8")
        self.assertIsNone(vf.frontmatter_keys(p))

    def test_valid_frontmatter(self):
        p = self.temp_path / "test3.md"
        p.write_text("---\ntitle: test\nstatus: draft\n---\nBody here", encoding="utf-8")
        self.assertEqual(vf.frontmatter_keys(p), {"title", "status"})

    def test_empty_frontmatter(self):
        p = self.temp_path / "test4.md"
        p.write_text("---\n---\nBody", encoding="utf-8")
        self.assertEqual(vf.frontmatter_keys(p), set())

    def test_unterminated_frontmatter(self):
        p = self.temp_path / "test5.md"
        p.write_text("---\ntitle: test\nBody", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "unterminated frontmatter"):
            vf.frontmatter_keys(p)

    def test_not_a_mapping(self):
        p = self.temp_path / "test6.md"
        p.write_text("---\n- item 1\n- item 2\n---\nBody", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "frontmatter is not a mapping"):
            vf.frontmatter_keys(p)

    def test_string_frontmatter(self):
        p = self.temp_path / "test7.md"
        p.write_text("---\njust a string\n---\nBody", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "frontmatter is not a mapping"):
            vf.frontmatter_keys(p)

if __name__ == '__main__':
    unittest.main()
