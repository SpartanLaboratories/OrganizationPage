/* board.js: board.json as a script, written by plan/scripts/embed.js beside the board for its live view (plan/RULES.md §1). Do not edit: edit board.json and re-embed. */
window.dashboardLive&&window.dashboardLive("board",
{
  "schema": "work-board/1",
  "repo": "SpartanLaboratories/OrganizationPage",
  "generated": "2026-11-22T03:52:30Z",
  "asOf": "2026-11-22",
  "tree": {
    "ref": "fix/issue-9-staging-target-check",
    "sha": "aa05623"
  },
  "links": {
    "repoBoard": "../dashboards/index.html"
  },
  "systems": [
    {
      "slug": "shared",
      "name": "shared",
      "slot": 1,
      "top": "shared",
      "status": "built",
      "board": null
    },
    {
      "slug": "deployment",
      "name": "deployment",
      "slot": 4,
      "top": "deployment",
      "status": "built",
      "board": null
    },
    {
      "slug": "server",
      "name": "server",
      "slot": 2,
      "top": "server",
      "status": "built",
      "board": null
    },
    {
      "slug": "web",
      "name": "web",
      "slot": 3,
      "top": "web",
      "status": "built",
      "board": null
    }
  ],
  "groups": [
    {
      "key": "other",
      "issue": null,
      "title": "Other runs, oldest first",
      "board": null
    }
  ],
  "rows": [
    {
      "issue": 7,
      "title": "Adopt the organization's Dokka and project site standard",
      "state": "CLOSED",
      "stateReason": "COMPLETED",
      "created": "2026-11-08",
      "parent": null,
      "waitsOn": [],
      "blocks": [],
      "board": "7-dokka-and-project-site/dashboard.html",
      "folder": "7-dokka-and-project-site/",
      "branch": null,
      "system": "shared",
      "step": "landed",
      "detail": "Landed in PR #15.",
      "since": "2026-11-09T07:08:26Z",
      "updated": "2026-11-09T07:08:26Z",
      "qa": [
        {
          "pass": 1,
          "verdict": "changes-requested",
          "date": "2026-11-09",
          "at": "2026-11-09T04:45:29Z",
          "findings": {
            "test": 7,
            "code": 1
          },
          "severity": {
            "minor": 7,
            "other": 1
          },
          "route": "re-plan-then-remediation"
        },
        {
          "pass": 2,
          "verdict": "changes-requested",
          "date": "2026-11-09",
          "at": "2026-11-09T05:20:48Z",
          "findings": {
            "test": 3,
            "code": 4
          },
          "severity": {
            "minor": 7,
            "other": 0
          },
          "route": "on-the-spot",
          "inPlace": "fixed"
        }
      ],
      "qaMax": 3,
      "status": "landed",
      "fixOf": null,
      "landed": {
        "pr": 15,
        "merge": "6e50e5ac9f9d137d0886d20b9927cd1abbf490b4",
        "version": null,
        "date": "2026-11-09"
      },
      "reconciliation": {
        "state": "as-built",
        "landed": null,
        "total": null
      },
      "active": false,
      "systemName": "shared",
      "group": "other",
      "order": 0
    },
    {
      "issue": 8,
      "title": "Do not start a deployment for documentation-only pushes",
      "state": "CLOSED",
      "stateReason": "COMPLETED",
      "created": "2026-11-08",
      "parent": null,
      "waitsOn": [],
      "blocks": [],
      "board": "8-docs-only-deploy-skip/dashboard.html",
      "folder": "8-docs-only-deploy-skip/",
      "branch": null,
      "system": "deployment",
      "step": "landed",
      "detail": "Landed in PR #10.",
      "since": "2026-11-09T02:19:12Z",
      "updated": "2026-11-09T02:19:12Z",
      "qa": [
        {
          "pass": 1,
          "verdict": "changes-requested",
          "date": "2026-11-09",
          "at": "2026-11-09T01:02:04Z",
          "findings": {
            "test": 12,
            "code": 0
          },
          "severity": {
            "minor": 0,
            "other": 12
          },
          "route": "re-plan-then-remediation",
          "startUnrecorded": true
        },
        {
          "pass": 2,
          "verdict": "changes-requested",
          "date": "2026-11-09",
          "at": "2026-11-09T01:25:16Z",
          "findings": {
            "test": 6,
            "code": 2
          },
          "severity": {
            "minor": 7,
            "other": 1
          },
          "route": "re-plan-then-remediation"
        },
        {
          "pass": 3,
          "verdict": "changes-requested",
          "date": "2026-11-09",
          "at": "2026-11-09T01:47:04Z",
          "findings": {
            "test": 1,
            "code": 0
          },
          "severity": {
            "minor": 1,
            "other": 0
          },
          "route": "on-the-spot",
          "inPlace": "fixed"
        }
      ],
      "qaMax": 3,
      "status": "landed",
      "fixOf": null,
      "landed": {
        "pr": 10,
        "merge": "028231e0cda54082201008a54746e34f51c09bc8",
        "version": null,
        "date": "2026-11-09"
      },
      "reconciliation": {
        "state": "as-built",
        "landed": null,
        "total": null
      },
      "active": false,
      "systemName": "deployment",
      "group": "other",
      "order": 1
    },
    {
      "issue": 9,
      "title": "Staging target check compares folder strings, not resolved paths",
      "state": "OPEN",
      "created": "2026-11-09",
      "parent": null,
      "waitsOn": [],
      "blocks": [],
      "board": "9-staging-target-check/dashboard.html",
      "folder": "9-staging-target-check/",
      "branch": "fix/issue-9-staging-target-check",
      "system": "deployment",
      "step": "document",
      "detail": "Document: 5 of 7 tasks done; State boards current.",
      "since": "2026-11-22T03:16:41Z",
      "updated": "2026-11-22T03:46:14Z",
      "qa": [
        {
          "pass": 1,
          "verdict": "changes-requested",
          "date": "2026-11-22",
          "at": "2026-11-22T03:11:42Z",
          "findings": {
            "test": 1,
            "code": 0
          },
          "severity": {
            "minor": 1,
            "other": 0
          },
          "route": "on-the-spot",
          "report": "build/reports/tests/index.html",
          "reportCopy": "9-staging-target-check/ca070e8d/tests/index.html",
          "note": "One minor test finding: the changed step had a test in the integration tests but none in the gating tests. It was fixed on the spot with a gating class of three tests for the step. The code check found nothing, and every test of `workflow-checks` passed.",
          "inPlace": "fixed"
        }
      ],
      "qaMax": 3,
      "status": "building",
      "fixOf": null,
      "landed": null,
      "reconciliation": {
        "state": "partial",
        "landed": null,
        "total": null
      },
      "active": true,
      "systemName": "deployment",
      "group": "other",
      "order": 2
    }
  ],
  "roadmap": [],
  "unscheduled": [
    {
      "issue": 38,
      "title": "Documents publish resolves folders with realpath, unlike the deploy workflow's checks",
      "labels": [
        "type: bug"
      ],
      "created": "2026-11-22",
      "system": "deployment"
    },
    {
      "issue": 37,
      "title": "JVM tests run on JUnit 4, not JUnit 5",
      "labels": [],
      "created": "2026-11-22",
      "system": null
    },
    {
      "issue": 36,
      "title": "Staging target check accepts a staging folder that contains production or the documents folder",
      "labels": [
        "type: bug"
      ],
      "created": "2026-11-22",
      "system": "deployment"
    },
    {
      "issue": 35,
      "title": "Production target check compares folder strings, not resolved paths",
      "labels": [
        "type: bug"
      ],
      "created": "2026-11-22",
      "system": "deployment"
    },
    {
      "issue": 34,
      "title": "Group imports as the Commenting page sets out",
      "labels": [],
      "created": "2026-11-21",
      "system": null
    },
    {
      "issue": 33,
      "title": "Set a Java floor apart from the toolchain",
      "labels": [],
      "created": "2026-11-21",
      "system": null
    },
    {
      "issue": 32,
      "title": "Log the server's unhandled errors through kotlin-logging",
      "labels": [],
      "created": "2026-11-21",
      "system": "server"
    },
    {
      "issue": 14,
      "title": "Link the published boards from the site footer",
      "labels": [],
      "created": "2026-11-09",
      "system": "web"
    },
    {
      "issue": 13,
      "title": "Link other projects' API documentation from the project cards",
      "labels": [],
      "created": "2026-11-09",
      "system": null
    },
    {
      "issue": 12,
      "title": "Local JS builds leave an untracked kotlin-js-store/yarn.lock",
      "labels": [],
      "created": "2026-11-09",
      "system": "web"
    },
    {
      "issue": 9,
      "title": "Staging target check compares folder strings, not resolved paths",
      "labels": [
        "type: bug"
      ],
      "created": "2026-11-09",
      "system": "deployment"
    }
  ]
}
);
