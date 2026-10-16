import unittest
import sys
from pathlib import Path
import tempfile
import importlib.util

# Load the module dynamically since it has dashes in its name
spec = importlib.util.spec_from_file_location(
    "validate_frontmatter",
    Path(__file__).parent / "validate-frontmatter.py"
)
vf = importlib.util.module_from_spec(spec)
sys.modules["validate_frontmatter"] = vf
spec.loader.exec_module(vf)

class TestValidateFrontmatter(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        # Monkeypatch ROOT for expected_keys
        self._orig_root = vf.ROOT
        vf.ROOT = self.root

    def tearDown(self):
        vf.ROOT = self._orig_root
        self.temp_dir.cleanup()

    def create_file(self, path_str, content):
        path = self.root / path_str
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return path

    def test_frontmatter_keys_valid(self):
        path = self.create_file("test.md", "---\ntitle: Foo\nnumber: 1\n---\nBody text.")
        keys = vf.frontmatter_keys(path)
        self.assertEqual(keys, {"title", "number"})

    def test_frontmatter_keys_empty(self):
        path = self.create_file("test.md", "---\n---\nBody text.")
        keys = vf.frontmatter_keys(path)
        self.assertEqual(keys, set())

    def test_frontmatter_keys_missing(self):
        path = self.create_file("test.md", "Body text only.")
        keys = vf.frontmatter_keys(path)
        self.assertIsNone(keys)

    def test_frontmatter_keys_unterminated(self):
        path = self.create_file("test.md", "---\ntitle: Foo\nBody text.")
        with self.assertRaises(ValueError) as cm:
            vf.frontmatter_keys(path)
        self.assertIn("unterminated frontmatter", str(cm.exception))

    def test_frontmatter_keys_not_mapping(self):
        path = self.create_file("test.md", "---\n- item1\n- item2\n---\nBody text.")
        with self.assertRaises(ValueError) as cm:
            vf.frontmatter_keys(path)
        self.assertIn("frontmatter is not a mapping", str(cm.exception))

    def test_expected_keys_chapters(self):
        path = self.root / "chapters" / "01.md"
        keys = vf.expected_keys(path)
        self.assertEqual(keys, {"title", "number", "pov", "status", "word-count"})

    def test_expected_keys_scenes(self):
        path = self.root / "scenes" / "scene-01.md"
        keys = vf.expected_keys(path)
        self.assertEqual(keys, {"title", "chapter", "scene", "pov", "status"})

    def test_expected_keys_nested(self):
        path = self.root / "worldbuilding" / "locations" / "city.md"
        keys = vf.expected_keys(path)
        self.assertEqual(keys, {"type", "name", "status"})

    def test_expected_keys_unrecognized(self):
        path = self.root / "random" / "file.md"
        keys = vf.expected_keys(path)
        self.assertIsNone(keys)

if __name__ == "__main__":
    unittest.main()
