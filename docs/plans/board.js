/* board.js: board.json as a script, written by plan/scripts/embed.js beside the board for its live view (plan/RULES.md §1). Do not edit: edit board.json and re-embed. */
window.dashboardLive&&window.dashboardLive("board",
{
  "schema": "work-board/1",
  "repo": "SpartanLaboratories/OrganizationPage",
  "generated": "2026-11-09T05:54:41Z",
  "asOf": "2026-11-09",
  "tree": {
    "ref": "feat/issue-7-dokka-and-project-site",
    "sha": "38477af"
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
      "slug": "web",
      "name": "web",
      "slot": 3,
      "top": "web",
      "status": "built",
      "board": null
    },
    {
      "slug": "documentation-build",
      "name": "documentation-build",
      "slot": 0,
      "top": "documentation-build"
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
      "state": "OPEN",
      "created": "2026-11-08",
      "parent": null,
      "waitsOn": [],
      "blocks": [],
      "board": "7-dokka-and-project-site/dashboard.html",
      "folder": "7-dokka-and-project-site/",
      "branch": "feat/issue-7-dokka-and-project-site",
      "system": "shared",
      "step": "document",
      "detail": "Document: 5 of 7 tasks done; State boards current.",
      "since": "2026-11-09T05:29:20Z",
      "updated": "2026-11-09T05:46:18Z",
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
      "status": "building",
      "fixOf": null,
      "landed": null,
      "reconciliation": {
        "state": "planned",
        "landed": null,
        "total": null
      },
      "active": true,
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
    }
  ],
  "roadmap": [],
  "unscheduled": [
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
    },
    {
      "issue": 7,
      "title": "Adopt the organization's Dokka and project site standard",
      "labels": [
        "type: feature"
      ],
      "created": "2026-11-08",
      "system": "documentation-build"
    }
  ]
}
);
