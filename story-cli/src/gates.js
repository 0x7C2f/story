import { applySeverity } from "./config.js";
import { EXIT_CODES } from "./exit-codes.js";
import { frontmatterSchemaCheck } from "./frontmatter-schema.js";
import { projectCheck } from "./report.js";
import { slopReport } from "./slop.js";
import { proseReport } from "./story.js";

// `story gates`: every gate the project runs, in one pass, in the order the
// gate script runs them. The frontmatter schema, then check over validate,
// links, and continuity with --strict (so a stale registry or word count
// fails here too), then the prose linter, then the AI slop guards. Slop is a
// report by default: with --strict the gate fails on blocking slop findings
// only (advisory tics cluster before they mean anything), so a story can
// clear its backlog without the gate staying red while it does.
export function gatesReport(root, options = {}) {
  const frontmatter = frontmatterSchemaCheck(root);
  const check = projectCheck(root, { overrides: options.overrides, strict: true });
  const prose = applySeverity(proseReport(root, options.prose ?? {}), options.overrides);
  const slop = applySeverity(slopReport(root, options.slop ?? {}), options.overrides);
  const proseFailed = prose.errors.length > 0 || prose.warnings.length > 0;
  const slopFound = slop.errors.length > 0 || slop.warnings.length > 0;
  const slopFailed = options.strict === true && (slop.errors.length > 0 || (slop.blocking ?? []).length > 0);
  return {
    ok: frontmatter.ok && check.ok && !proseFailed && !slopFailed,
    frontmatter,
    check,
    prose,
    slop,
    proseFailed,
    slopFound,
    slopFailed,
    strict: options.strict === true
  };
}

// The gates as text: one status line per gate, then the findings of the gates
// that failed, then the full slop report (it is a report either way).
export function formatGatesReport(report) {
  const line = (name, failed, detail) => `${name}: ${failed ? "FAIL" : "ok"} — ${detail}`;
  const lines = [
    line("frontmatter", !report.frontmatter.ok, `${report.frontmatter.checked} files checked, ${report.frontmatter.errors.length} errors`),
    line("check --strict", !report.check.ok, `${report.check.errors.length} errors, ${report.check.warnings.length} warnings, ${report.check.dismissed.length} dismissed`),
    line("prose", report.proseFailed, `${report.prose.errors.length} errors, ${report.prose.warnings.length} warnings, ${(report.prose.dismissed ?? []).length} dismissed`),
    line(`ai slop${report.strict ? " --strict" : " (report only)"}`, report.slopFailed, `${report.slop.blocking.length} blocking, ${report.slop.advisory.length} advisory findings in ${report.slop.files.length} files`)
  ];
  if (!report.frontmatter.ok) {
    for (const error of report.frontmatter.errors) {
      lines.push(`error: ${error.message}`);
    }
  }
  if (!report.check.ok) {
    for (const error of report.check.errors) {
      lines.push(`error: ${error.message}`);
    }
  }
  if (report.proseFailed) {
    for (const error of report.prose.errors) {
      lines.push(`error: ${error.message}`);
    }
    for (const warning of report.prose.warnings) {
      lines.push(`warning: ${warning.message}`);
    }
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

// The exit code: findings fail the gate, as every other check command fails.
export function gatesExitCode(report) {
  return report.ok ? EXIT_CODES.ok : EXIT_CODES.findings;
}
