/* plan.js: plan.json as a script, written by plan/scripts/embed.js beside the board for its live view (plan/RULES.md §1). Do not edit: edit plan.json and re-embed. */
window.dashboardLive&&window.dashboardLive("plan",
{
  "schema": "plan-board/1",
  "repo": "SpartanLaboratories/OrganizationPage",
  "issue": 7,
  "slug": "7-dokka-and-project-site",
  "folder": "docs/plans/7-dokka-and-project-site",
  "kind": "issue",
  "title": "Dokka and project site",
  "issueTitle": "Adopt the organization's Dokka and project site standard",
  "function": "The repository's Kotlin modules have no generated API reference, and it keeps no logo or Dokka stylesheet where the organization's standard keeps them. This issue brings the repository in line with that API documentation and project site standard: the Spartan Laboratories logo and a Dokka stylesheet, kept under `docs/brand/` and `docs/dokka/`; an API reference generated with Dokka 2 and mounted at `/docs/api/`, because the server already uses `/api` for its JSON API; a CI job that runs the Dokka task; and, where the repository is a library, the Dokka output shipped as its javadoc jar.",
  "status": "building",
  "sized": "2026-11-09T02:35:42Z",
  "parent": null,
  "fixOf": null,
  "branch": "feat/issue-7-dokka-and-project-site",
  "baseline": {
    "ref": "main",
    "sha": "028231e",
    "date": "2026-11-08"
  },
  "asBuilt": null,
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
    },
    {
      "slug": "deployment",
      "name": "deployment",
      "slot": 4,
      "top": "deployment",
      "status": "built",
      "board": null
    }
  ],
  "wip": {
    "step": "document",
    "since": "2026-11-09T07:02:51Z",
    "updated": "2026-11-09T07:02:51Z",
    "detail": "The owner viewed staging at 16faca3 and found it good.",
    "steps": [
      "sizing",
      "interview",
      "research",
      "plan",
      "branch",
      "implementation",
      "qa",
      "remediation",
      "document",
      "landing",
      "merge",
      "landed"
    ],
    "current": [
      "built"
    ],
    "questions": [],
    "research": null,
    "interview": [],
    "plan": {
      "state": "re-pass",
      "from": "qa",
      "pass": 1,
      "since": "2026-11-09T04:45:29Z"
    },
    "stages": [
      {
        "id": "reference-and-branding",
        "name": "API reference, branding and deploy wiring",
        "state": "done",
        "rows": [
          "dokka-generation",
          "api-reference-mount",
          "dokka-ci-job",
          "branding",
          "docs-path-filter",
          "readme-and-docs-index"
        ]
      }
    ],
    "remediation": {
      "pass": 2,
      "route": "on-the-spot"
    },
    "open": [
      {
        "text": "The workflow lint check has not been run on ci.yml and deploy-spaceship.yml.",
        "raised": "implementation-stage reference-and-branding",
        "resolved": "2026-11-09T04:36:14Z"
      }
    ],
    "event": {
      "name": "resumed",
      "at": "2026-11-09T07:02:51Z"
    },
    "history": {
      "sizing": [
        {
          "since": null,
          "ended": "2026-11-09T02:35:42Z",
          "endedBy": "sized",
          "to": "plan"
        }
      ],
      "plan": [
        {
          "since": "2026-11-09T02:35:42Z",
          "ended": "2026-11-09T02:47:14Z",
          "endedBy": "halted",
          "to": "plan",
          "event": {
            "name": "sized",
            "at": "2026-11-09T02:35:42Z"
          },
          "detail": "Adopt the organization's API documentation and project site standard; next is the plan.",
          "plan": {
            "state": "writing",
            "since": "2026-11-09T02:35:42Z"
          },
          "held": true,
          "asked": [
            {
              "text": "Where is the API reference served, and how does it get there?",
              "options": [
                "/docs/api/ at the site root, inside the existing site artifact",
                "The same URL, as a second gated artifact",
                "/OrganizationPage/docs/api/ in the documents folder, with its own gated upload"
              ],
              "answer": null,
              "asked": "2026-11-09T02:47:14Z",
              "answered": "2026-11-09T03:14:03Z"
            },
            {
              "text": "Should the Ktor-served full-stack form also serve the reference at /docs/api/?",
              "options": [
                "Yes, packaged into the web distribution",
                "No, copied into the artifact by the deploy workflow"
              ],
              "answer": null,
              "asked": "2026-11-09T02:47:14Z",
              "answered": "2026-11-09T03:14:03Z"
            },
            {
              "text": "Do the standard's GitHub Pages and website/ items count as satisfied by the Spaceship site, and what is the landing page?",
              "options": [
                "Satisfied; the Compose page is the landing page and links to the reference",
                "Satisfied, with no link on the page",
                "Add a hand-written website/ landing page"
              ],
              "answer": null,
              "asked": "2026-11-09T02:47:14Z",
              "answered": "2026-11-09T03:14:03Z"
            },
            {
              "text": "Where does the Spartan Laboratories logo come from?",
              "options": [
                "Copy docs/brand/spartan-laboratories-logo.png from MyGameTools",
                "The maintainer supplies a different file",
                "Use favicon.svg"
              ],
              "answer": null,
              "asked": "2026-11-09T02:47:14Z",
              "answered": "2026-11-09T03:14:03Z"
            },
            {
              "text": "How far does the branding reach, and whose palette does the stylesheet use?",
              "options": [
                "Dokka pages only",
                "The Compose site too",
                "This site's navy and amber",
                "The logo's navy, bronze and crimson"
              ],
              "answer": null,
              "asked": "2026-11-09T02:47:14Z",
              "answered": "2026-11-09T03:14:03Z"
            },
            {
              "text": "Is writing missing KDoc in scope?",
              "options": [
                "Standard only; record the 93 undocumented declarations as a follow-up",
                "Write the 93 comments and leave reporting off",
                "Write them and turn reportUndocumented on"
              ],
              "answer": null,
              "asked": "2026-11-09T02:47:14Z",
              "answered": "2026-11-09T03:14:03Z"
            }
          ]
        },
        {
          "since": "2026-11-09T03:14:03Z",
          "ended": "2026-11-09T03:20:53Z",
          "endedBy": "research-planning",
          "to": "research",
          "event": {
            "name": "resumed",
            "at": "2026-11-09T03:14:03Z"
          },
          "detail": "Answered: reference at /docs/api/ inside the site artifact and packaged into the web distribution; the Compose page is the landing page and links to it; logo copied from MyGameTools and also used on the Compose site; stylesheet in the site's navy and amber; missing KDoc recorded as a follow-up.",
          "plan": {
            "state": "writing",
            "since": "2026-11-09T02:35:42Z"
          }
        },
        {
          "since": "2026-11-09T03:53:35Z",
          "ended": "2026-11-09T04:09:54Z",
          "endedBy": "halted",
          "to": "plan",
          "event": {
            "name": "researched",
            "at": "2026-11-09T03:53:35Z"
          },
          "detail": "Research verified; the plan next.",
          "plan": {
            "state": "writing",
            "since": "2026-11-09T02:35:42Z"
          },
          "held": true,
          "asked": [
            {
              "text": "The change touches shared, server, web and deployment in the system registry. Build it as one change, or split it?",
              "options": [
                "Build as one change",
                "Split into separately planned units"
              ],
              "answer": null,
              "asked": "2026-11-09T04:09:54Z",
              "answered": "2026-11-09T04:11:04Z"
            }
          ]
        },
        {
          "since": "2026-11-09T04:11:04Z",
          "ended": "2026-11-09T04:11:04Z",
          "endedBy": "plan-accepted",
          "to": "branch",
          "event": {
            "name": "resumed",
            "at": "2026-11-09T04:11:04Z"
          },
          "detail": "Decided: built as one change.",
          "plan": {
            "state": "writing",
            "since": "2026-11-09T02:35:42Z"
          }
        }
      ],
      "research": [
        {
          "since": "2026-11-09T03:20:53Z",
          "ended": "2026-11-09T03:53:35Z",
          "endedBy": "researched",
          "to": "plan",
          "event": {
            "name": "verification-started",
            "at": "2026-11-09T03:48:00Z"
          },
          "detail": "Research: verifying 1 finding.",
          "research": {
            "phase": "complete",
            "drafted": 0,
            "since": {
              "planning": "2026-11-09T03:20:53Z",
              "research": "2026-11-09T03:21:22Z",
              "verification": "2026-11-09T03:48:00Z",
              "complete": "2026-11-09T03:53:35Z"
            }
          },
          "questions": [
            {
              "question": "deploy-trigger-paths",
              "rows": [],
              "findings": "research/deploy-trigger-paths.md",
              "state": "complete",
              "started": "2026-11-09T03:21:22Z",
              "returned": "2026-11-09T03:47:43Z"
            }
          ]
        }
      ],
      "branch": [
        {
          "since": "2026-11-09T04:11:04Z",
          "ended": "2026-11-09T04:11:04Z",
          "endedBy": "branch-cut",
          "to": "implementation",
          "event": {
            "name": "plan-accepted",
            "at": "2026-11-09T04:11:04Z"
          },
          "detail": "Plan accepted; the branch is cut next.",
          "branch": "feat/issue-7-dokka-and-project-site"
        }
      ],
      "implementation": [
        {
          "since": "2026-11-09T04:11:04Z",
          "ended": "2026-11-09T04:25:28Z",
          "endedBy": "halted",
          "to": "implementation",
          "event": {
            "name": "implementation-stage",
            "at": "2026-11-09T04:25:28Z",
            "note": "reference-and-branding reported done; Quality Review next"
          },
          "detail": "Built. One deviation: the new test class imports only what it uses.",
          "open": [
            {
              "text": "The workflow lint check has not been run on ci.yml and deploy-spaceship.yml.",
              "raised": "implementation-stage reference-and-branding"
            }
          ],
          "stages": [
            {
              "id": "reference-and-branding",
              "name": "API reference, branding and deploy wiring",
              "state": "done",
              "rows": [
                "dokka-generation",
                "api-reference-mount",
                "dokka-ci-job",
                "branding",
                "docs-path-filter",
                "readme-and-docs-index"
              ]
            }
          ],
          "held": true,
          "asked": [
            {
              "text": "How should the workflow lint check on the two changed workflow files be handled?",
              "options": [
                "The maintainer runs it locally",
                "Rely on the staged run to validate the workflows"
              ],
              "answer": null,
              "asked": "2026-11-09T04:25:28Z",
              "answered": "2026-11-09T04:36:14Z"
            }
          ]
        },
        {
          "since": "2026-11-09T04:36:14Z",
          "ended": "2026-11-09T04:36:14Z",
          "endedBy": "qa-pass",
          "to": "qa",
          "event": {
            "name": "resumed",
            "at": "2026-11-09T04:36:14Z"
          },
          "detail": "The workflow lint check was run by the maintainer and reported clean.",
          "stages": [
            {
              "id": "reference-and-branding",
              "name": "API reference, branding and deploy wiring",
              "state": "done",
              "rows": [
                "dokka-generation",
                "api-reference-mount",
                "dokka-ci-job",
                "branding",
                "docs-path-filter",
                "readme-and-docs-index"
              ]
            }
          ]
        }
      ],
      "qa": [
        {
          "since": "2026-11-09T04:36:14Z",
          "ended": "2026-11-09T04:45:29Z",
          "endedBy": "qa-pass",
          "to": "remediation",
          "event": {
            "name": "qa-pass",
            "at": "2026-11-09T04:36:14Z",
            "note": "Quality Review 1: running"
          },
          "detail": "Quality Review 1 running.",
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
            }
          ]
        },
        {
          "since": "2026-11-09T05:11:10Z",
          "ended": "2026-11-09T05:20:48Z",
          "endedBy": "qa-pass",
          "to": "remediation",
          "event": {
            "name": "qa-pass",
            "at": "2026-11-09T05:11:10Z",
            "note": "Quality Review 2: running"
          },
          "detail": "Quality Review 2 running.",
          "qa": [
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
              "route": "on-the-spot"
            }
          ]
        }
      ],
      "remediation": [
        {
          "since": "2026-11-09T04:45:29Z",
          "ended": "2026-11-09T05:11:10Z",
          "endedBy": "qa-pass",
          "to": "qa",
          "event": {
            "name": "implementation-stage",
            "at": "2026-11-09T05:11:10Z",
            "note": "reference-and-branding"
          },
          "detail": "Resolution: reference-and-branding.",
          "remediation": {
            "pass": 1,
            "route": "re-plan-then-remediation",
            "steps": [
              {
                "name": "Plan re-pass",
                "state": "done"
              },
              {
                "name": "Workflow regression tests and further reference tests",
                "state": "done"
              }
            ]
          },
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
            }
          ]
        },
        {
          "since": "2026-11-09T05:20:48Z",
          "ended": "2026-11-09T05:24:10Z",
          "endedBy": "document",
          "to": "document",
          "event": {
            "name": "qa-pass",
            "at": "2026-11-09T05:20:48Z",
            "note": "Quality Review 2: changes-requested"
          },
          "detail": "Quality Review 2: changes requested, 7 findings (7 minor; 3 test, 4 code); minor fixes on the spot, then the Document step with no additional review.",
          "remediation": {
            "pass": 2,
            "route": "on-the-spot"
          },
          "qa": [
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
              "route": "on-the-spot"
            }
          ]
        }
      ],
      "document": [
        {
          "since": "2026-11-09T05:24:10Z",
          "ended": "2026-11-09T05:26:11Z",
          "endedBy": "halted",
          "to": "document",
          "event": {
            "name": "document",
            "at": "2026-11-09T05:24:10Z",
            "note": "0 of 7 tasks done"
          },
          "detail": "Document: 0 of 7 tasks done; Documentation review current.",
          "document": {
            "tasks": [
              {
                "id": "documentation-review",
                "name": "Documentation review",
                "state": "current"
              },
              {
                "id": "reconcile-documentation",
                "name": "Reconcile documentation",
                "state": "todo"
              },
              {
                "id": "dokka-check",
                "name": "Dokka check",
                "state": "todo"
              },
              {
                "id": "reconcile-plan",
                "name": "Reconcile plan",
                "state": "todo"
              },
              {
                "id": "readme-changelog",
                "name": "README and CHANGELOG",
                "state": "todo"
              },
              {
                "id": "state-boards",
                "name": "State boards",
                "state": "todo"
              },
              {
                "id": "document-landing",
                "name": "Document commit",
                "state": "todo"
              }
            ]
          },
          "held": true,
          "asked": [
            {
              "text": "How should the untracked docs/plans/org-work-board/board.json and index.html be handled, now that main tracks them?",
              "answer": null,
              "asked": "2026-11-09T05:26:11Z",
              "answered": "2026-11-09T05:29:20Z"
            }
          ]
        },
        {
          "since": "2026-11-09T05:29:20Z",
          "ended": "2026-11-09T06:04:46Z",
          "endedBy": "halted",
          "to": "document",
          "event": {
            "name": "document",
            "at": "2026-11-09T06:01:07Z",
            "note": "7 of 7 tasks done"
          },
          "detail": "Document: 7 of 7 tasks done; every task done.",
          "document": {
            "tasks": [
              {
                "id": "documentation-review",
                "name": "Documentation review",
                "state": "done"
              },
              {
                "id": "reconcile-documentation",
                "name": "Reconcile documentation",
                "state": "done"
              },
              {
                "id": "dokka-check",
                "name": "Dokka check",
                "state": "done"
              },
              {
                "id": "reconcile-plan",
                "name": "Reconcile plan",
                "state": "done"
              },
              {
                "id": "readme-changelog",
                "name": "README and CHANGELOG",
                "state": "done"
              },
              {
                "id": "state-boards",
                "name": "State boards",
                "state": "done"
              },
              {
                "id": "document-landing",
                "name": "Document commit",
                "state": "done"
              }
            ]
          },
          "held": true,
          "asked": [
            {
              "text": "Stage the branch feat/issue-7-dokka-and-project-site for viewing?",
              "options": [
                "Stage it",
                "Hold"
              ],
              "answer": null,
              "asked": "2026-11-09T06:04:46Z",
              "answered": "2026-11-09T07:02:51Z"
            },
            {
              "text": "Does the staged site look right, and should the branch land?",
              "answer": null,
              "asked": "2026-11-09T06:19:18Z",
              "answered": "2026-11-09T07:02:51Z"
            }
          ]
        }
      ]
    },
    "next": null,
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
        "route": "on-the-spot"
      }
    ],
    "qaMax": 3,
    "waitingOn": null,
    "resume": null,
    "blockers": {
      "waitsOn": [],
      "blocks": []
    },
    "landing": null,
    "asked": [
      {
        "step": "plan",
        "text": "Where is the API reference served, and how does it get there?",
        "options": [
          "/docs/api/ at the site root, inside the existing site artifact",
          "The same URL, as a second gated artifact",
          "/OrganizationPage/docs/api/ in the documents folder, with its own gated upload"
        ],
        "answer": null,
        "asked": "2026-11-09T02:47:14Z",
        "answered": "2026-11-09T03:14:03Z"
      },
      {
        "step": "plan",
        "text": "Should the Ktor-served full-stack form also serve the reference at /docs/api/?",
        "options": [
          "Yes, packaged into the web distribution",
          "No, copied into the artifact by the deploy workflow"
        ],
        "answer": null,
        "asked": "2026-11-09T02:47:14Z",
        "answered": "2026-11-09T03:14:03Z"
      },
      {
        "step": "plan",
        "text": "Do the standard's GitHub Pages and website/ items count as satisfied by the Spaceship site, and what is the landing page?",
        "options": [
          "Satisfied; the Compose page is the landing page and links to the reference",
          "Satisfied, with no link on the page",
          "Add a hand-written website/ landing page"
        ],
        "answer": null,
        "asked": "2026-11-09T02:47:14Z",
        "answered": "2026-11-09T03:14:03Z"
      },
      {
        "step": "plan",
        "text": "Where does the Spartan Laboratories logo come from?",
        "options": [
          "Copy docs/brand/spartan-laboratories-logo.png from MyGameTools",
          "The maintainer supplies a different file",
          "Use favicon.svg"
        ],
        "answer": null,
        "asked": "2026-11-09T02:47:14Z",
        "answered": "2026-11-09T03:14:03Z"
      },
      {
        "step": "plan",
        "text": "How far does the branding reach, and whose palette does the stylesheet use?",
        "options": [
          "Dokka pages only",
          "The Compose site too",
          "This site's navy and amber",
          "The logo's navy, bronze and crimson"
        ],
        "answer": null,
        "asked": "2026-11-09T02:47:14Z",
        "answered": "2026-11-09T03:14:03Z"
      },
      {
        "step": "plan",
        "text": "Is writing missing KDoc in scope?",
        "options": [
          "Standard only; record the 93 undocumented declarations as a follow-up",
          "Write the 93 comments and leave reporting off",
          "Write them and turn reportUndocumented on"
        ],
        "answer": null,
        "asked": "2026-11-09T02:47:14Z",
        "answered": "2026-11-09T03:14:03Z"
      },
      {
        "step": "plan",
        "text": "The change touches shared, server, web and deployment in the system registry. Build it as one change, or split it?",
        "options": [
          "Build as one change",
          "Split into separately planned units"
        ],
        "answer": null,
        "asked": "2026-11-09T04:09:54Z",
        "answered": "2026-11-09T04:11:04Z"
      },
      {
        "step": "implementation",
        "text": "How should the workflow lint check on the two changed workflow files be handled?",
        "options": [
          "The maintainer runs it locally",
          "Rely on the staged run to validate the workflows"
        ],
        "answer": null,
        "asked": "2026-11-09T04:25:28Z",
        "answered": "2026-11-09T04:36:14Z"
      },
      {
        "step": "document",
        "text": "How should the untracked docs/plans/org-work-board/board.json and index.html be handled, now that main tracks them?",
        "answer": null,
        "asked": "2026-11-09T05:26:11Z",
        "answered": "2026-11-09T05:29:20Z"
      },
      {
        "step": "document",
        "text": "Stage the branch feat/issue-7-dokka-and-project-site for viewing?",
        "options": [
          "Stage it",
          "Hold"
        ],
        "answer": null,
        "asked": "2026-11-09T06:04:46Z",
        "answered": "2026-11-09T07:02:51Z"
      },
      {
        "step": "document",
        "text": "Does the staged site look right, and should the branch land?",
        "answer": null,
        "asked": "2026-11-09T06:19:18Z",
        "answered": "2026-11-09T07:02:51Z"
      }
    ],
    "waits": [
      {
        "step": "plan",
        "since": "2026-11-09T02:47:14Z",
        "ended": "2026-11-09T03:14:03Z",
        "by": "halted"
      },
      {
        "step": "plan",
        "since": "2026-11-09T04:09:54Z",
        "ended": "2026-11-09T04:11:04Z",
        "by": "halted"
      },
      {
        "step": "implementation",
        "since": "2026-11-09T04:25:28Z",
        "ended": "2026-11-09T04:36:14Z",
        "by": "halted"
      },
      {
        "step": "document",
        "since": "2026-11-09T05:26:11Z",
        "ended": "2026-11-09T05:29:20Z",
        "by": "halted"
      },
      {
        "step": "document",
        "since": "2026-11-09T06:04:46Z",
        "ended": "2026-11-09T07:02:51Z",
        "by": "halted"
      }
    ],
    "document": {
      "tasks": [
        {
          "id": "documentation-review",
          "name": "Documentation review",
          "state": "done"
        },
        {
          "id": "reconcile-documentation",
          "name": "Reconcile documentation",
          "state": "done"
        },
        {
          "id": "dokka-check",
          "name": "Dokka check",
          "state": "done"
        },
        {
          "id": "reconcile-plan",
          "name": "Reconcile plan",
          "state": "done"
        },
        {
          "id": "readme-changelog",
          "name": "README and CHANGELOG",
          "state": "done"
        },
        {
          "id": "state-boards",
          "name": "State boards",
          "state": "done"
        },
        {
          "id": "document-landing",
          "name": "Document commit",
          "state": "done"
        }
      ]
    }
  },
  "milestones": [
    {
      "column": "gap",
      "label": "Research",
      "date": "2026-11-09",
      "ref": "research/README.md",
      "note": "one question and its findings file; all 15 load-bearing claims held at their sources"
    },
    {
      "column": "considered",
      "label": "Options weighed in the plan",
      "date": "2026-11-09",
      "ref": "plan.md",
      "note": "from its requirements, design and non-goals; no architecture document, as the work is one system"
    },
    {
      "column": "verdict",
      "label": "Plan accepted",
      "date": "2026-11-09",
      "ref": "plan.md",
      "note": "one implementation stage, reference-and-branding; no version moves"
    }
  ],
  "trail": [
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Sized; the plan starts"
    },
    {
      "date": "2026-11-09",
      "column": "verdict",
      "label": "Halted at the plan: waiting on you (The maintainer's answers to six design questions)"
    },
    {
      "date": "2026-11-09",
      "column": "verdict",
      "label": "Resumed at the plan"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research planning: 0 questions drafted"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research started: `deploy-trigger-paths`"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research returned: `deploy-trigger-paths`",
      "ref": "research/deploy-trigger-paths.md"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Verification started: 1 finding"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research verified; the plan next",
      "ref": "research/README.md"
    },
    {
      "date": "2026-11-09",
      "column": "verdict",
      "label": "Halted at the plan: waiting on you (The maintainer's decision on how the change is scoped, since it touches the web and deployment systems in the registry)"
    },
    {
      "date": "2026-11-09",
      "column": "verdict",
      "label": "Plan accepted",
      "ref": "plan.md"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Branch `feat/issue-7-dokka-and-project-site` cut; implementation starts at reference-and-branding"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Implementation done (1 stage); Quality Review next"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Halted at implementation: waiting on you (The maintainer's decision on how the workflow lint check gets run)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Resumed at implementation"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Open point resolved: The workflow lint check has not been run on ci.yml and deploy-spaceship.yml."
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 1: running"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 1: changes requested, 8 findings (7 minor, 1 other; 7 test, 1 code)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Resolution: reference-and-branding"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 2: running"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 2: changes requested, 7 findings (7 minor; 3 test, 4 code)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: Documentation review current"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Halted at the Document step: waiting on you (The maintainer's decision on the untracked docs/plans/org-work-board files, which block the sync with main)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Resumed at the Document step"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: Reconcile documentation current"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: Reconcile plan current"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: README and CHANGELOG current"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: State boards current"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: Document commit current"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: every task done"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Halted at the Document step: waiting on you (The maintainer's go-ahead to stage the branch and view it in a browser)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Halted at the Document step: waiting on you (The maintainer viewing the staged site in a browser)"
    }
  ],
  "rows": [
    {
      "id": "dokka-generation",
      "group": "Code",
      "name": "Dokka generation in the Gradle build",
      "system": "shared",
      "where": "`build.gradle.kts`, `gradle/libs.versions.toml` and each module's build file",
      "gap": {
        "kind": "missing",
        "summary": "No module generates API documentation. The version catalogue and the root build name no Dokka plugin, so the `shared`, `server` and `web` modules have no Dokka 2 publication and the root project has no aggregate of them.",
        "detail": "The standard asks for Dokka 2 in its V2 plugin mode and one aggregated publication at the root project, each module declared with `dokka(project(\":module\"))`. The root project already keeps the Kotlin plugins with `apply false`, which the standard requires so that the modules do not render empty. The build has no convention plugin for published modules.",
        "evidence": [
          "`gradle/libs.versions.toml:29-34` — the plugin catalogue lists the Kotlin, Compose compiler and Ktor plugins, and no Dokka",
          "`build.gradle.kts:1-7` — the root project applies no Dokka plugin and already holds the Kotlin plugins with `apply false`",
          "`settings.gradle.kts:21-25` — the three modules to document: `:shared`, `:server` and `:web`"
        ],
        "source": "#7; the organization's standard",
        "link": "https://github.com/SpartanLaboratories/.github/blob/main/documentation/dokka.md#generating-the-documentation"
      },
      "asBuilt": {
        "state": "amended",
        "statements": [
          {
            "text": "The root project applied Dokka `2.3.0` in V2 mode and aggregated `shared`, `server` and `web` with `dokka(project(\":module\"))`, the Kotlin plugins kept `apply false`.",
            "state": "as-planned"
          },
          {
            "text": "One `allprojects` hook, on the Dokka plugin, carries `failOnWarning`, the stylesheet, the logo asset and the footer into every Dokka configuration, the root and each module.",
            "state": "as-planned"
          },
          {
            "text": "Each of the three module build files applies the Dokka plugin; in `shared` and `server` that one line is the whole change to the build file, and nothing under `shared/src` or `server/src/main` changed.",
            "state": "as-planned"
          },
          {
            "text": "`reportUndocumented` stayed at its default, off, and no existing declaration gained KDoc; the comment on it in the root build file says many existing public declarations carry none yet.",
            "state": "amended",
            "ref": "final-implementation.md#deviations-from-the-plan",
            "excerpt": {
              "ref": "final-implementation.md#deviations-from-the-plan",
              "heading": "Deviations from the plan",
              "paragraph": "Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test differs from the plan.",
              "hash": "b696583bea02"
            }
          }
        ],
        "files": [
          "build.gradle.kts",
          "gradle/libs.versions.toml",
          "shared/build.gradle.kts",
          "server/build.gradle.kts",
          "web/build.gradle.kts"
        ],
        "changes": [
          {
            "what": "The comment on `reportUndocumented` in the root build file says many existing public declarations carry no KDoc yet, where plan section 7.1 gives a comment saying the existing declarations carry none.",
            "why": "Some existing public declarations do have KDoc, so the build's comment says many rather than all.",
            "when": "Document commit"
          }
        ]
      },
      "options": [
        {
          "id": "root-aggregate-with-hook",
          "name": "Dokka 2 in V2 mode, aggregated at the root, configured by one `allprojects` hook",
          "summary": "The root project applies Dokka and aggregates the three modules with `dokka(project(\":module\"))`. One hook configures what every Dokka configuration must carry, for the root and each module alike.",
          "verdict": "accepted",
          "why": "The root and each module get the same configuration and no module can forget it.",
          "source": "plan.md §6",
          "link": "plan.md#6-design"
        },
        {
          "id": "convention-plugin",
          "name": "A convention plugin or build-logic",
          "verdict": "declined",
          "why": "The build has none, and three modules take one shared `allprojects` hook.",
          "wins": "If the build grows past the one shared hook for Dokka's settings; recorded as a follow-up.",
          "source": "plan.md §4, §13",
          "link": "plan.md#4-non-goals"
        },
        {
          "id": "write-kdoc-and-report",
          "name": "Write the missing KDoc and turn `reportUndocumented` on",
          "verdict": "declined",
          "why": "Dokka lists 93 undocumented public declarations, and with `failOnWarning` on it would fail on each of them. No KDoc is written in this change and `reportUndocumented` stays off until they are done.",
          "wins": "As its own follow-up, once the 93 declarations are documented.",
          "source": "plan.md §1, §4; consequences.md, Follow-ups",
          "link": "consequences.md#follow-ups"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "The root project applies Dokka `2.3.0` in V2 mode and aggregates `shared`, `server` and `web` with `dokka(project(\":module\"))`, with the Kotlin plugins kept `apply false`.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The documentation build turns the KDoc of the three modules into one themed API reference and ships it inside the site; the site's header and favicon carry the organization's logo and the header links to the reference. The deployment system stages and ships it as part of the one `site` artifact.",
              "hash": "34366050a1e8"
            }
          },
          {
            "text": "One `allprojects` hook carries `failOnWarning`, the stylesheet, the logo asset and the footer into every Dokka configuration, the root and each module.",
            "ref": "plan.md#71-gradle",
            "excerpt": {
              "ref": "plan.md#71-gradle",
              "heading": "7.1 Gradle",
              "paragraph": "`gradle/libs.versions.toml` (changed). `[versions]` gains `dokka = \"2.3.0\"`; `[plugins]` gains `dokka = { id = \"org.jetbrains.dokka\", version.ref = \"dokka\" }`. Nothing else.",
              "hash": "c9a1faa9d80f"
            }
          },
          {
            "text": "Each of the three module build files applies the Dokka plugin; nothing else changes in `shared` or `server`.",
            "ref": "plan.md#71-gradle",
            "excerpt": {
              "ref": "plan.md#71-gradle",
              "heading": "7.1 Gradle",
              "paragraph": "`gradle/libs.versions.toml` (changed). `[versions]` gains `dokka = \"2.3.0\"`; `[plugins]` gains `dokka = { id = \"org.jetbrains.dokka\", version.ref = \"dokka\" }`. Nothing else.",
              "hash": "c9a1faa9d80f"
            }
          },
          {
            "text": "`reportUndocumented` stays off and no existing declaration gains KDoc.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "The Dokka reference for `shared`, `server` and `web` is served at `https://spartanlaboratories.org/docs/api/`, inside the existing `site` artifact. It is staged at `/staging/docs/api/`, waits for approval together with the rest of the site, and production receives the same artifact. Nothing is rebuilt for production. · Gradle packages the reference into the `web` distribution, so the server jar and the Docker image serve it at `/docs/api/` too. No workflow step copies it. · The Spaceship site satisfies the standard's site items: there is no `pages.yml`, no `website/` and no GitHub Pages. The …",
              "hash": "11637679954f"
            }
          }
        ],
        "defense": "One hook gives the root and each module the same configuration. The settings are read at configuration time, which was measured to be compatible with the configuration cache, and regenerating gives byte-identical output, so after the first upload the sync sends only what changed.",
        "steps": [
          {
            "id": "7.1",
            "what": "Add Dokka `2.3.0` to the version catalog, apply it at the root and in the three modules, aggregate the modules and add the shared hook.",
            "files": [
              "gradle/libs.versions.toml",
              "build.gradle.kts",
              "shared/build.gradle.kts",
              "server/build.gradle.kts",
              "web/build.gradle.kts"
            ],
            "check": "`./gradlew dokkaGeneratePublicationHtml` passes with no warning and a regeneration changes no file; a planted broken KDoc link fails it in each module",
            "link": "plan.md#71-gradle"
          }
        ],
        "tests": [
          "L1 gating: generation, byte-identical regeneration, and a planted broken link failing in each of the three modules, with a mutant that removes the `failOnWarning` line"
        ],
        "risks": [
          "A documentation warning now fails `build`, `check`, `:web:jsBrowserDistribution` and `:server:buildFatJar`, so the deploy and Docker builds too, and can block a deployment until fixed",
          "Dokka's generation adds to `build`, `check` and the Docker build, which runs cold and is the slowest case"
        ],
        "source": "plan.md §1, §6, §7.1, §9, §10",
        "link": "plan.md#71-gradle"
      }
    },
    {
      "id": "api-reference-mount",
      "group": "Code",
      "name": "The API reference at `/docs/api/`",
      "system": "server",
      "where": "the site artifact in `.github/workflows/deploy-spaceship.yml`",
      "gap": {
        "kind": "missing",
        "summary": "Nothing builds or serves an API reference at `/docs/api/`. The standard's default address, `/api/`, is taken by the server's JSON API, and the site artifact deployed to the host holds only the compiled web frontend.",
        "detail": "The standard puts the reference at `/docs/api/` where the site already uses `/api`. The `docs/` tree publishes under `/OrganizationPage/docs/`, a different address from `/docs/api/`. The site is hosted on Spaceship and the repository has no GitHub Pages site, so the standard's `pages.yml`, which it states for GitHub Pages, does not describe this repository's deployment.",
        "evidence": [
          "`shared/src/commonMain/kotlin/com/spartanlaboratories/shared/api/ApiRoutes.kt:5` — `BASE` is `/api`, the root of the JSON API",
          "`server/src/main/kotlin/com/spartanlaboratories/server/routes/Routing.kt:31-33` — every other path under `/api` answers with a 404",
          "`.github/workflows/deploy-spaceship.yml:67-68`, `:81-85` — the build runs `check :web:jsBrowserDistribution` and the `site` artifact is `web/build/dist/js/productionExecutable/` alone",
          "`.github/workflows/publish-docs.yml:24-25` — `docs/` publishes to `/OrganizationPage/docs/`"
        ],
        "source": "#7; the organization's standard",
        "link": "https://github.com/SpartanLaboratories/.github/blob/main/documentation/dokka.md#what-each-repository-has"
      },
      "asBuilt": {
        "state": "amended",
        "statements": [
          {
            "text": "The root exposes `build/dokka/html` as the consumable `apiReferenceElements` configuration and the `jsBrowserDistribution` sync places it under `docs/api`; no workflow step copies it.",
            "state": "as-planned"
          },
          {
            "text": "The reference is packaged at `docs/api/` inside the existing `site` artifact, for `/docs/api/` in production and `/staging/docs/api/` on staging; the production job is unchanged and receives the same artifact.",
            "state": "as-planned"
          },
          {
            "text": "The web distribution carries the reference into the server jar under `static/docs/api/`, for the jar and the Docker image to serve at `/docs/api/`, with no change under `server/src/main`.",
            "state": "as-planned"
          },
          {
            "text": "The `Mark as staging` step marks every page that has a `<head>`, leaves Dokka's `navigation.html` fragments as built, and fails when the artifact has no reference or its index has no `<head>` or `<title>`; `StagingMarkingTest` runs that step as committed over a fixture of the packaged site, in seven tests, and its support object `Bash` carries more KDoc than plan section 7.7 gives.",
            "state": "amended",
            "ref": "final-implementation.md#deviations-from-the-plan",
            "excerpt": {
              "ref": "final-implementation.md#deviations-from-the-plan",
              "heading": "Deviations from the plan",
              "paragraph": "Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test differs from the plan.",
              "hash": "b696583bea02"
            }
          },
          {
            "text": "`ApiReferenceServingTest` was added as the integration test for the packaging, twelve tests through the real module and web distribution in place of the six first planned.",
            "state": "amended",
            "ref": "final-implementation.md#what-was-built",
            "excerpt": {
              "ref": "final-implementation.md#what-was-built",
              "heading": "What was built",
              "paragraph": "The API reference. Dokka `2.3.0` in V2 mode, named in `gradle/libs.versions.toml`. The root build file applies it beside the Kotlin plugins, which stay `apply false`, and aggregates `shared`, `server` and `web`. One `allprojects` hook sets `failOnWarning`, the stylesheet, the logo and the footer for the root and every module that applies Dokka. `reportUndocumented` stays off, and no existing declaration gained KDoc. · Packaging. The root exposes `build/dokka/html` as a consumable `api-reference` configuration, and `web`'s `jsBrowserDistribution` places it at `docs/api/`. The `site` artifact, …",
              "hash": "630e965bdbe9"
            }
          }
        ],
        "changes": [
          {
            "what": "`ApiReferenceServingTest` holds twelve tests rather than six: the navigation fragment, a page under a `-` folder, a missing page, `/api/docs`, the home page's favicon link and the web bundle's logo and reference link were added.",
            "why": "The plan was re-passed after Quality Review 1 and names the twelve in its section 7.6.",
            "when": "Resolution, stage reference-and-branding"
          },
          {
            "what": "`StagingMarkingTest`, in a new test-only `workflow-checks` module that `./gradlew build` and `check` run, runs the committed `Mark as staging` step in bash over a fixture of the packaged site. `server` gained an `integrationTest` task, and `workflow-checks` a `gatingTest` and an `integrationTest` task.",
            "why": "The plan was re-passed after Quality Review 1 (its requirement 11 and section 7.7): the step enforces deployment rule 6, so it gets a committed test, in a module of its own because `server`'s tests need the whole web distribution on their classpath.",
            "when": "Resolution, stage reference-and-branding"
          },
          {
            "what": "`Bash`, which finds the bash that `StagingMarkingTest` runs the step with, carries more than plan section 7.7's content: KDoc on `executable` and a comment explaining the path it derives from `git --exec-path`.",
            "why": "These are the contracts a reader of the shared support needs.",
            "when": "Document commit"
          }
        ],
        "files": [
          "build.gradle.kts",
          "settings.gradle.kts",
          "web/build.gradle.kts",
          "server/build.gradle.kts",
          ".github/workflows/deploy-spaceship.yml",
          "server/src/test/kotlin/com/spartanlaboratories/testing/integration/server/ApiReferenceServingTest.kt",
          "workflow-checks/build.gradle.kts",
          "workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/integration/workflows/StagingMarkingTest.kt",
          "workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/support/workflows/Bash.kt",
          "workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/support/workflows/DeployWorkflow.kt"
        ]
      },
      "options": [
        {
          "id": "package-into-web-distribution",
          "name": "Package the reference into the `web` distribution at `docs/api/`",
          "summary": "The root exposes `build/dokka/html` as a consumable configuration and `web` places it under `docs/api` in `jsBrowserDistribution`, the same pattern `server` already uses for `web`'s distribution.",
          "verdict": "accepted",
          "why": "Every consumer of that distribution, the deploy build, `:server:processResources` and the Docker build, gets the reference with no extra step, inside the existing `site` artifact.",
          "source": "plan.md §1, §6",
          "link": "plan.md#6-design"
        },
        {
          "id": "workflow-copy-step",
          "name": "A workflow step that copies the reference into the artifact",
          "verdict": "declined",
          "why": "Gradle packages the reference, so the server jar and the Docker image serve it too, and the deploy workflow needs no copy step.",
          "source": "plan.md §1, §2",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "standard-default-address",
          "name": "The standard's default address, `/api/`",
          "verdict": "declined",
          "why": "The site already uses `/api` for its JSON API, so the reference is at `/docs/api/`.",
          "source": "consequences.md, Adoption",
          "link": "consequences.md#adoption"
        },
        {
          "id": "ktor-trailing-slash-redirect",
          "name": "A redirect for `/docs/api` on the Ktor server",
          "verdict": "declined",
          "why": "The Ktor form is not deployed today and the site's link carries the slash.",
          "wins": "A redirect there would close the broken relative links of the slash-less form; recorded as a follow-up.",
          "source": "plan.md §4, §10; consequences.md, Follow-ups",
          "link": "plan.md#10-risks--edge-cases"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "The root exposes `build/dokka/html` as the consumable `apiReferenceElements` configuration and the `jsBrowserDistribution` sync places it under `docs/api`; no workflow step copies it.",
            "ref": "plan.md#71-gradle",
            "excerpt": {
              "ref": "plan.md#71-gradle",
              "heading": "7.1 Gradle",
              "paragraph": "`gradle/libs.versions.toml` (changed). `[versions]` gains `dokka = \"2.3.0\"`; `[plugins]` gains `dokka = { id = \"org.jetbrains.dokka\", version.ref = \"dokka\" }`. Nothing else.",
              "hash": "c9a1faa9d80f"
            }
          },
          {
            "text": "The reference is served at `https://spartanlaboratories.org/docs/api/` inside the existing `site` artifact, staged at `/staging/docs/api/`, and production receives the same artifact.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "The Dokka reference for `shared`, `server` and `web` is served at `https://spartanlaboratories.org/docs/api/`, inside the existing `site` artifact. It is staged at `/staging/docs/api/`, waits for approval together with the rest of the site, and production receives the same artifact. Nothing is rebuilt for production. · Gradle packages the reference into the `web` distribution, so the server jar and the Docker image serve it at `/docs/api/` too. No workflow step copies it. · The Spaceship site satisfies the standard's site items: there is no `pages.yml`, no `website/` and no GitHub Pages. The …",
              "hash": "11637679954f"
            }
          },
          {
            "text": "The server jar and the Docker image serve it at `/docs/api/` through the web distribution, with no server source change.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The documentation build turns the KDoc of the three modules into one themed API reference and ships it inside the site; the site's header and favicon carry the organization's logo and the header links to the reference. The deployment system stages and ships it as part of the one `site` artifact.",
              "hash": "34366050a1e8"
            }
          },
          {
            "text": "The `Mark as staging` step marks every page that has a `<head>`, leaves Dokka's `navigation.html` fragments as built, and fails when the artifact has no reference.",
            "ref": "plan.md#75-workflows",
            "excerpt": {
              "ref": "plan.md#75-workflows",
              "heading": "7.5 Workflows",
              "paragraph": "`.github/workflows/ci.yml` (changed: one job added after `build`). Same runner, actions and style as `build`:",
              "hash": "f773524a25b5"
            }
          },
          {
            "text": "A new integration test, `ApiReferenceServingTest`, is the committed regression test for the packaging.",
            "ref": "plan.md#76-serversrctestkotlincomspartanlaboratoriestestingintegrationserverapireferenceservingtestkt-new",
            "excerpt": {
              "ref": "plan.md#76-serversrctestkotlincomspartanlaboratoriestestingintegrationserverapireferenceservingtestkt-new",
              "heading": "7.6 `server/src/test/kotlin/com/spartanlaboratories/testing/integration/server/ApiReferenceServingTest.kt` (new)",
              "paragraph": "Integration test (`testing.integration`). It runs the real module through Ktor's `testApplication` against the real packaged web distribution on the test classpath, like `ApplicationTest.servesWebFrontend`. No network, no GitHub, no live host.",
              "hash": "c1cd1fde61cc"
            }
          }
        ],
        "defense": "Because the reference is part of `web`'s distribution, nothing has to remember to carry it. Production never rebuilds and only runs after staging, so the artifact it receives is the one that passed the guard on the reference.",
        "steps": [
          {
            "id": "7.1",
            "what": "Expose the aggregate at the root and consume it in `web`, placing it under `docs/api` in the distribution.",
            "files": [
              "build.gradle.kts",
              "web/build.gradle.kts"
            ],
            "check": "`./gradlew :web:jsBrowserDistribution` holds 205 files with `docs/api/` present; `:server:buildFatJar` holds `static/docs/api/index.html`",
            "link": "plan.md#71-gradle"
          },
          {
            "id": "7.5",
            "what": "Rewrite the `Mark as staging` step to guard on the reference and mark every page.",
            "files": [
              ".github/workflows/deploy-spaceship.yml"
            ],
            "check": "the step's body run over the real distribution marks 141 pages and leaves the 4 fragments byte-identical; each failure case exits 1 with no file changed",
            "link": "plan.md#75-workflows"
          },
          {
            "id": "7.6",
            "what": "Add `ApiReferenceServingTest`, six tests through Ktor's `testApplication` against the packaged distribution.",
            "files": [
              "server/src/test/kotlin/com/spartanlaboratories/testing/integration/server/ApiReferenceServingTest.kt"
            ],
            "check": "`./gradlew :server:test`, with mutants that make each named test fail",
            "link": "plan.md#76-serversrctestkotlincomspartanlaboratoriestestingintegrationserverapireferenceservingtestkt-new"
          }
        ],
        "tests": [
          "L3 integration: `ApiReferenceServingTest`, the reference index, a module index and the theme stylesheet served from the packaged distribution",
          "L1 gating: the distribution's contents, the server jar, and the marking step run over the real distribution",
          "L5 UAT: manual, on the staged branch before landing and on production after it"
        ],
        "risks": [
          "The first upload sends about 200 files over FTPS for each of staging and production and is the run exposed to the FTP timeout",
          "Whether folders that start with `-` survive the FTP commands is unmeasured; staging is where it shows",
          "The marking depends on the `<head>` and `<title>` text; the guard on the reference's index catches the common break",
          "The artifact now has `docs/` at its root, so nothing else may be put under `/docs/` at the site root"
        ],
        "source": "plan.md §1, §6, §7.1, §7.5, §7.6, §9, §10",
        "link": "plan.md#6-design"
      }
    },
    {
      "id": "dokka-ci-job",
      "group": "Code",
      "name": "The Dokka job in CI",
      "system": "deployment",
      "where": "`.github/workflows/ci.yml`",
      "gap": {
        "kind": "missing",
        "summary": "CI runs no Dokka task. The `build` job runs `./gradlew build :server:buildFatJar` and no step generates the documentation, so a broken KDoc link can fail no build.",
        "detail": "The standard requires a CI job that runs `./gradlew dokkaGeneratePublicationHtml` on each build, and `failOnWarning` set in every Dokka configuration, the root aggregate and each module, because without it a broken KDoc link is only a warning and the build passes.",
        "evidence": [
          "`.github/workflows/ci.yml:33-34` — the build step runs `./gradlew build :server:buildFatJar`",
          "`.github/workflows/deploy-spaceship.yml:67-68` — the deployment's build runs `check :web:jsBrowserDistribution`, no Dokka task",
          "A search of the baseline's source, build and workflow files finds no mention of Dokka"
        ],
        "source": "#7; the organization's standard",
        "link": "https://github.com/SpartanLaboratories/.github/blob/main/documentation/dokka.md#continuous-integration"
      },
      "asBuilt": {
        "state": "as-planned",
        "statements": [
          {
            "text": "`ci.yml` gained a `docs` job, \"API docs (Dokka)\", that runs `./gradlew dokkaGeneratePublicationHtml`.",
            "state": "as-planned"
          },
          {
            "text": "The `build` job did not change.",
            "state": "as-planned"
          }
        ],
        "files": [
          ".github/workflows/ci.yml"
        ]
      },
      "options": [
        {
          "id": "dedicated-docs-job",
          "name": "A dedicated `docs` job in `ci.yml`",
          "summary": "A job named \"API docs (Dokka)\" runs `./gradlew dokkaGeneratePublicationHtml`, in parallel with `build` on the same runner, actions and style.",
          "verdict": "accepted",
          "why": "It is the named signal the standard asks for.",
          "source": "plan.md §7.5",
          "link": "plan.md#75-workflows"
        },
        {
          "id": "build-job-alone",
          "name": "Rely on the `build` job alone",
          "verdict": "declined",
          "why": "`build` now runs Dokka through the web distribution and also fails on a warning, but it gives no named signal.",
          "source": "plan.md §7.5, §10",
          "link": "plan.md#10-risks--edge-cases"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "`ci.yml` gains a `docs` job, \"API docs (Dokka)\", that runs `./gradlew dokkaGeneratePublicationHtml`.",
            "ref": "plan.md#75-workflows",
            "excerpt": {
              "ref": "plan.md#75-workflows",
              "heading": "7.5 Workflows",
              "paragraph": "`.github/workflows/ci.yml` (changed: one job added after `build`). Same runner, actions and style as `build`:",
              "hash": "f773524a25b5"
            }
          },
          {
            "text": "The `build` job does not change.",
            "ref": "plan.md#75-workflows",
            "excerpt": {
              "ref": "plan.md#75-workflows",
              "heading": "7.5 Workflows",
              "paragraph": "`.github/workflows/ci.yml` (changed: one job added after `build`). Same runner, actions and style as `build`:",
              "hash": "f773524a25b5"
            }
          }
        ],
        "defense": "The job fails when Dokka reports any warning. `ci.yml` does not run on `main`; there the deploy build generates the same reference, so every build runs the Dokka task.",
        "steps": [
          {
            "id": "7.5",
            "what": "Add the `docs` job after `build` in `ci.yml`.",
            "files": [
              ".github/workflows/ci.yml"
            ],
            "check": "`actionlint` reports nothing and a text assertion holds the job's name, runner, setup steps and single `run` line",
            "link": "plan.md#75-workflows"
          }
        ],
        "tests": [
          "L1 gating: `actionlint` and the text assertion on the `docs` job"
        ],
        "risks": [
          "The `docs` job duplicates the generation in parallel with `build`, for the sake of a named signal"
        ],
        "source": "plan.md §1, §7.5, §9, §10",
        "link": "plan.md#75-workflows"
      }
    },
    {
      "id": "branding",
      "group": "Code",
      "name": "Organization branding",
      "system": "web",
      "where": "`docs/brand/` and `docs/dokka/styles/`",
      "gap": {
        "kind": "missing",
        "summary": "The repository keeps no logo or Dokka stylesheet where the standard keeps them. `docs/` has no `brand/` and no `dokka/` folder, and the site's own marks are the letter \"S\" in its header and a drawn \"S\" as its favicon.",
        "detail": "The standard keeps the logo of the organization that owns the repository in `docs/brand/` and the Dokka stylesheet in `docs/dokka/styles/`, and in a multi-module build applies the theme in each module's Dokka configuration as well as at the root. The issue names the Spartan Laboratories logo.",
        "evidence": [
          "`docs/` at the baseline holds `DEPLOYMENT.md`, `index.html`, `dashboards/` and `plans/`",
          "`web/src/jsMain/kotlin/com/spartanlaboratories/web/components/Layout.kt:32-33` — the header's brand mark is the text \"S\"",
          "`web/src/jsMain/resources/favicon.svg:1-4` — the favicon is a path drawn in the file"
        ],
        "source": "#7; the organization's standard",
        "link": "https://github.com/SpartanLaboratories/.github/blob/main/documentation/dokka.md#branding"
      },
      "asBuilt": {
        "state": "amended",
        "statements": [
          {
            "text": "`docs/brand/spartan-laboratories-logo.png` is the blob the plan names from `SpartanLabsGaming/MyGameTools`, and is the single source for the Dokka pages, the header mark and the favicon.",
            "state": "as-planned"
          },
          {
            "text": "`docs/dokka/styles/dokka-styles.css` carries the theme in the site's own navy and amber, and its logo-glow comment says the glow is fully transparent by the box edge.",
            "state": "amended",
            "ref": "final-implementation.md#deviations-from-the-plan",
            "excerpt": {
              "ref": "final-implementation.md#deviations-from-the-plan",
              "heading": "Deviations from the plan",
              "paragraph": "Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test differs from the plan.",
              "hash": "b696583bea02"
            }
          },
          {
            "text": "The header's text mark became the logo image, a 48 px square with a cream glow behind it, and the comment in `AppStylesheet.kt` says the glow fades to transparent at the box edge; the web bundle's reference to the logo is under test.",
            "state": "amended",
            "ref": "final-implementation.md#deviations-from-the-plan",
            "excerpt": {
              "ref": "final-implementation.md#deviations-from-the-plan",
              "heading": "Deviations from the plan",
              "paragraph": "Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test differs from the plan.",
              "hash": "b696583bea02"
            }
          },
          {
            "text": "The header's navigation gained an `API docs` link with the relative `href` `docs/api/`; the web bundle's reference to it is under test.",
            "state": "amended"
          },
          {
            "text": "The favicon became the same PNG and `favicon.svg` was deleted; the home page's link to it is under test.",
            "state": "amended"
          }
        ],
        "files": [
          "docs/brand/spartan-laboratories-logo.png",
          "docs/dokka/styles/dokka-styles.css",
          "web/build.gradle.kts",
          "web/src/jsMain/kotlin/com/spartanlaboratories/web/components/Layout.kt",
          "web/src/jsMain/kotlin/com/spartanlaboratories/web/styles/AppStylesheet.kt",
          "web/src/jsMain/resources/index.html",
          "server/src/test/kotlin/com/spartanlaboratories/testing/integration/server/ApiReferenceServingTest.kt"
        ],
        "changes": [
          {
            "what": "Two integration tests were added to `ApiReferenceServingTest`: `homePageUsesTheLogoAsFavicon` holds the home page's favicon link, and `webBundleCarriesTheHeaderLogoAndTheReferenceLink` holds the header logo and the `API docs` link in the web bundle.",
            "why": "The plan was re-passed after Quality Review 1 and names them in its section 7.6.",
            "when": "Resolution, stage reference-and-branding"
          },
          {
            "what": "The logo-glow comments in `AppStylesheet.kt` and `dokka-styles.css` say the glow reaches transparent at the box edge, where plan sections 7.2 and 7.3 give comments saying it fades out before the box edge.",
            "why": "The gradient's last stop is `transparent 100%`, so it reaches transparent at the edge, and the comments now say that.",
            "when": "Document commit"
          }
        ]
      },
      "options": [
        {
          "id": "logo-and-site-palette",
          "name": "The MyGameTools logo and a stylesheet in the site's navy and amber, on the Dokka pages and the Compose site",
          "summary": "The logo is copied byte for byte and is the single source for the Dokka pages, the header mark and the favicon. The stylesheet keeps the structure of the WebTools theme and replaces every brand value with this site's palette.",
          "verdict": "accepted",
          "why": "Branding reaches both the Dokka pages and the Compose site, in the site's own colours.",
          "source": "plan.md §1, §7.3, §7.4",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "webtools-palette",
          "name": "The WebTools theme's navy and bronze",
          "verdict": "declined",
          "why": "The palette is the site's own navy and amber; every brand value of the adapted stylesheet is replaced, and the check on the stylesheet refuses the WebTools values.",
          "source": "plan.md §1, §7.3, §9",
          "link": "plan.md#73-docsdokkastylesdokka-stylescss-new"
        },
        {
          "id": "resized-logo-variants",
          "name": "Resized or special-purpose logo variants, a small favicon and an `apple-touch-icon`",
          "verdict": "declined",
          "why": "Outside this change: one image of 324 KB is the stated cost of not shipping resized variants.",
          "wins": "To cut the first load; recorded as a follow-up.",
          "source": "plan.md §4, §6, §10",
          "link": "plan.md#4-non-goals"
        },
        {
          "id": "computed-footer-year",
          "name": "A computed year in the Dokka footer",
          "verdict": "declined",
          "why": "A computed year would make the output differ from one year to the next and break the byte-identical regeneration the sync relies on.",
          "source": "plan.md §7.1",
          "link": "plan.md#71-gradle"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "`docs/brand/spartan-laboratories-logo.png` is copied byte for byte from `SpartanLabsGaming/MyGameTools` and is the single source for the Dokka pages, the header mark and the favicon.",
            "ref": "plan.md#74-docsbrandspartan-laboratories-logopng-new-binary",
            "excerpt": {
              "ref": "plan.md#74-docsbrandspartan-laboratories-logopng-new-binary",
              "heading": "7.4 `docs/brand/spartan-laboratories-logo.png` (new, binary)",
              "paragraph": "Copied byte for byte from `SpartanLabsGaming/MyGameTools` (`gh api repos/SpartanLabsGaming/MyGameTools/contents/docs/brand/spartan-laboratories-logo.png -H \"Accept: application/vnd.github.raw\"`). 324,247 bytes, 566 by 559 pixels, 8-bit RGBA, git blob `6b680404171c361cdbcda35e51a45a87776f5f74` (the same blob as `SpartanLaboratories/WebTools`' copy). It is the single source for the Dokka pages (`customAssets`), the header mark and the favicon (`jsProcessResources`).",
              "hash": "1b450d143ac4"
            }
          },
          {
            "text": "`docs/dokka/styles/dokka-styles.css` is adapted from the WebTools theme, with every brand value replaced by the site's palette.",
            "ref": "plan.md#73-docsdokkastylesdokka-stylescss-new",
            "excerpt": {
              "ref": "plan.md#73-docsdokkastylesdokka-stylescss-new",
              "heading": "7.3 `docs/dokka/styles/dokka-styles.css` (new)",
              "paragraph": "Adapted from `SpartanLaboratories/WebTools`' `docs/dokka/styles/dokka-styles.css` (246 lines, navy and bronze). The structure, the region comments, every selector and the `--dokka-logo-image-url` use stay; every brand value is replaced by this site's palette (`AppStylesheet.kt:5-13`: background `#0b1120`, surface `#111a2e`, border `#1f2a44`, text `#e2e8f0`, muted `#94a3b8`, accent `#f59e0b`, accent text `#1a1204`; `#fbbf24` is the hover). The navigation bar stays dark in both themes. Text that sits on a light background uses the darker amber `#b45309`, because `#f59e0b` on white is 2.05:1 and …",
              "hash": "7f25dbd4c06e"
            }
          },
          {
            "text": "The header's text mark becomes the logo image, a 48 px square with a cream glow behind it.",
            "ref": "plan.md#72-compose-site-and-resources",
            "excerpt": {
              "ref": "plan.md#72-compose-site-and-resources",
              "heading": "7.2 Compose site and resources",
              "paragraph": "`web/src/jsMain/resources/index.html` (changed). Line 9 becomes ` <link rel=\"icon\" href=\"spartan-laboratories-logo.png\" type=\"image/png\" />`. The relative `href` works at `/`, `/staging/` and from the server. `web/src/jsMain/resources/favicon.svg` is deleted; nothing else references it. The live production sync record lists it, so the next production deployment removes it from the host, as does staging's.",
              "hash": "f6bb3adce2ef"
            }
          },
          {
            "text": "The header's navigation gains a relative `API docs` link, which resolves at `/`, at `/staging/` and on the Ktor form.",
            "ref": "plan.md#72-compose-site-and-resources",
            "excerpt": {
              "ref": "plan.md#72-compose-site-and-resources",
              "heading": "7.2 Compose site and resources",
              "paragraph": "`web/src/jsMain/resources/index.html` (changed). Line 9 becomes ` <link rel=\"icon\" href=\"spartan-laboratories-logo.png\" type=\"image/png\" />`. The relative `href` works at `/`, `/staging/` and from the server. `web/src/jsMain/resources/favicon.svg` is deleted; nothing else references it. The live production sync record lists it, so the next production deployment removes it from the host, as does staging's.",
              "hash": "f6bb3adce2ef"
            }
          },
          {
            "text": "The favicon becomes the same PNG and `favicon.svg` is deleted.",
            "ref": "plan.md#72-compose-site-and-resources",
            "excerpt": {
              "ref": "plan.md#72-compose-site-and-resources",
              "heading": "7.2 Compose site and resources",
              "paragraph": "`web/src/jsMain/resources/index.html` (changed). Line 9 becomes ` <link rel=\"icon\" href=\"spartan-laboratories-logo.png\" type=\"image/png\" />`. The relative `href` works at `/`, `/staging/` and from the server. `web/src/jsMain/resources/favicon.svg` is deleted; nothing else references it. The live production sync record lists it, so the next production deployment removes it from the host, as does staging's.",
              "hash": "f6bb3adce2ef"
            }
          }
        ],
        "defense": "One file serves every use, so the Dokka theme, the header and the favicon cannot drift apart. The soft cream glow is there because the logo's navy lettering disappears on the navy header without it.",
        "steps": [
          {
            "id": "7.4",
            "what": "Copy the logo into `docs/brand/`.",
            "files": [
              "docs/brand/spartan-laboratories-logo.png"
            ],
            "check": "`git hash-object` prints the MyGameTools blob id and the file is 324,247 bytes",
            "link": "plan.md#74-docsbrandspartan-laboratories-logopng-new-binary"
          },
          {
            "id": "7.3",
            "what": "Add the Dokka stylesheet in the site's palette.",
            "files": [
              "docs/dokka/styles/dokka-styles.css"
            ],
            "check": "a script over the file holds every colour to the allowed set and refuses the WebTools values",
            "link": "plan.md#73-docsdokkastylesdokka-stylescss-new"
          },
          {
            "id": "7.2",
            "what": "Show the logo and the link in the header, and point the favicon at the PNG.",
            "files": [
              "web/src/jsMain/kotlin/com/spartanlaboratories/web/components/Layout.kt",
              "web/src/jsMain/kotlin/com/spartanlaboratories/web/styles/AppStylesheet.kt",
              "web/src/jsMain/resources/index.html",
              "web/src/jsMain/resources/favicon.svg"
            ],
            "check": "`:web:jsBrowserDistribution` compiles it, and the distribution holds the logo and no `favicon.svg`",
            "link": "plan.md#72-compose-site-and-resources"
          }
        ],
        "tests": [
          "L1 gating: the logo's blob id and size, and the script over the stylesheet's colours",
          "L3 integration: the logo served inside the reference and at the site root, and `favicon.svg` gone",
          "L5 UAT: the logo's legibility, the favicon, the palette and the narrow header, judged on staging"
        ],
        "risks": [
          "One PNG of 324 KB is both the header image and the favicon, a one-time cost on first load",
          "The logo's lettering needs the glow on the navy header and is not readable at favicon size; judged on staging",
          "Moving or deleting the logo or the stylesheet fails `dokkaGeneratePublicationHtml` and everything that builds the distribution"
        ],
        "source": "plan.md §1, §6, §7.2, §7.3, §7.4, §9, §10",
        "link": "plan.md#6-design"
      }
    },
    {
      "id": "docs-path-filter",
      "group": "Code",
      "name": "The site deployment's `docs/` filter",
      "system": "deployment",
      "where": "`.github/workflows/deploy-spaceship.yml`",
      "gap": {
        "kind": "risk",
        "summary": "The deployment's trigger has no documented way to start for `docs/brand/` or `docs/dokka/` alone. `deploy-spaceship.yml` ignores every push that changes only `docs/`, and GitHub documents negative patterns for `paths` only, so a change to the logo or the Dokka stylesheet alone would start no site deployment once the site build reads them.",
        "detail": "The workflow's own comment says to remove or narrow the filter if the site build ever reads `docs/`; those two folders are the only parts of `docs/` the site build reads. What the filter does elsewhere has to hold: a push that changes only other files under `docs/` starts no deployment, as `docs/DEPLOYMENT.md` promises, and a push that changes anything outside `docs/` still starts one, dot-named paths such as `.github/`, `.gitignore` and `.dockerignore` included. GitHub's text says nothing about names that start with a dot, the point an earlier finding left open; run history in two public repositories shows `'**'` matching a root dot-named file and a root dot-named folder, which is observed behaviour rather than a specification, and no source covers a dot-named file under `docs/`, where the repository tracks none. A manual run does not evaluate the filter, so only real pushes exercise it. Files under `docs/` also go live directly, with no staging and no approval, under rule 10 of the deployment policy.",
        "evidence": [
          "`.github/workflows/deploy-spaceship.yml:18-22` — the `paths-ignore` for `docs/**`, and the comment on when to change it",
          "`.github/workflows/publish-docs.yml:7-12` — a push to `main` that changes `docs/` publishes it",
          "`docs/DEPLOYMENT.md:31-35` — rule 10, the one exemption from staging and approval",
          "`docs/DEPLOYMENT.md:57-59` — the Triggers sentence: a push that changes only files under `docs/` does not start this workflow",
          "`research/deploy-trigger-paths.md` F2 — `paths-ignore` is documented with positive patterns only, and nothing says `!` is accepted there",
          "`research/deploy-trigger-paths.md` F3 — `'**'` matched root dot-named paths in the run history of two public repositories; GitHub's text is silent on dots",
          "`research/deploy-trigger-paths.md` F4 — path filters are defined under the push and pull-request events alone, so a manual run does not evaluate them"
        ],
        "source": "research/README.md",
        "link": "research/README.md#starting-the-site-deployment-for-docsbrand-and-docsdokka"
      },
      "asBuilt": {
        "state": "amended",
        "statements": [
          {
            "text": "`deploy-spaceship.yml` replaced its `paths-ignore` with the ordered `paths` list `'**'`, `'!docs/**'`, `'docs/brand/**'`, `'docs/dokka/**'`; `DeployPushFilterTest` holds those patterns and their order as a committed test, and its support object `DeployWorkflow` carries more KDoc than plan section 7.7 gives.",
            "state": "amended",
            "ref": "final-implementation.md#deviations-from-the-plan",
            "excerpt": {
              "ref": "final-implementation.md#deviations-from-the-plan",
              "heading": "Deviations from the plan",
              "paragraph": "Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test differs from the plan.",
              "hash": "b696583bea02"
            }
          },
          {
            "text": "By that list a push that changes only `docs/brand/` or `docs/dokka/` starts the site deployment beside the documents publish, and a push that changes only other `docs/` files does not start the deployment.",
            "state": "as-planned"
          },
          {
            "text": "Deployment rule 10 and its exemption were not touched, and the production job, its approval and the same-artifact upload are unchanged.",
            "state": "as-planned"
          }
        ],
        "files": [
          ".github/workflows/deploy-spaceship.yml",
          "workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/gating/workflows/DeployPushFilterTest.kt",
          "workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/support/workflows/DeployWorkflow.kt"
        ],
        "changes": [
          {
            "what": "`DeployPushFilterTest`, three tests in the new test-only `workflow-checks` module, holds the filter's four patterns in their order, the filter under the push event, and `paths-ignore` gone.",
            "why": "The plan was re-passed after Quality Review 1 (its requirement 11 and section 7.7): a mistake in the ordered filter leaves no run and no error, so it gets a committed test beside the text assertions the plan first named.",
            "when": "Resolution, stage reference-and-branding"
          },
          {
            "what": "`DeployWorkflow` carries more KDoc than plan section 7.7's content: `DeployWorkflow.lines` has its own KDoc, and `runBlockOf` names its parameter, its return and its failures, including that the search for a `run: |` block is not bounded by the step.",
            "why": "These are the contracts a reader of the shared support needs.",
            "when": "Document commit"
          }
        ]
      },
      "options": [
        {
          "id": "ordered-paths-list",
          "name": "An ordered `paths` list that puts the two folders back",
          "summary": "`'**'`, then `'!docs/**'`, then `'docs/brand/**'` and `'docs/dokka/**'`; the last pattern that matches a path decides.",
          "verdict": "accepted",
          "why": "A push changing only those two folders starts the site deployment, and a push changing only other `docs/` files still starts only the documents publish.",
          "source": "plan.md §6, §7.5",
          "link": "plan.md#6-design"
        },
        {
          "id": "keep-paths-ignore",
          "name": "Keep `paths-ignore: 'docs/**'`",
          "verdict": "declined",
          "why": "The build now reads two folders under `docs/`, so the filter has to change: without it the reference would not deploy on a stylesheet-only push.",
          "source": "plan.md §2, §6",
          "link": "plan.md#2-current-state"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "`deploy-spaceship.yml` replaces its `paths-ignore` with the ordered `paths` list `'**'`, `'!docs/**'`, `'docs/brand/**'`, `'docs/dokka/**'`.",
            "ref": "plan.md#75-workflows",
            "excerpt": {
              "ref": "plan.md#75-workflows",
              "heading": "7.5 Workflows",
              "paragraph": "`.github/workflows/ci.yml` (changed: one job added after `build`). Same runner, actions and style as `build`:",
              "hash": "f773524a25b5"
            }
          },
          {
            "text": "A push that changes only `docs/brand/` or `docs/dokka/` starts the site deployment and the documents publish; a push that changes only other `docs/` files starts only the documents publish.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The documentation build turns the KDoc of the three modules into one themed API reference and ships it inside the site; the site's header and favicon carry the organization's logo and the header links to the reference. The deployment system stages and ships it as part of the one `site` artifact.",
              "hash": "34366050a1e8"
            }
          },
          {
            "text": "Deployment rule 10's text and its exemption are not touched, and nothing about staging, approval, the same-artifact rule or fail-closed behaviour is weakened.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "The Dokka reference for `shared`, `server` and `web` is served at `https://spartanlaboratories.org/docs/api/`, inside the existing `site` artifact. It is staged at `/staging/docs/api/`, waits for approval together with the rest of the site, and production receives the same artifact. Nothing is rebuilt for production. · Gradle packages the reference into the `web` distribution, so the server jar and the Docker image serve it at `/docs/api/` too. No workflow step copies it. · The Spaceship site satisfies the standard's site items: there is no `pages.yml`, no `website/` and no GitHub Pages. The …",
              "hash": "11637679954f"
            }
          }
        ],
        "defense": "The two folders are the ones the site build now reads. The filter's failure direction is a missed run, which the workflow's comment and `docs/DEPLOYMENT.md` state, and the manual run is the fallback.",
        "steps": [
          {
            "id": "7.5",
            "what": "Replace the comment and the `paths-ignore` of `on.push` with the new comment and the ordered list.",
            "files": [
              ".github/workflows/deploy-spaceship.yml"
            ],
            "check": "text assertions hold the four patterns in order, no `paths-ignore`, and exactly two hunks in the file's diff; mutants that reorder or drop a pattern fail them",
            "link": "plan.md#75-workflows"
          }
        ],
        "tests": [
          "L1 gating: the text assertions on the push filter and the rest of the workflow, and `actionlint`",
          "L5 UAT: the filter observations on real pushes, which close on their own triggers because a manual run does not evaluate `paths`"
        ],
        "risks": [
          "The order is the filter: moving a re-include above `'!docs/**'` removes it silently",
          "A new site input under `docs/` that is not added to the list leaves a push touching only it undeployed until it is listed",
          "Three dot-name corners were inferred, not observed; none exists today",
          "A push touching the two folders puts the files live in the documents folder at once while the site waits for staging and approval"
        ],
        "source": "plan.md §1, §3, §6, §7.5, §9, §10",
        "link": "plan.md#75-workflows"
      }
    },
    {
      "id": "readme-and-docs-index",
      "group": "Documents",
      "name": "README, documents index and hosting reference",
      "system": "deployment",
      "where": "`README.md`, `docs/index.html` and `docs/DEPLOYMENT.md`",
      "gap": {
        "kind": "missing",
        "summary": "No document names an API reference, and the deployment reference describes all of `docs/` as one. The README's Documentation section lists the state boards and work boards alone, the documents landing page links those and the deployment reference, and the hosting table lists the site, staging and the documents. What the deployment reference says about a push under `docs/` holds only while the site build reads nothing there.",
        "evidence": [
          "`README.md:158-161` — the Documentation section: state boards and work boards",
          "`docs/index.html:16-21` — the links of the documents landing page",
          "`docs/DEPLOYMENT.md:123-127` — the hosting table",
          "`docs/DEPLOYMENT.md:57-59` — the Triggers sentence: a push that changes only files under `docs/` does not start the deployment",
          "`docs/DEPLOYMENT.md:89-90`, `:92-95` — a push that changes both runs both workflows, and a docs-only push shows no deployment run",
          "`research/deploy-trigger-paths.md` §5 — the fact that the site build reads these folders belongs where the next author of an input under `docs/` will look"
        ],
        "source": "#7; the organization's standard",
        "link": "https://github.com/SpartanLaboratories/.github/blob/main/documentation/dokka.md#what-each-repository-has",
        "detail": "The workflow's comment and the deployment reference are where the next author of a new input under `docs/` will look for the fact that the site build reads `docs/brand/` and `docs/dokka/`."
      },
      "asBuilt": {
        "state": "amended",
        "summary": null,
        "files": [
          "docs/DEPLOYMENT.md",
          "README.md",
          "CHANGELOG.md"
        ],
        "statements": [
          {
            "text": "`docs/DEPLOYMENT.md` moved with the implementation in the build, triggers, CI, documents workflow, shared folders, staging marking and operating sections, and its Staging marking section also names the home page's two failure guards.",
            "state": "amended",
            "ref": "final-implementation.md#deviations-from-the-plan",
            "excerpt": {
              "ref": "final-implementation.md#deviations-from-the-plan",
              "heading": "Deviations from the plan",
              "paragraph": "Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test differs from the plan.",
              "hash": "b696583bea02"
            }
          },
          {
            "text": "`README.md` and the `[Unreleased]` section of `CHANGELOG.md` were updated in the documentation pass with the changes plan section 7.10 gives; that pass's commit also carries the comment, KDoc and `docs/DEPLOYMENT.md` wording edits.",
            "state": "amended",
            "ref": "final-implementation.md#deviations-from-the-plan",
            "excerpt": {
              "ref": "final-implementation.md#deviations-from-the-plan",
              "heading": "Deviations from the plan",
              "paragraph": "Deviations 1 to 4 are comments and documentation wording only. No build logic, workflow step or test differs from the plan.",
              "hash": "b696583bea02"
            }
          },
          {
            "text": "`docs/index.html` did not change.",
            "state": "as-planned"
          }
        ],
        "changes": [
          {
            "what": "The failure sentence in `docs/DEPLOYMENT.md`'s Staging marking section also says the step fails if the home page has no `<head>` or `<title>`, beyond what plan section 7.8, item 6, gives.",
            "why": "The step does fail then: plan section 5 keeps those two guards.",
            "when": "Document commit"
          },
          {
            "what": "The comment, KDoc and `docs/DEPLOYMENT.md` wording edits recorded on this board's Rows ride in commit 2, where plan section 11 puts those files in commit 1 and has commit 2 carry only documents.",
            "why": "Commit 1 holds the behaviour; these edits change none.",
            "when": "Document commit"
          }
        ]
      },
      "options": [
        {
          "id": "update-readme-changelog-deployment",
          "name": "Update `docs/DEPLOYMENT.md`, `README.md` and `CHANGELOG.md`",
          "summary": "`docs/DEPLOYMENT.md` moves with the implementation; `README.md` and the `[Unreleased]` section of `CHANGELOG.md` follow in the documentation pass.",
          "verdict": "accepted",
          "why": "The change adds a task, a CI job, a module output and a deployment trigger.",
          "source": "plan.md §5, §7.8, §7.10",
          "link": "plan.md#8-documentation-impact"
        },
        {
          "id": "link-from-docs-index",
          "name": "A link from `docs/index.html` to the reference",
          "verdict": "declined",
          "why": "`docs/index.html` goes live ahead of a production approval, so the link would answer 404 for a while on any change that moves it.",
          "wins": "Recorded as a follow-up.",
          "source": "plan.md §4; consequences.md, Follow-ups",
          "link": "consequences.md#follow-ups"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "`docs/DEPLOYMENT.md` moves with the implementation: the build, triggers, CI, documents workflow, shared folders, staging marking and operating sections.",
            "ref": "plan.md#78-docsdeploymentmd-changed-in-commit-1",
            "excerpt": {
              "ref": "plan.md#78-docsdeploymentmd-changed-in-commit-1",
              "heading": "7.8 `docs/DEPLOYMENT.md` (changed, in commit 1)",
              "paragraph": "All wording hard-wrapped at the file's existing width (about 88 characters). Rule 10's text and the policy list stay as they are.",
              "hash": "48eeb4f9c8bd"
            }
          },
          {
            "text": "`README.md` and the `[Unreleased]` section of `CHANGELOG.md` are updated in the documentation pass.",
            "ref": "plan.md#710-documentation-pass-readmemd-and-changelogmd-commit-2",
            "excerpt": {
              "ref": "plan.md#710-documentation-pass-readmemd-and-changelogmd-commit-2",
              "heading": "7.10 Documentation pass: `README.md` and `CHANGELOG.md` (commit 2)",
              "paragraph": "`README.md`:",
              "hash": "6c5e7772da28"
            }
          },
          {
            "text": "`docs/index.html` does not change.",
            "ref": "plan.md#79-files-not-changed",
            "excerpt": {
              "ref": "plan.md#79-files-not-changed",
              "heading": "7.9 Files not changed",
              "paragraph": "`publish-docs.yml`, `.github/actions/spaceship-deploy/action.yml`, the `production` job and its approval gate, `Dockerfile`, `.dockerignore`, `CLAUDE.md` (rule 10 stays), `docs/index.html`, every file under `shared/src`, `server/src/main`, and the rest of `web/src`. The untracked `docs/plans/org-work-board/` and the generated board files belong to other work and stay out of commit 1.",
              "hash": "e07c41016409"
            }
          }
        ],
        "defense": "The deployment reference is where the next author of an input under `docs/` will look, so it says that the site build reads the two folders and what to do when another is added.",
        "steps": [
          {
            "id": "7.8",
            "what": "Reword the seven passages of `docs/DEPLOYMENT.md`, leaving rule 10 and the policy list as they are.",
            "files": [
              "docs/DEPLOYMENT.md"
            ],
            "link": "plan.md#78-docsdeploymentmd-changed-in-commit-1"
          },
          {
            "id": "7.10",
            "what": "Update the sections of `README.md` the change affects and add the `CHANGELOG.md` entries.",
            "files": [
              "README.md",
              "CHANGELOG.md"
            ],
            "link": "plan.md#710-documentation-pass-readmemd-and-changelogmd-commit-2"
          }
        ],
        "tests": [],
        "risks": [],
        "source": "plan.md §7.8, §7.10, §8",
        "link": "plan.md#8-documentation-impact"
      }
    },
    {
      "id": "landing-page",
      "group": "Left for later",
      "name": "The landing page's folder",
      "system": "web",
      "where": "`website/`",
      "gap": {
        "kind": "missing",
        "summary": "The repository has no `website/` folder. The standard keeps the hand-written landing page there, and this repository's landing page is the Compose HTML frontend in `web/`, built and deployed as the site.",
        "detail": "The standard requires a landing page of every repository, and the site has one. The issue's proposed change does not name a `website/` folder.",
        "evidence": [
          "The baseline's tree has no top-level `website/`",
          "`web/build.gradle.kts:40-42` — the static site from `jsBrowserDistribution` is what is uploaded to Spaceship",
          "`web/src/jsMain/resources/index.html:17`, `:24` — the page is the mount point of the Kotlin/JS bundle"
        ],
        "source": "#7; the organization's standard",
        "link": "https://github.com/SpartanLaboratories/.github/blob/main/documentation/dokka.md#the-site"
      },
      "asBuilt": {
        "state": "as-planned",
        "statements": [
          {
            "text": "No `website/` folder, `pages.yml` or GitHub Pages was added; the Compose page at `/` is the landing page, and its header links to the reference.",
            "state": "as-planned"
          }
        ]
      },
      "options": [
        {
          "id": "compose-page-is-landing",
          "name": "The Compose page at `/` is the landing page",
          "summary": "The Spaceship site satisfies the standard's site items.",
          "verdict": "accepted",
          "why": "The site is hosted on Spaceship, so `pages.yml` and `website/` do not apply.",
          "source": "plan.md §1; consequences.md, Adoption",
          "link": "consequences.md#adoption"
        },
        {
          "id": "website-folder",
          "name": "A `website/` folder, a `pages.yml` and GitHub Pages",
          "verdict": "declined",
          "why": "The standard states `pages.yml` for GitHub Pages sites, and the repository has none.",
          "source": "plan.md §2, §4",
          "link": "plan.md#4-non-goals"
        }
      ],
      "verdict": {
        "kind": "leave",
        "statements": [
          {
            "text": "No `website/` folder, `pages.yml` or GitHub Pages is added; the Compose page at `/` is the landing page.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "The Dokka reference for `shared`, `server` and `web` is served at `https://spartanlaboratories.org/docs/api/`, inside the existing `site` artifact. It is staged at `/staging/docs/api/`, waits for approval together with the rest of the site, and production receives the same artifact. Nothing is rebuilt for production. · Gradle packages the reference into the `web` distribution, so the server jar and the Docker image serve it at `/docs/api/` too. No workflow step copies it. · The Spaceship site satisfies the standard's site items: there is no `pages.yml`, no `website/` and no GitHub Pages. The …",
              "hash": "11637679954f"
            }
          }
        ],
        "defense": "The standard's landing page exists: it is the site. The link from it to the reference is built with the header, under the organization branding.",
        "source": "plan.md §1, §4",
        "link": "plan.md#4-non-goals"
      }
    },
    {
      "id": "javadoc-jar",
      "group": "Left for later",
      "name": "The Dokka javadoc jar",
      "system": "shared",
      "where": "the Gradle build's publishing",
      "gap": {
        "kind": "missing",
        "summary": "No module publishes a javadoc jar, because no module publishes anything. The standard requires a Dokka javadoc jar of every library and the issue asks for it where the repository is a library; the baseline's build applies no publishing plugin and its one packaged output is the server's fat jar.",
        "evidence": [
          "A search of the baseline's Gradle files and workflows finds no publishing or `maven-publish` configuration",
          "`shared/build.gradle.kts:1-4` — the shared module applies the Kotlin Multiplatform and serialization plugins alone",
          "`server/build.gradle.kts:16-20` — the fat jar `organization-page-server.jar`"
        ],
        "source": "#7; the organization's standard",
        "link": "https://github.com/SpartanLaboratories/.github/blob/main/documentation/dokka.md#the-javadoc-jar"
      },
      "asBuilt": {
        "state": "pending"
      },
      "options": [
        {
          "id": "no-javadoc-jar",
          "name": "No javadoc jar and no publishing plugin",
          "summary": "No module publishes, so nothing is bumped or released.",
          "verdict": "accepted",
          "why": "The standard's javadoc jar applies to libraries, and no module is published.",
          "source": "plan.md §1, §2; consequences.md, Adoption",
          "link": "consequences.md#adoption"
        },
        {
          "id": "publish-a-javadoc-jar",
          "name": "A Dokka javadoc jar",
          "verdict": "declined",
          "why": "There is nothing to attach it to: no module publishes.",
          "source": "plan.md §4",
          "link": "plan.md#4-non-goals"
        }
      ],
      "verdict": {
        "kind": "leave",
        "statements": [
          {
            "text": "No javadoc jar and no publishing plugin are added, and no version is bumped.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "The Dokka reference for `shared`, `server` and `web` is served at `https://spartanlaboratories.org/docs/api/`, inside the existing `site` artifact. It is staged at `/staging/docs/api/`, waits for approval together with the rest of the site, and production receives the same artifact. Nothing is rebuilt for production. · Gradle packages the reference into the `web` distribution, so the server jar and the Docker image serve it at `/docs/api/` too. No workflow step copies it. · The Spaceship site satisfies the standard's site items: there is no `pages.yml`, no `website/` and no GitHub Pages. The …",
              "hash": "11637679954f"
            }
          }
        ],
        "defense": "The issue asks for the jar where the repository is a library, and nothing in this repository is published.",
        "source": "plan.md §1, §4",
        "link": "plan.md#4-non-goals"
      }
    }
  ],
  "impact": {
    "basis": "plan",
    "summary": "The live site and staging gain the API reference at `/docs/api/`, and the server jar and the Docker image serve it too. No module publishes, so no artifact or version moves. The Gradle build now generates the reference, so a documentation warning fails it and can block a deployment, and a push that changes only `docs/brand/` or `docs/dokka/` now starts a site deployment.",
    "none": null,
    "release": {
      "bump": "none",
      "note": "no module publishes, so nothing is bumped or released and no javadoc jar is produced"
    },
    "downstream": [
      {
        "who": "The live site and staging",
        "kind": "artifact",
        "system": "deployment",
        "effect": "additive",
        "summary": "The live site gains `https://spartanlaboratories.org/docs/api/` and staging `https://spartanlaboratories.org/staging/docs/api/`. The `site` artifact grows from five files to about 205, about 5.4 MB.",
        "link": "consequences.md#published-artifacts"
      },
      {
        "who": "The server jar and the Docker image",
        "kind": "artifact",
        "system": "server",
        "effect": "additive",
        "summary": "Both carry the same files, so they serve the reference at `/docs/api/` as well. The server's source does not change; its tests now depend on the reference having been generated.",
        "link": "consequences.md#published-artifacts"
      },
      {
        "who": "`/favicon.svg` on each site",
        "kind": "artifact",
        "system": "web",
        "effect": "behaviour",
        "summary": "It disappears on the next deployment to each site, because each site's sync record lists it and the build no longer produces it. `/spartan-laboratories-logo.png` takes its place.",
        "link": "consequences.md#published-artifacts"
      },
      {
        "who": "The site's visitors",
        "kind": "consumer",
        "system": "web",
        "effect": "behaviour",
        "summary": "The header shows the logo in place of the text mark, the favicon is the same PNG, and the header gains an `API docs` link. The image is 324 KB, once on first load.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "The Gradle build",
        "kind": "system",
        "system": null,
        "effect": "behaviour",
        "summary": "`./gradlew build`, `check`, `:web:jsBrowserDistribution` and `:server:buildFatJar` now generate the API reference, so the deploy build and the Docker build do too. A documentation warning, such as a broken KDoc link, fails all of them and so can block a deployment. One module is added, `workflow-checks`, which holds only tests of the deployment workflows.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "The CI and deployment workflows",
        "kind": "system",
        "system": "deployment",
        "effect": "behaviour",
        "summary": "`ci.yml` gains a `docs` job. A push that changes only `docs/brand/` or `docs/dokka/` now starts a site deployment; a push touching only other files under `docs/` still starts none. The staging job marks every page and fails if the artifact has no reference. The production job, its approval gate, the shared deploy action and `publish-docs.yml` do not change. `workflow-checks` runs the staging marking step as committed and asserts the push filter's patterns and their order, so a change that breaks either fails CI and the deploy build; a reformat of the workflow file fails those tests until they are updated.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "The live host",
        "kind": "operator",
        "system": "deployment",
        "effect": "behaviour",
        "summary": "Production's sync record comes to own `/docs/` at the site root, so nothing else may be placed there by hand; it is a different folder from the documents folder at `/OrganizationPage/docs/`. The first upload to each site sends about 200 files, and later uploads only what changed.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "Other repositories",
        "kind": "repository",
        "system": null,
        "effect": "none",
        "summary": "None: no other repository consumes this repository's modules or workflows.",
        "link": "consequences.md#blast-radius"
      }
    ],
    "adaptation": [
      {
        "who": "Whoever moves the logo or the stylesheet",
        "system": null,
        "need": "required",
        "summary": "Moving either file fails the same tasks until the root build file is updated with it, so a move updates the root build file in the same change.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "Other repositories",
        "system": null,
        "need": "none",
        "summary": "Nothing to adopt: no other repository consumes this repository's modules or workflows.",
        "link": "consequences.md#blast-radius"
      }
    ],
    "api": [],
    "conversion": [],
    "changes": [],
    "source": "consequences.md",
    "link": "consequences.md#published-artifacts"
  },
  "tests": {
    "updated": "2026-11-09T05:20:48Z",
    "added": [
      {
        "class": "ApiReferenceServingTest",
        "module": "server",
        "testLevel": "3",
        "path": "server/src/test/kotlin/com/spartanlaboratories/testing/integration/server/ApiReferenceServingTest.kt",
        "tests": 12,
        "stage": "reference-and-branding",
        "result": {
          "state": "passed",
          "passed": 12,
          "failed": 0,
          "skipped": 0,
          "pass": 2,
          "at": "2026-11-09T05:20:48Z"
        }
      },
      {
        "class": "DeployPushFilterTest",
        "module": "workflow-checks",
        "testLevel": "1",
        "path": "workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/gating/workflows/DeployPushFilterTest.kt",
        "tests": 3,
        "stage": "reference-and-branding",
        "result": {
          "state": "passed",
          "passed": 3,
          "failed": 0,
          "skipped": 0,
          "pass": 2,
          "at": "2026-11-09T05:20:48Z"
        }
      },
      {
        "class": "StagingMarkingTest",
        "module": "workflow-checks",
        "testLevel": "3",
        "path": "workflow-checks/src/test/kotlin/com/spartanlaboratories/testing/integration/workflows/StagingMarkingTest.kt",
        "tests": 7,
        "stage": "reference-and-branding",
        "result": {
          "state": "passed",
          "passed": 7,
          "failed": 0,
          "skipped": 0,
          "pass": 2,
          "at": "2026-11-09T05:20:48Z"
        }
      }
    ],
    "amended": [],
    "relevant": [
      {
        "class": "ApplicationTest",
        "module": "server",
        "tests": 4,
        "result": {
          "state": "passed",
          "passed": 4,
          "failed": 0,
          "skipped": 0,
          "pass": 2,
          "at": "2026-11-09T05:20:48Z"
        }
      }
    ]
  },
  "roadmap": null,
  "followUps": [
    {
      "name": "KDoc for the undocumented public declarations",
      "note": "With undocumented reporting on, Dokka lists 93: 41 in `shared`, 44 in `web` and 8 in `server`. `reportUndocumented` stays off until they are done, or `failOnWarning` would fail on each of them."
    },
    {
      "name": "/docs/api without the trailing slash on the Ktor form",
      "note": "The server answers it with the same page, whose relative links then resolve one level up. The form is not deployed today and the site's link carries the slash; a redirect there would close it."
    },
    {
      "name": "Smaller logo variants",
      "note": "One 324 KB PNG serves the header and the favicon. A small favicon, an `apple-touch-icon` and a header-sized image would cut the first load."
    },
    {
      "name": "A link from docs/index.html to the reference",
      "note": "That page goes live ahead of a production approval, so the link would answer 404 for a while on any change that moves it."
    },
    {
      "name": "Dokka source links",
      "note": "A view-source link on each reference page."
    },
    {
      "name": "The footer year",
      "note": "The year in the Dokka theme is a literal and needs a manual edit each year."
    },
    {
      "name": "A convention plugin",
      "note": "If the build grows past the one shared hook for Dokka's settings."
    },
    {
      "name": "Moving ApplicationTest into a test-level package",
      "note": "So the existing server tests match the testing hierarchy the new integration test already follows."
    },
    {
      "name": "Observations on the live system",
      "note": "Recorded in a comment on the issue when they happen. The staged branch and production observations are part of acceptance; the two filter observations close on their own triggers, because a manual run does not evaluate the filter."
    },
    {
      "issue": 8,
      "note": "Publishing `docs/` to the live site. Its documents say that `/docs/` at the site root stays free; this change takes that path for the reference. Its `paths-ignore` filter is replaced by the ordered `paths` list, and its documents publish is unchanged."
    },
    {
      "issue": 9,
      "note": "The staging target check compares folder strings. This change edits a different step of the staging job and leaves that check as it is; neither issue blocks the other."
    },
    {
      "issue": 12,
      "note": "Local JS builds leave an untracked `kotlin-js-store/yarn.lock`. Whether it is committed or ignored is settled there; this change does not touch it."
    }
  ],
  "documents": [
    {
      "label": "plan.md",
      "path": "plan.md",
      "note": "the design, the file-by-file changes, the test plan and the risks"
    },
    {
      "label": "consequences.md",
      "path": "consequences.md",
      "note": "what the change does to its surroundings, and the follow-ups"
    },
    {
      "label": "final-implementation.md",
      "path": "final-implementation.md",
      "note": "the as-built record: every deviation from the plan"
    },
    {
      "label": "Research",
      "path": "research/README.md",
      "note": "the question on what starts the deployment, its verification and summary"
    }
  ],
  "notes": {
    "corrections": [
      {
        "what": "The sizing was recorded at 2026-11-08 23:00:00 UTC: the run sent the wrong time: the recorded start was before the run's own baseline merge. It is recorded at 2026-11-09 02:35:42 UTC; the run's start, the visits it bounds (plan, sizing) and its trail entry move with it.",
        "when": "2026-11-09",
        "retime": {
          "event": "sized",
          "from": "2026-11-08T23:00:00Z",
          "to": "2026-11-09T02:35:42Z"
        }
      },
      {
        "what": "The plan's section numbers moved when it was re-passed: `docs/DEPLOYMENT.md` is now section 7.8, the files not changed 7.9 and the documentation pass 7.10. The readme row's references, its two steps' numbers and its sources follow them; nothing else about the row changed.",
        "when": "2026-11-09"
      },
      {
        "what": "`api-reference-mount`'s As built Cell recorded a difference on `ApiReferenceServingTest`'s imports and referred to a section of the as-built record that no longer exists. Plan section 7.6, as re-passed, says the class imports what it uses, and the as-built record lists no such deviation, so that change and the clause on imports are gone and the statement refers to the record's What was built section.",
        "when": "2026-11-09"
      }
    ]
  },
  "links": {
    "workBoard": "../index.html",
    "repoBoard": "../../dashboards/index.html"
  },
  "issueBoards": {
    "8": "../8-docs-only-deploy-skip/dashboard.html"
  }
}
);
