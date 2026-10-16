import sys
from pathlib import Path
import importlib.util

# Load the module dynamically because its name has a hyphen
scripts_dir = Path(__file__).parent.parent / "scripts"
spec = importlib.util.spec_from_file_location("validate_frontmatter", str(scripts_dir / "validate-frontmatter.py"))
validate_frontmatter = importlib.util.module_from_spec(spec)
sys.modules["validate_frontmatter"] = validate_frontmatter
spec.loader.exec_module(validate_frontmatter)

expected_keys = validate_frontmatter.expected_keys
REQUIRED = validate_frontmatter.REQUIRED
ROOT = validate_frontmatter.ROOT

def test_expected_keys_exact_match():
    # Test valid paths (exact prefix match)
    for prefix, expected_keys_set in REQUIRED.items():
        path = ROOT / prefix / "file.md"
        assert expected_keys(path) == expected_keys_set

def test_expected_keys_subdirectory_match():
    # Test valid paths (subdirectory match)
    for prefix, expected_keys_set in REQUIRED.items():
        path = ROOT / prefix / "subfolder" / "file.md"
        assert expected_keys(path) == expected_keys_set

        # Test deeper nested subdirectories
        path = ROOT / prefix / "subfolder" / "deep" / "file.md"
        assert expected_keys(path) == expected_keys_set

def test_expected_keys_no_match():
    # Test paths that should not match any prefix
    assert expected_keys(ROOT / "unrelated" / "file.md") is None
    assert expected_keys(ROOT / "scripts" / "file.py") is None

def test_expected_keys_root_file():
    # Test file at the root level
    assert expected_keys(ROOT / "file.md") is None

def test_expected_keys_partial_prefix_mismatch():
    # Test path that starts with a prefix but is not an exact match or subdirectory
    # For example, if 'chapters' is a prefix, 'chapters_extra' should not match
    for prefix in REQUIRED.keys():
        path = ROOT / f"{prefix}_extra" / "file.md"
        assert expected_keys(path) is None
