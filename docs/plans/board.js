/* board.js: board.json as a script, written by plan/scripts/embed.js beside the board for its live view (plan/RULES.md §1). Do not edit: edit board.json and re-embed. */
window.dashboardLive&&window.dashboardLive("board",
{
  "schema": "work-board/1",
  "repo": "SpartanLaboratories/OrganizationPage",
  "generated": "2026-11-09T02:10:18Z",
  "asOf": "2026-11-09",
  "tree": {
    "ref": "build/issue-8-no-deploy-docs-only",
    "sha": "dbfa430"
  },
  "links": {
    "repoBoard": "../dashboards/index.html"
  },
  "systems": [
    {
      "slug": "deployment",
      "name": "deployment",
      "slot": 4,
      "top": "deployment",
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
      "issue": 8,
      "title": "Do not start a deployment for documentation-only pushes",
      "state": "OPEN",
      "created": "2026-11-08",
      "parent": null,
      "waitsOn": [],
      "blocks": [],
      "board": "8-docs-only-deploy-skip/dashboard.html",
      "folder": "8-docs-only-deploy-skip/",
      "branch": "build/issue-8-no-deploy-docs-only",
      "system": "deployment",
      "step": "document",
      "detail": "Document: 4 of 6 tasks done; State boards current.",
      "since": "2026-11-09T01:47:05Z",
      "updated": "2026-11-09T02:02:15Z",
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
      "status": "building",
      "fixOf": null,
      "landed": null,
      "reconciliation": {
        "state": "planned",
        "landed": null,
        "total": null
      },
      "active": true,
      "systemName": "deployment",
      "group": "other",
      "order": 0
    }
  ],
  "roadmap": [],
  "unscheduled": [
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
      "issue": 8,
      "title": "Do not start a deployment for documentation-only pushes",
      "labels": [
        "type: feature"
      ],
      "created": "2026-11-08",
      "system": "deployment"
    },
    {
      "issue": 7,
      "title": "Adopt the organization's Dokka and project site standard",
      "labels": [
        "type: feature"
      ],
      "created": "2026-11-08",
      "system": null
    }
  ]
}
);
