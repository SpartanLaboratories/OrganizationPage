/* plan.js: plan.json as a script, written by plan/scripts/embed.js beside the board for its live view (plan/RULES.md §1). Do not edit: edit plan.json and re-embed. */
window.dashboardLive&&window.dashboardLive("plan",
{
  "schema": "plan-board/1",
  "repo": "SpartanLaboratories/OrganizationPage",
  "issue": 8,
  "slug": "8-docs-only-deploy-skip",
  "folder": "docs/plans/8-docs-only-deploy-skip",
  "kind": "issue",
  "title": "Docs only deploy skip",
  "issueTitle": "Do not start a deployment for documentation-only pushes",
  "function": "`deploy-spaceship.yml` runs on every push to `main`, so a push that changes only documentation starts a staging deployment and then waits on production approval, while nothing publishes the boards and documents kept under `docs/`. This change adds a `publish-docs.yml` workflow that publishes everything under `docs/` straight to `https://spartanlaboratories.org/OrganizationPage/docs/` on a push to `main`, with no staging and no approval, behind guards of its own, and makes the site deployment ignore a push that changes only `docs/`. `docs/` is the one exemption, stated in the deployment rules; every other change keeps the full staging-and-approval path, and a push that changes both runs both paths independently.",
  "status": "building",
  "sized": "2026-11-08T23:00:00Z",
  "parent": null,
  "fixOf": null,
  "branch": "build/issue-8-no-deploy-docs-only",
  "baseline": {
    "ref": "main",
    "sha": "21c23eb",
    "date": "2026-09-26"
  },
  "asBuilt": null,
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
  "wip": {
    "step": "document",
    "since": "2026-11-09T01:47:05Z",
    "updated": "2026-11-09T02:13:33Z",
    "detail": "Document: 6 of 6 tasks done; every task done.",
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
    "interview": [
      {
        "text": "Landing this change starts a real deployment. How should that run go?",
        "options": [
          "Land normally; production waits for review",
          "Stop before the merge until told",
          "Land without a deployment using a skip marker"
        ],
        "answer": "This change lands normally.",
        "asked": "2026-11-08T23:30:00Z",
        "answered": "2026-11-08T23:45:00Z"
      },
      {
        "text": "Should written rule 1 say that a docs-only push does not deploy?",
        "options": [
          "Add one sentence to the rule",
          "Leave the rules as written"
        ],
        "answer": "Yes, with a different sentence: docs/ is exempt from the staging and review rules, so that boards update live; docs/ changes publish directly to the live site.",
        "asked": "2026-11-08T23:30:00Z",
        "answered": "2026-11-08T23:45:00Z"
      },
      {
        "text": "Does documentation-only stop at docs/**, or include documentation at the repository root?",
        "options": [
          "docs/** only",
          "docs/** plus named root files",
          "docs/** plus all Markdown"
        ],
        "answer": "`docs/**` only.",
        "asked": "2026-11-08T23:30:00Z",
        "answered": "2026-11-08T23:45:00Z"
      },
      {
        "text": "Should the Triggers paragraph also correct its claim that a manual run on any branch deploys to staging only?",
        "options": [
          "Correct it",
          "Leave it and report it separately"
        ],
        "answer": "Correct it: the manual-run sentence in the deployment reference is corrected.",
        "asked": "2026-11-08T23:30:00Z",
        "answered": "2026-11-08T23:45:00Z"
      },
      {
        "text": "What goes live: all of docs/, or only boards?",
        "options": [
          "All of docs/, mirrored",
          "Generated boards only",
          "Only the org work board"
        ],
        "answer": "All of `docs/`, mirrored.",
        "asked": "2026-11-09T00:05:00Z",
        "answered": "2026-11-09T00:08:39Z"
      },
      {
        "text": "Where does it go?",
        "options": [
          "spartanlaboratories.org/docs/",
          "spartanlaboratories.org/boards/",
          "A subdomain"
        ],
        "answer": "At `https://spartanlaboratories.org/OrganizationPage/docs/`, inside the production folder; `/docs/` at the site root stays free.",
        "asked": "2026-11-09T00:05:00Z",
        "answered": "2026-11-09T00:08:39Z"
      },
      {
        "text": "How should a push behave when it changes docs/ and something else?",
        "options": [
          "Independent paths",
          "Hold docs/ until production is approved"
        ],
        "answer": "Both paths run independently: `docs/` goes live at once, the rest waits for staging and approval.",
        "asked": "2026-11-09T00:05:00Z",
        "answered": "2026-11-09T00:08:39Z"
      },
      {
        "text": "Should the unapproved publish job use the existing FTP account?",
        "options": [
          "Reuse it, with two target and file checks",
          "A dedicated account confined to the docs folder"
        ],
        "answer": "Reuse it, with two checks in the job: the target strictly inside production and not staging, and a refusal if `docs/` holds a file the host would execute.",
        "asked": "2026-11-09T00:05:00Z",
        "answered": "2026-11-09T00:08:39Z"
      }
    ],
    "plan": {
      "state": "re-pass",
      "from": "qa",
      "pass": 2,
      "since": "2026-11-09T01:25:16Z"
    },
    "stages": [
      {
        "id": "docs-publish",
        "name": "Docs publish workflow, site deploy filter and policy text",
        "state": "done",
        "rows": [
          "push-trigger",
          "boards-on-the-website",
          "publish-sync",
          "publish-target",
          "executable-refusal",
          "docs-landing-page",
          "workflow-checks",
          "policy-rules",
          "deployment-reference"
        ]
      }
    ],
    "remediation": {
      "pass": 3,
      "route": "on-the-spot"
    },
    "open": [],
    "event": {
      "name": "document",
      "at": "2026-11-09T02:13:33Z",
      "note": "6 of 6 tasks done"
    },
    "history": {
      "sizing": [
        {
          "since": null,
          "ended": "2026-11-08T23:00:00Z",
          "endedBy": "sized",
          "to": "interview"
        }
      ],
      "interview": [
        {
          "since": "2026-11-08T23:00:00Z",
          "ended": "2026-11-08T23:30:00Z",
          "endedBy": "halted",
          "to": "interview",
          "event": {
            "name": "sized",
            "at": "2026-11-08T23:00:00Z"
          },
          "detail": "Next step: planning, starting with the interview.",
          "interview": [
            {
              "text": "Landing this change starts a real deployment. How should that run go?",
              "options": [
                "Land normally; production waits for review",
                "Stop before the merge until told",
                "Land without a deployment using a skip marker"
              ],
              "answer": "This change lands normally.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            },
            {
              "text": "Should written rule 1 say that a docs-only push does not deploy?",
              "options": [
                "Add one sentence to the rule",
                "Leave the rules as written"
              ],
              "answer": "Yes, with a different sentence: docs/ is exempt from the staging and review rules, so that boards update live; docs/ changes publish directly to the live site.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            },
            {
              "text": "Does documentation-only stop at docs/**, or include documentation at the repository root?",
              "options": [
                "docs/** only",
                "docs/** plus named root files",
                "docs/** plus all Markdown"
              ],
              "answer": "`docs/**` only.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            },
            {
              "text": "Should the Triggers paragraph also correct its claim that a manual run on any branch deploys to staging only?",
              "options": [
                "Correct it",
                "Leave it and report it separately"
              ],
              "answer": "Correct it: the manual-run sentence in the deployment reference is corrected.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            }
          ],
          "held": true
        },
        {
          "since": "2026-11-08T23:45:00Z",
          "ended": "2026-11-09T00:05:00Z",
          "endedBy": "halted",
          "to": "interview",
          "event": {
            "name": "resumed",
            "at": "2026-11-08T23:50:00Z"
          },
          "detail": "Question 2: the written rules change, with a different sentence from the one proposed. docs/ is exempt from the staging and review rules so that boards update live. Offered a choice between a docs-only push not deploying and docs/ changes publishing directly to the live site, the owner chose publishing directly, which replaces the issue's proposed filter alone. The rule text in the project instructions, the deployment reference and the README states the exemption.",
          "interview": [
            {
              "text": "Landing this change starts a real deployment. How should that run go?",
              "options": [
                "Land normally; production waits for review",
                "Stop before the merge until told",
                "Land without a deployment using a skip marker"
              ],
              "answer": "This change lands normally.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            },
            {
              "text": "Should written rule 1 say that a docs-only push does not deploy?",
              "options": [
                "Add one sentence to the rule",
                "Leave the rules as written"
              ],
              "answer": "Yes, with a different sentence: docs/ is exempt from the staging and review rules, so that boards update live; docs/ changes publish directly to the live site.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            },
            {
              "text": "Does documentation-only stop at docs/**, or include documentation at the repository root?",
              "options": [
                "docs/** only",
                "docs/** plus named root files",
                "docs/** plus all Markdown"
              ],
              "answer": "`docs/**` only.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            },
            {
              "text": "Should the Triggers paragraph also correct its claim that a manual run on any branch deploys to staging only?",
              "options": [
                "Correct it",
                "Leave it and report it separately"
              ],
              "answer": "Correct it: the manual-run sentence in the deployment reference is corrected.",
              "asked": "2026-11-08T23:30:00Z",
              "answered": "2026-11-08T23:45:00Z"
            },
            {
              "text": "What goes live: all of docs/, or only boards?",
              "options": [
                "All of docs/, mirrored",
                "Generated boards only",
                "Only the org work board"
              ],
              "answer": "All of `docs/`, mirrored.",
              "asked": "2026-11-09T00:05:00Z",
              "answered": "2026-11-09T00:08:39Z"
            },
            {
              "text": "Where does it go?",
              "options": [
                "spartanlaboratories.org/docs/",
                "spartanlaboratories.org/boards/",
                "A subdomain"
              ],
              "answer": "At `https://spartanlaboratories.org/OrganizationPage/docs/`, inside the production folder; `/docs/` at the site root stays free.",
              "asked": "2026-11-09T00:05:00Z",
              "answered": "2026-11-09T00:08:39Z"
            },
            {
              "text": "How should a push behave when it changes docs/ and something else?",
              "options": [
                "Independent paths",
                "Hold docs/ until production is approved"
              ],
              "answer": "Both paths run independently: `docs/` goes live at once, the rest waits for staging and approval.",
              "asked": "2026-11-09T00:05:00Z",
              "answered": "2026-11-09T00:08:39Z"
            },
            {
              "text": "Should the unapproved publish job use the existing FTP account?",
              "options": [
                "Reuse it, with two target and file checks",
                "A dedicated account confined to the docs folder"
              ],
              "answer": "Reuse it, with two checks in the job: the target strictly inside production and not staging, and a refusal if `docs/` holds a file the host would execute.",
              "asked": "2026-11-09T00:05:00Z",
              "answered": "2026-11-09T00:08:39Z"
            }
          ],
          "held": true
        }
      ],
      "research": [
        {
          "since": "2026-11-09T00:08:39Z",
          "ended": "2026-11-09T00:40:04Z",
          "endedBy": "researched",
          "to": "plan",
          "event": {
            "name": "verification-started",
            "at": "2026-11-09T00:25:33Z"
          },
          "detail": "Research: verifying 3 findings.",
          "research": {
            "phase": "complete",
            "drafted": 0,
            "since": {
              "planning": "2026-11-09T00:11:00Z",
              "research": "2026-11-09T00:11:34Z",
              "verification": "2026-11-09T00:25:33Z",
              "complete": "2026-11-09T00:40:04Z"
            }
          },
          "questions": [
            {
              "question": "github-path-filters",
              "rows": [
                "push-trigger",
                "boards-on-the-website"
              ],
              "findings": "research/github-path-filters.md",
              "state": "complete",
              "started": "2026-11-09T00:11:34Z",
              "returned": "2026-11-09T00:19:03Z"
            },
            {
              "question": "ftp-deploy-nested-sync",
              "rows": [
                "boards-on-the-website"
              ],
              "findings": "research/ftp-deploy-nested-sync.md",
              "state": "complete",
              "started": "2026-11-09T00:11:34Z",
              "returned": "2026-11-09T00:17:49Z"
            },
            {
              "question": "host-executable-files",
              "rows": [
                "boards-on-the-website"
              ],
              "findings": "research/host-executable-files.md",
              "state": "complete",
              "started": "2026-11-09T00:11:34Z",
              "returned": "2026-11-09T00:24:54Z"
            }
          ]
        }
      ],
      "plan": [
        {
          "since": "2026-11-09T00:40:04Z",
          "ended": "2026-11-09T00:40:05Z",
          "endedBy": "plan-accepted",
          "to": "branch",
          "event": {
            "name": "researched",
            "at": "2026-11-09T00:40:04Z"
          },
          "detail": "Research verified; the plan next.",
          "plan": {
            "state": "writing",
            "since": "2026-11-09T00:40:04Z"
          }
        }
      ],
      "branch": [
        {
          "since": "2026-11-09T00:40:05Z",
          "ended": "2026-11-09T00:40:06Z",
          "endedBy": "branch-cut",
          "to": "implementation",
          "event": {
            "name": "plan-accepted",
            "at": "2026-11-09T00:40:05Z"
          },
          "detail": "Plan accepted; the branch is cut next.",
          "branch": "build/issue-8-no-deploy-docs-only"
        }
      ],
      "implementation": [
        {
          "since": "2026-11-09T00:40:06Z",
          "ended": "2026-11-09T01:02:04Z",
          "endedBy": "qa-pass",
          "to": "remediation",
          "event": {
            "name": "implementation-stage",
            "at": "2026-11-09T00:43:26Z",
            "note": "docs-publish reported done; Quality Review next"
          },
          "detail": "No deviations from the plan. Workflow lint and the target-check and refused-file checks passed.",
          "stages": [
            {
              "id": "docs-publish",
              "name": "Docs publish workflow, site deploy filter and policy text",
              "state": "done",
              "rows": [
                "push-trigger",
                "boards-on-the-website",
                "publish-sync",
                "publish-target",
                "executable-refusal",
                "docs-landing-page",
                "workflow-checks",
                "policy-rules",
                "deployment-reference"
              ]
            }
          ]
        }
      ],
      "qa": [
        {
          "since": null,
          "ended": "2026-11-09T01:02:04Z",
          "endedBy": "qa-pass",
          "to": "remediation",
          "event": {
            "name": "implementation-stage",
            "at": "2026-11-09T00:43:26Z",
            "note": "docs-publish reported done; Quality Review next"
          },
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
            }
          ]
        },
        {
          "since": "2026-11-09T01:13:52Z",
          "ended": "2026-11-09T01:25:16Z",
          "endedBy": "qa-pass",
          "to": "remediation",
          "event": {
            "name": "qa-pass",
            "at": "2026-11-09T01:13:52Z",
            "note": "Quality Review 2: running"
          },
          "detail": "Quality Review 2 running.",
          "qa": [
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
            }
          ]
        },
        {
          "since": "2026-11-09T01:38:24Z",
          "ended": "2026-11-09T01:47:04Z",
          "endedBy": "qa-pass",
          "to": "remediation",
          "event": {
            "name": "qa-pass",
            "at": "2026-11-09T01:38:24Z",
            "note": "Quality Review 3: running"
          },
          "detail": "Quality Review 3 running.",
          "qa": [
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
              "route": "on-the-spot"
            }
          ]
        }
      ],
      "remediation": [
        {
          "since": "2026-11-09T01:02:04Z",
          "ended": "2026-11-09T01:13:52Z",
          "endedBy": "qa-pass",
          "to": "qa",
          "event": {
            "name": "implementation-stage",
            "at": "2026-11-09T01:13:51Z",
            "note": "docs-publish"
          },
          "detail": "The publish job now confirms this run's marker on the live site and also refuses .fcgi files. The widened gating checks passed, and all 24 mutated copies were caught. No deviations from the plan.",
          "remediation": {
            "pass": 1,
            "route": "re-plan-then-remediation",
            "steps": [
              {
                "name": "Plan re-pass",
                "state": "done"
              },
              {
                "name": "Implementation of the revised plan",
                "state": "done"
              }
            ]
          },
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
            }
          ]
        },
        {
          "since": "2026-11-09T01:25:16Z",
          "ended": "2026-11-09T01:38:24Z",
          "endedBy": "qa-pass",
          "to": "qa",
          "event": {
            "name": "implementation-stage",
            "at": "2026-11-09T01:38:23Z",
            "note": "docs-publish"
          },
          "detail": "Symbolic links under docs/ are refused, and a marker that does not answer ends with a named error. The gating checks passed, and all 31 mutated copies were caught. No deviations from the plan.",
          "remediation": {
            "pass": 2,
            "route": "re-plan-then-remediation",
            "steps": [
              {
                "name": "Plan re-pass",
                "state": "done"
              },
              {
                "name": "Implementation of the revised plan",
                "state": "done"
              }
            ]
          },
          "qa": [
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
            }
          ]
        },
        {
          "since": "2026-11-09T01:47:04Z",
          "ended": "2026-11-09T01:47:05Z",
          "endedBy": "document",
          "to": "document",
          "event": {
            "name": "qa-pass",
            "at": "2026-11-09T01:47:04Z",
            "note": "Quality Review 3: changes-requested"
          },
          "detail": "Every finding from the second review is resolved, and all 128 gating checks passed. The one remaining point, a sentence in the plan about what the gating script counts, is corrected.",
          "remediation": {
            "pass": 3,
            "route": "on-the-spot"
          },
          "qa": [
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
              "route": "on-the-spot"
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
    "waits": [
      {
        "step": "interview",
        "since": "2026-11-08T23:30:00Z",
        "ended": "2026-11-08T23:45:00Z",
        "by": "halted"
      },
      {
        "step": "interview",
        "since": "2026-11-09T00:05:00Z",
        "ended": "2026-11-09T00:08:39Z",
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
      "note": "three questions and three findings files; all 50 load-bearing claims held at their sources"
    },
    {
      "column": "considered",
      "label": "Options weighed",
      "date": "2026-11-09",
      "ref": "plan.md#6-design",
      "note": "the interview's two rounds, the research's recommendations and the plan's design"
    },
    {
      "column": "verdict",
      "label": "Plan accepted",
      "date": "2026-11-09",
      "ref": "plan.md"
    }
  ],
  "trail": [
    {
      "date": "2026-11-08",
      "column": "gap",
      "label": "Sized; the interview starts"
    },
    {
      "date": "2026-11-08",
      "column": "gap",
      "label": "Halted at the interview: waiting on you (The owner's answers to the interview questions.)"
    },
    {
      "date": "2026-11-08",
      "column": "gap",
      "label": "Resumed at the interview"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Halted at the interview: waiting on you (The owner's answers to the second round of interview questions.)"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Resumed at research"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research planning: 0 questions drafted"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research started: `github-path-filters`, `ftp-deploy-nested-sync`, `host-executable-files`"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research returned: `ftp-deploy-nested-sync`",
      "ref": "research/ftp-deploy-nested-sync.md"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research returned: `github-path-filters`",
      "ref": "research/github-path-filters.md"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Research returned: `host-executable-files`",
      "ref": "research/host-executable-files.md"
    },
    {
      "date": "2026-11-09",
      "column": "gap",
      "label": "Verification started: 3 findings"
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
      "label": "Plan accepted",
      "ref": "plan.md"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Branch `build/issue-8-no-deploy-docs-only` cut; implementation starts"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Implementation done (1 stage); Quality Review next"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 1: changes requested, 12 findings (12 other; 12 test)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Resolution: docs-publish"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 2: running"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 2: changes requested, 8 findings (7 minor, 1 other; 6 test, 2 code)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Resolution of Quality Review 2: docs-publish"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 3: running"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Quality Review 3: changes requested, 1 finding (1 minor; 1 test)"
    },
    {
      "date": "2026-11-09",
      "column": "built",
      "label": "Document: Documentation review current"
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
      "label": "Document: 4 of 5 tasks done"
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
    }
  ],
  "rows": [
    {
      "id": "push-trigger",
      "group": "Code",
      "name": "The site deployment's push trigger",
      "system": "deployment",
      "where": "`.github/workflows/deploy-spaceship.yml`",
      "gap": {
        "kind": "missing",
        "summary": "A push to `main` that changes only `docs/` starts a site deployment, though nothing under `docs/` feeds the site build. The `push` trigger names the branch `main` and no path filter, so every such push runs the build, deploys to staging automatically and then waits on production approval.",
        "detail": "The organization's work board, kept under `docs/plans/org-work-board/`, changes at every landing across the organization's repositories, so each of those commits would start a deployment. Path filters do not apply to the manual `workflow_dispatch` trigger, which stages any branch from the Actions tab.",
        "evidence": [
          "`.github/workflows/deploy-spaceship.yml:15-17` — the `push` trigger lists the branch `main` and no path filter",
          "`.github/workflows/deploy-spaceship.yml:82-83` — the `staging` job needs only `build`, so it follows every run",
          "`.github/workflows/deploy-spaceship.yml:167-174` — the `production` job runs for `main` and a reviewer must approve its environment before it starts",
          "`research/github-path-filters.md` F1, F2 — complementary filters split every non-empty push exactly, and a landing's merge commit is judged on everything its branch brought in"
        ],
        "source": "research/README.md",
        "link": "research/README.md#starting-the-right-workflow-for-each-push"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          ".github/workflows/deploy-spaceship.yml"
        ],
        "statements": [
          {
            "text": "`deploy-spaceship.yml` gained `paths-ignore: docs/**` under `on.push`, so a push that changes only `docs/` matches no trigger of this workflow.",
            "state": "as-planned"
          },
          {
            "text": "`publish-docs.yml` matches the paths this workflow ignores, so a push that changes both matches both, and the two run independently.",
            "state": "as-planned"
          },
          {
            "text": "The filter names `docs/**` and nothing else, so `README.md`, `CHANGELOG.md`, `CLAUDE.md` and `LICENSE` keep the full path.",
            "state": "as-planned"
          },
          {
            "text": "The file's diff is the five added lines: the `workflow_dispatch` trigger, the three jobs, the approval gate and every default are as they were.",
            "state": "as-planned"
          }
        ]
      },
      "options": [
        {
          "id": "complementary-filters",
          "name": "Two workflows with complementary `docs/**` filters",
          "summary": "`publish-docs.yml` runs on `paths: docs/**` and `deploy-spaceship.yml` on `paths-ignore: docs/**`; a push that changes both starts both, each in its own concurrency group.",
          "verdict": "accepted",
          "why": "Native filters split every non-empty push exactly, need no runner to decide anything and keep the publish that nobody approves out of the run that holds the site's required reviewer.",
          "source": "research/github-path-filters.md",
          "link": "plan.md#6-design"
        },
        {
          "id": "filter-alone",
          "name": "The filter alone, as #8 proposes",
          "summary": "A `paths-ignore` for `docs/**` with nothing to publish `docs/`, left for a later step.",
          "verdict": "declined",
          "why": "The interview settled that `docs/` changes publish directly to the live site, which replaces a filter on its own.",
          "source": "#8; interview",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "route-in-one-workflow",
          "name": "Route inside one workflow",
          "summary": "One workflow inspects the changed files inside a job and routes from there.",
          "verdict": "declined",
          "why": "It needs a runner and a checkout on every push to decide anything, and it would put a publish that nobody approves into the run that holds the production reviewer.",
          "source": "research/github-path-filters.md",
          "link": "research/README.md#starting-the-right-workflow-for-each-push"
        },
        {
          "id": "hold-docs",
          "name": "Hold `docs/` until production is approved",
          "summary": "A push that changes both keeps its `docs/` changes back until the site's approval.",
          "verdict": "declined",
          "why": "The two paths run independently: `docs/` goes live at once and the rest waits for staging and approval, so that the boards stay current.",
          "source": "plan.md §1, requirement 4",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "named-root-files",
          "name": "`docs/**` plus named root files",
          "verdict": "declined",
          "why": "The interview settled the filter as `docs/**` only; `README.md`, `CHANGELOG.md`, `CLAUDE.md` and `LICENSE` keep the full path.",
          "source": "plan.md §1, requirement 3",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "all-markdown",
          "name": "`docs/**` plus all Markdown",
          "verdict": "declined",
          "why": "The interview settled the filter as `docs/**` only, so Markdown elsewhere in the repository keeps the full path.",
          "source": "plan.md §1, requirement 3",
          "link": "plan.md#1-requirements"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "`deploy-spaceship.yml` gains `paths-ignore: docs/**` on its `push` trigger, so a push that changes only `docs/` starts no staging or production run.",
            "ref": "plan.md#71-githubworkflowsdeploy-spaceshipyml-changed-one-addition",
            "excerpt": {
              "ref": "plan.md#71-githubworkflowsdeploy-spaceshipyml-changed-one-addition",
              "heading": "7.1 `.github/workflows/deploy-spaceship.yml` (changed: one addition)",
              "paragraph": "Under `on.push`, after `branches`, add exactly:",
              "hash": "6cf7ed9f1a1b"
            }
          },
          {
            "text": "A push that changes both `docs/` and other files starts both workflows, which run independently.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The deployment system moves repository content to the live host. After this change it has two paths with different guarantees: the site path (`deploy-spaceship.yml`: build, staging, approval, production), unchanged except that it ignores pushes that touch only `docs/`; and the documents path (`publish-docs.yml`: guard, upload, confirm), the project's one exemption from staging and approval.",
              "hash": "a6216fe35667"
            }
          },
          {
            "text": "The filter is `docs/**` only, so `README.md`, `CHANGELOG.md`, `CLAUDE.md` and `LICENSE` keep the full path.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "Everything under `docs/` goes live on a push to `main` with no staging and no approval. This is an explicit exception to deployment rules 1, 2, 3, 5 and 9, limited to `docs/`. Every other change keeps the full staging-and-approval path. · All of `docs/` is published, mirrored, at `https://spartanlaboratories.org/OrganizationPage/docs/...`; for example the organization work board is at `/OrganizationPage/docs/plans/org-work-board/`. The upload target is `/spartanlaboratories.org/OrganizationPage/docs` inside the production folder. `/docs/` at the site root stays free. Search engines may index …",
              "hash": "fae028842059"
            }
          },
          {
            "text": "The `workflow_dispatch` trigger, the three jobs, the approval gate and every default stay as they are.",
            "ref": "plan.md#71-githubworkflowsdeploy-spaceshipyml-changed-one-addition",
            "excerpt": {
              "ref": "plan.md#71-githubworkflowsdeploy-spaceshipyml-changed-one-addition",
              "heading": "7.1 `.github/workflows/deploy-spaceship.yml` (changed: one addition)",
              "paragraph": "Under `on.push`, after `branches`, add exactly:",
              "hash": "6cf7ed9f1a1b"
            }
          }
        ],
        "defense": "Nothing under `docs/` feeds the site build, so the filter loses nothing today, and its comment says to remove or narrow it if the site build ever reads `docs/`. It is one addition to one trigger: the path every other change takes is untouched.",
        "steps": [
          {
            "id": "7.1",
            "what": "Add the commented `paths-ignore` filter under `on.push`, after `branches`, in `.github/workflows/deploy-spaceship.yml`.",
            "files": [
              ".github/workflows/deploy-spaceship.yml"
            ],
            "check": "`git diff` of the file shows only the five added lines; `actionlint` reports nothing",
            "link": "plan.md#71-githubworkflowsdeploy-spaceshipyml-changed-one-addition"
          }
        ],
        "tests": [
          "L1 gating — `actionlint` on the workflow and the diff scope",
          "After the landing — the first docs-only push starts a publish run and no deployment run"
        ],
        "risks": [
          "A workflow that a push does not match leaves no entry in the Actions list, so a missing run looks like a failure to start; the deployment reference documents it",
          "A site build that came to read `docs/` would silently stop deploying changes to it, which is why the filter's comment says when to remove it"
        ],
        "source": "plan.md §6, §7.1",
        "link": "plan.md#71-githubworkflowsdeploy-spaceshipyml-changed-one-addition"
      }
    },
    {
      "id": "boards-on-the-website",
      "group": "Code",
      "name": "Publishing `docs/` to the live site",
      "system": "deployment",
      "where": "`.github/workflows/publish-docs.yml`",
      "gap": {
        "kind": "missing",
        "summary": "Nothing publishes `docs/` to the live site. The site deployment uploads only the `web` build output, so the boards and documents under `docs/` are not served, and `/OrganizationPage/docs/` returns 404 at the baseline.",
        "evidence": [
          "`.github/workflows/deploy-spaceship.yml:74-78` — the `site` artifact is `web/build/dist/js/productionExecutable/` alone",
          "`plan.md` §2 — the live site's `/OrganizationPage/` and `/OrganizationPage/docs/` return 404",
          "`research/github-path-filters.md` F6 — no sentence of GitHub's says that a workflow a push adds has its `paths` filter evaluated on that same push, so the workflow also takes a manual trigger"
        ],
        "source": "research/README.md",
        "link": "research/README.md#starting-the-right-workflow-for-each-push"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          ".github/workflows/publish-docs.yml"
        ],
        "statements": [
          {
            "text": "`publish-docs.yml`, named `OrganizationPage Docs Publish`, runs on a push to `main` that changes `docs/`, with no staging or approval step.",
            "state": "as-planned"
          },
          {
            "text": "`DOCS_REMOTE_DIR` defaults to `/spartanlaboratories.org/OrganizationPage/docs` and `DOCS_URL` to `https://spartanlaboratories.org/OrganizationPage/docs/`; nothing is uploaded to `/docs/` at the site root.",
            "state": "as-planned"
          },
          {
            "text": "The job declares no `environment`, so the `production` reviewer does not apply to it.",
            "state": "as-planned"
          },
          {
            "text": "`workflow_dispatch` is there, and the job's `if` limits it to `main`; on any other branch the job is skipped.",
            "state": "as-planned"
          },
          {
            "text": "The job runs in the `publish-docs` group with `cancel-in-progress: false`.",
            "state": "as-planned"
          }
        ]
      },
      "options": [
        {
          "id": "all-of-docs-mirrored",
          "name": "All of `docs/`, mirrored at `/OrganizationPage/docs/`",
          "summary": "Every file under `docs/` is published path for path, stored at `/spartanlaboratories.org/OrganizationPage/docs` inside the production folder; search engines may index it.",
          "verdict": "accepted",
          "why": "`docs/` is the whole of the exemption, and `/docs/` at the site root stays free for the API reference #7 places there.",
          "source": "plan.md §1, requirements 1 and 2; consequences.md",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "generated-boards-only",
          "name": "Generated boards only",
          "verdict": "declined",
          "why": "The plan publishes all of `docs/`, mirrored, rather than a part of it.",
          "source": "plan.md §1, requirement 2",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "org-work-board-only",
          "name": "Only the org work board",
          "verdict": "declined",
          "why": "The plan publishes all of `docs/`, mirrored, of which that board is one path.",
          "source": "plan.md §1, requirement 2",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "at-site-root-docs",
          "name": "At `spartanlaboratories.org/docs/`",
          "verdict": "declined",
          "why": "`/docs/` at the site root stays free: #7 places its API reference at `/docs/api/`.",
          "source": "consequences.md",
          "link": "consequences.md#neighbouring-issues"
        },
        {
          "id": "at-boards-path",
          "name": "At `spartanlaboratories.org/boards/`",
          "verdict": "declined",
          "why": "The plan publishes under `/OrganizationPage/docs/`, so the served path mirrors the repository's `docs/` folder.",
          "source": "plan.md §1, requirement 2",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "at-subdomain",
          "name": "On a subdomain",
          "verdict": "declined",
          "why": "The plan publishes inside the production folder, under `/OrganizationPage/docs/`.",
          "source": "plan.md §1, requirement 2",
          "link": "plan.md#1-requirements"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "A new workflow, `OrganizationPage Docs Publish`, publishes all of `docs/` on a push to `main` that changes it, with no staging and no approval.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          },
          {
            "text": "The files are served, mirrored, at `https://spartanlaboratories.org/OrganizationPage/docs/`, and `/docs/` at the site root stays free.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "Everything under `docs/` goes live on a push to `main` with no staging and no approval. This is an explicit exception to deployment rules 1, 2, 3, 5 and 9, limited to `docs/`. Every other change keeps the full staging-and-approval path. · All of `docs/` is published, mirrored, at `https://spartanlaboratories.org/OrganizationPage/docs/...`; for example the organization work board is at `/OrganizationPage/docs/plans/org-work-board/`. The upload target is `/spartanlaboratories.org/OrganizationPage/docs` inside the production folder. `/docs/` at the site root stays free. Search engines may index …",
              "hash": "fae028842059"
            }
          },
          {
            "text": "The job declares no GitHub environment, so the `production` environment's required reviewer does not apply to it.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          },
          {
            "text": "A manual run republishes from `main`; on any other branch the job is skipped.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          },
          {
            "text": "Publishes share the `publish-docs` concurrency group with `cancel-in-progress: false`.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          }
        ],
        "defense": "Each publish uploads the whole folder at its own commit, so an older waiting run that is cancelled loses nothing. Its concurrency group is its own, as group names are shared across workflows. The manual trigger means the first publish does not depend on GitHub starting a workflow on the push that adds it.",
        "steps": [
          {
            "id": "7.2",
            "what": "Create `.github/workflows/publish-docs.yml` as the plan gives it, with the two repository variables `SPACESHIP_DOCS_REMOTE_DIR` and `SPACESHIP_DOCS_URL`.",
            "files": [
              ".github/workflows/publish-docs.yml"
            ],
            "check": "`actionlint` reports nothing",
            "link": "plan.md#72-githubworkflowspublish-docsyml-new"
          }
        ],
        "tests": [
          "L1 gating — `actionlint` on the workflow",
          "After the landing — the landing starts a publish run, or one is run by hand on `main`, and `/OrganizationPage/docs/` returns 200"
        ],
        "risks": [
          "Anything merged under `docs/` is public at once, with no review step, so nothing sensitive may be committed there",
          "GitHub does not guarantee queue order, so an older commit could upload after a newer one in a narrow window; the next push under `docs/` or a manual run repairs it"
        ],
        "source": "plan.md §6, §7.2",
        "link": "plan.md#72-githubworkflowspublish-docsyml-new"
      }
    },
    {
      "id": "publish-sync",
      "group": "Code",
      "name": "Uploading into a folder inside production",
      "system": "deployment",
      "where": "`.github/workflows/publish-docs.yml`",
      "gap": {
        "kind": "risk",
        "summary": "A publish into a folder nested in the production folder must not disturb what the site deployment uploaded. The shared action's sync deletes only what its own record in the target folder lists, but it treats any failure to enter the target folder as a first publish, which could send the upload to the last folder it reached.",
        "evidence": [
          "`.github/actions/spaceship-deploy/action.yml:127-140` — the action hands `local-dir`, `server-dir` and `dangerous-clean-slate` to `SamKirkland/FTP-Deploy-Action@v4.4.0`",
          "`research/ftp-deploy-nested-sync.md` — each target folder keeps its own record and none removes what another uploaded; a failed change of directory carries on in the last folder reached"
        ],
        "source": "research/README.md",
        "link": "research/README.md#uploading-into-a-folder-inside-the-production-folder"
      },
      "options": [
        {
          "id": "default-state-file",
          "name": "A default sync record in each target folder",
          "summary": "The documents folder keeps its own `.ftp-deploy-sync-state.json`, as production and staging do.",
          "verdict": "accepted",
          "why": "The action records what its last upload sent and deletes only recorded paths that are gone locally; it never lists the remote folder, so no sync removes what another uploaded.",
          "source": "research/ftp-deploy-nested-sync.md",
          "link": "research/README.md#uploading-into-a-folder-inside-the-production-folder"
        },
        {
          "id": "state-name",
          "name": "A record renamed through `state-name`",
          "verdict": "declined",
          "why": "A default record in each target folder is already safe, and `state-name` adds nothing.",
          "source": "research/ftp-deploy-nested-sync.md",
          "link": "research/README.md#uploading-into-a-folder-inside-the-production-folder"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "The upload goes through the shared action, unchanged, with `clean-remote: \"false\"`, so the sync removes only files this upload put there itself.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          },
          {
            "text": "The documents folder keeps its own sync record beside the records of production and staging.",
            "ref": "plan.md#2-current-state",
            "excerpt": {
              "ref": "plan.md#2-current-state",
              "heading": "2. Current state",
              "paragraph": "Baseline: `main` at `21c23eb`; the branch holds only the research commits for this issue on top of it.",
              "hash": "1737c8ad3a5c"
            }
          },
          {
            "text": "After the upload the job compares the `publish-info.json` the site serves with the one this run wrote, so a publish that went astray fails visibly, on the first publish and every later one.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The deployment system moves repository content to the live host. After this change it has two paths with different guarantees: the site path (`deploy-spaceship.yml`: build, staging, approval, production), unchanged except that it ignores pushes that touch only `docs/`; and the documents path (`publish-docs.yml`: guard, upload, confirm), the project's one exemption from staging and approval.",
              "hash": "a6216fe35667"
            }
          }
        ],
        "defense": "Comparing the served marker with this run's is what detects the one way the sync can go wrong: the marker differs on every attempt, so neither a misdirected upload nor a copy left by an earlier run can match it, and the run is red. The rollback procedure in `docs/DEPLOYMENT.md` restores the site's `index.html` and removes the stray files.",
        "steps": [
          {
            "id": "7.2",
            "what": "Call the shared action with `local-dir: docs/` and the checked target, writing the run's marker before it and comparing the served marker after it, in `.github/workflows/publish-docs.yml`.",
            "files": [
              ".github/workflows/publish-docs.yml"
            ],
            "check": "after the landing, the upload step prints the first-publish message and the confirm step succeeds",
            "link": "plan.md#72-githubworkflowspublish-docsyml-new"
          }
        ],
        "tests": [
          "L1 gating — the record and confirm steps' bodies run against a local HTTP server, with a served marker that differs and with none",
          "After the landing — the site root's sync record lists no `docs` entries and `/staging/` is still served"
        ],
        "risks": [
          "Files that a failed run uploaded and that leave the repository before the next successful publish stay on the server, as no record lists them",
          "A later site build that output a top-level `OrganizationPage` entry and then dropped it would make production's sync remove that whole folder; the rule is written into the deployment reference"
        ],
        "source": "plan.md §2, §6, §10",
        "link": "plan.md#6-design"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          ".github/workflows/publish-docs.yml"
        ],
        "statements": [
          {
            "text": "`Publish docs` calls the shared action, unchanged, with `clean-remote: \"false\"`, so the sync removes only files this upload put there itself.",
            "state": "as-planned"
          },
          {
            "text": "The step passes no state name, so the action keeps its default sync record in the documents folder, beside the records of production and staging.",
            "state": "as-planned"
          },
          {
            "text": "`Record publish info` writes the commit, run and attempt to `publish-info.json` before the upload, and `Confirm this run was published` compares the copy the site serves with it, failing on any difference; a marker that does not answer ends with an error naming the URL.",
            "state": "as-planned"
          }
        ]
      }
    },
    {
      "id": "publish-target",
      "group": "Code",
      "name": "The publish target and its FTP account",
      "system": "deployment",
      "where": "`.github/workflows/publish-docs.yml`",
      "gap": {
        "kind": "risk",
        "summary": "The documents publish has no approval step and writes through an FTP account that can write the whole site. Its target has to be held inside the production folder and clear of staging, and a comparison of folder strings cannot do that, because the production folder is configured as `/../../spartanlaboratories.org/`.",
        "evidence": [
          "`.github/workflows/deploy-spaceship.yml:105-108` — the staging check compares the two folders as strings",
          "`plan.md` §2 — `SPACESHIP_REMOTE_DIR` is `/../../spartanlaboratories.org/`, which resolves to `/spartanlaboratories.org`; the FTP secrets are repository-level"
        ],
        "source": "plan.md §2, §6",
        "link": "plan.md#2-current-state"
      },
      "options": [
        {
          "id": "reuse-with-checks",
          "name": "Reuse the existing FTP account, with a target check on resolved paths",
          "summary": "The three folders are resolved with `realpath -m`; the documents folder must be strictly inside production and must not be, sit inside or contain staging.",
          "verdict": "accepted",
          "why": "It needs nothing created on the host, and comparing resolved paths sees that `/../../spartanlaboratories.org/` is the production folder.",
          "source": "plan.md §1, requirement 5; §6",
          "link": "plan.md#6-design"
        },
        {
          "id": "dedicated-account",
          "name": "A dedicated account confined to the docs folder",
          "verdict": "declined",
          "why": "It needs the account created on the host, its own secrets and the target check changed to suit a login whose root is that folder. It is a recorded follow-up.",
          "source": "consequences.md",
          "link": "consequences.md#follow-ups"
        },
        {
          "id": "string-comparison",
          "name": "Compare folder strings, as the staging check does",
          "verdict": "declined",
          "why": "The production folder is configured as `/../../spartanlaboratories.org/`, the same folder as `/spartanlaboratories.org/`, which a string comparison would not see (#9).",
          "source": "plan.md §6",
          "link": "plan.md#6-design"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "The existing FTP account and secrets are reused.",
            "ref": "plan.md#1-requirements",
            "excerpt": {
              "ref": "plan.md#1-requirements",
              "heading": "1. Requirements",
              "paragraph": "Everything under `docs/` goes live on a push to `main` with no staging and no approval. This is an explicit exception to deployment rules 1, 2, 3, 5 and 9, limited to `docs/`. Every other change keeps the full staging-and-approval path. · All of `docs/` is published, mirrored, at `https://spartanlaboratories.org/OrganizationPage/docs/...`; for example the organization work board is at `/OrganizationPage/docs/plans/org-work-board/`. The upload target is `/spartanlaboratories.org/OrganizationPage/docs` inside the production folder. `/docs/` at the site root stays free. Search engines may index …",
              "hash": "fae028842059"
            }
          },
          {
            "text": "The job compares the three folders as resolved paths and refuses a production folder that resolves to `/`.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The deployment system moves repository content to the live host. After this change it has two paths with different guarantees: the site path (`deploy-spaceship.yml`: build, staging, approval, production), unchanged except that it ignores pushes that touch only `docs/`; and the documents path (`publish-docs.yml`: guard, upload, confirm), the project's one exemption from staging and approval.",
              "hash": "a6216fe35667"
            }
          },
          {
            "text": "The documents folder must be strictly inside production and must not be, sit inside or contain staging; a refused run fails before any FTP traffic.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          }
        ],
        "defense": "With no approval step, the checks in the job stand in for one. They run before anything reaches the host and name the setting and the resolved paths when they refuse.",
        "steps": [
          {
            "id": "7.2",
            "what": "Add the `Check publish target` step to `.github/workflows/publish-docs.yml`.",
            "files": [
              ".github/workflows/publish-docs.yml"
            ],
            "check": "the step's body, run against the plan's table of folders, accepts and refuses each as listed",
            "link": "plan.md#72-githubworkflowspublish-docsyml-new"
          }
        ],
        "tests": [
          "L1 gating — the step's body run against the plan's table of target folders, and one run whose documents folder contains staging"
        ],
        "risks": [
          "The two checks are the only fence on a wide account, and they live in the workflow file on `main`: anyone who can change that file can change them"
        ],
        "source": "plan.md §6, §7.2",
        "link": "plan.md#6-design"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          ".github/workflows/publish-docs.yml"
        ],
        "statements": [
          {
            "text": "The job uses the existing `SPACESHIP_FTP_*` secrets and variables; no new account was added.",
            "state": "as-planned"
          },
          {
            "text": "`Check publish target` resolves the three folders with `realpath -m` and refuses a production folder that resolves to `/`.",
            "state": "as-planned"
          },
          {
            "text": "It requires the documents folder to be strictly inside production and not to be, sit inside or contain staging, and it runs directly after the checkout, before any FTP traffic.",
            "state": "as-planned"
          }
        ]
      }
    },
    {
      "id": "executable-refusal",
      "group": "Code",
      "name": "Refusing files the host would execute",
      "system": "deployment",
      "where": "`.github/workflows/publish-docs.yml`",
      "gap": {
        "kind": "risk",
        "summary": "A publish with no approval step must not carry a file the host would execute or interpret. `.htaccess` matters most, because cPanel allows overrides and one such file can map any extension to a handler. `docs/` holds no such name at the baseline.",
        "detail": "Apache-style `AddHandler` compares every dot-separated segment, OpenLiteSpeed looks only at the last one, and LiteSpeed Enterprise is closed source. Spaceship's own documentation could not be read, so its configuration is inferred from cPanel and LiteSpeed defaults and the live `server: LiteSpeed` header.",
        "evidence": [
          "`research/host-executable-files.md` — the names and extensions a LiteSpeed cPanel host executes or honours",
          "`plan.md` §2 — a `find` for those names over `docs/` returns nothing"
        ],
        "source": "research/README.md",
        "link": "research/README.md#refusing-files-the-host-would-run"
      },
      "options": [
        {
          "id": "refusal-list",
          "name": "A refusal list of executable names",
          "summary": "Case-insensitive and catching inner segments such as `report.php.md`, assuming the worse of the two servers' matching rules.",
          "verdict": "accepted",
          "why": "The files are committed to the repository, and the set of names this stack maps to a handler is small and closed.",
          "source": "research/host-executable-files.md",
          "link": "research/README.md#refusing-files-the-host-would-run"
        },
        {
          "id": "allow-list",
          "name": "An allow list of extensions",
          "verdict": "declined",
          "why": "It would fail the publish on `main` each time a new static type appeared, and it would need the same inner-segment patterns to catch `report.php.md`. OWASP's preference for allow lists concerns files chosen by untrusted uploaders.",
          "source": "research/host-executable-files.md",
          "link": "research/README.md#refusing-files-the-host-would-run"
        },
        {
          "id": "action-exclude",
          "name": "Drop the files through the action's `exclude` input",
          "verdict": "declined",
          "why": "The job fails and names each file rather than dropping it, and a custom `exclude` replaces the action's defaults instead of adding to them.",
          "source": "research/README.md",
          "link": "plan.md#6-design"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "The job refuses to run if `docs/` holds a name on the refusal list, and names each file it found.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          },
          {
            "text": "Any symbolic link under `docs/` is refused as well, whatever it points at, because the upload follows a link the check does not.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The deployment system moves repository content to the live host. After this change it has two paths with different guarantees: the site path (`deploy-spaceship.yml`: build, staging, approval, production), unchanged except that it ignores pushes that touch only `docs/`; and the documents path (`publish-docs.yml`: guard, upload, confirm), the project's one exemption from staging and approval.",
              "hash": "a6216fe35667"
            }
          },
          {
            "text": "Matching is case-insensitive and catches inner segments.",
            "ref": "plan.md#6-design",
            "excerpt": {
              "ref": "plan.md#6-design",
              "heading": "6. Design",
              "paragraph": "Responsibility. The deployment system moves repository content to the live host. After this change it has two paths with different guarantees: the site path (`deploy-spaceship.yml`: build, staging, approval, production), unchanged except that it ignores pushes that touch only `docs/`; and the documents path (`publish-docs.yml`: guard, upload, confirm), the project's one exemption from staging and approval.",
              "hash": "a6216fe35667"
            }
          },
          {
            "text": "A folder that matches counts too, and a refused run fails before any FTP traffic.",
            "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
            "excerpt": {
              "ref": "plan.md#72-githubworkflowspublish-docsyml-new",
              "heading": "7.2 `.github/workflows/publish-docs.yml` (new)",
              "paragraph": "Full content:",
              "hash": "3c10ab4240ad"
            }
          }
        ],
        "defense": "The list only ever refuses more than needed, so it stays safe whichever way the host's matching goes. A name check cannot see a handler mapped onto an inert extension at account level; a one-time check of one served file of each static type after the landing closes that. A link is refused outright, as it could otherwise publish content from outside `docs/` under a name the check never saw.",
        "steps": [
          {
            "id": "7.2",
            "what": "Add the `Refuse files the server would execute` step to `.github/workflows/publish-docs.yml`.",
            "files": [
              ".github/workflows/publish-docs.yml"
            ],
            "check": "the step's body refuses each of the plan's refused names and each kind of symbolic link, and accepts each of its allowed names; the same `find` over the real `docs/` returns nothing",
            "link": "plan.md#72-githubworkflowspublish-docsyml-new"
          }
        ],
        "tests": [
          "L1 gating — the step's body run from a scratch `docs/` tree built fresh for each case, symbolic links among them, and the same `find` over the real `docs/`",
          "After the landing — one file of each static type under the folder comes back byte for byte"
        ],
        "risks": [
          "The refusal list stops files the host would run; it does not stop any other content",
          "A commit that adds a symbolic link under `docs/` fails the publish on `main` until the link is removed",
          "Generated boards add files under `docs/`, so the `find` is run again immediately before the commit that carries them"
        ],
        "source": "plan.md §6, §7.2, §9",
        "link": "plan.md#6-design"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          ".github/workflows/publish-docs.yml"
        ],
        "statements": [
          {
            "text": "`Refuse files the server would execute` runs `find` over `docs/` for the plan's names, `.fcgi` among them, and exits 1 naming each file it found.",
            "state": "as-planned"
          },
          {
            "text": "`find` also takes `-type l`, so any symbolic link under `docs/`, whatever it points at, is refused and named the same way.",
            "state": "as-planned"
          },
          {
            "text": "Every name pattern is `-iname`, and the wildcards catch inner segments such as `report.php.md`.",
            "state": "as-planned"
          },
          {
            "text": "`find` matches folders as well as files, and the step runs before the upload, so a refused run sends nothing to the host.",
            "state": "as-planned"
          }
        ]
      }
    },
    {
      "id": "docs-landing-page",
      "group": "Code",
      "name": "The documents landing page",
      "system": "deployment",
      "where": "`docs/index.html`",
      "gap": {
        "kind": "missing",
        "summary": "The shared action refuses a local folder with no `index.html`, and `docs/` has none. The check looks at the local folder, whatever URL it is served at, so `docs/` needs its own file.",
        "evidence": [
          "`.github/actions/spaceship-deploy/action.yml:66-69` — the action checks `\"$IN_LOCAL_DIR/index.html\"`",
          "`plan.md` §2 — `docs/` holds `DEPLOYMENT.md` and `plans/`, with no index file"
        ],
        "source": "research/README.md",
        "link": "research/README.md#uploading-into-a-folder-inside-the-production-folder"
      },
      "options": [
        {
          "id": "committed-index",
          "name": "A committed `docs/index.html`",
          "summary": "A plain static page with no script, linking the boards, the deployment reference, the site and the repository.",
          "verdict": "accepted",
          "why": "It keeps the action's check meaningful: a checkout without `docs/` fails before the sync can delete anything. It is also the folder's landing page.",
          "source": "plan.md §6",
          "link": "plan.md#6-design"
        },
        {
          "id": "generated-index",
          "name": "A file generated in the job",
          "verdict": "declined",
          "why": "It would pass the check even for a wrong checkout, so the check would no longer protect anything.",
          "source": "research/ftp-deploy-nested-sync.md",
          "link": "research/README.md#uploading-into-a-folder-inside-the-production-folder"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "A committed plain static page, titled \"OrganizationPage documents\", satisfies the action's check on `docs/`.",
            "ref": "plan.md#73-docsindexhtml-new",
            "excerpt": {
              "ref": "plan.md#73-docsindexhtml-new",
              "heading": "7.3 `docs/index.html` (new)",
              "paragraph": "A plain static page, no script, title \"OrganizationPage documents\". Committed so the shared action's `index.html` check holds on `docs/`.",
              "hash": "6375d65f222a"
            }
          },
          {
            "text": "Its links are relative, so the page stays correct at any mount point.",
            "ref": "plan.md#73-docsindexhtml-new",
            "excerpt": {
              "ref": "plan.md#73-docsindexhtml-new",
              "heading": "7.3 `docs/index.html` (new)",
              "paragraph": "A plain static page, no script, title \"OrganizationPage documents\". Committed so the shared action's `index.html` check holds on `docs/`.",
              "hash": "6375d65f222a"
            }
          },
          {
            "text": "The page is public, so it carries nothing but its links.",
            "ref": "plan.md#73-docsindexhtml-new",
            "excerpt": {
              "ref": "plan.md#73-docsindexhtml-new",
              "heading": "7.3 `docs/index.html` (new)",
              "paragraph": "A plain static page, no script, title \"OrganizationPage documents\". Committed so the shared action's `index.html` check holds on `docs/`.",
              "hash": "6375d65f222a"
            }
          }
        ],
        "defense": "A committed page costs one small file and makes a checkout without `docs/` fail before the sync can delete anything.",
        "steps": [
          {
            "id": "7.3",
            "what": "Create `docs/index.html` as the plan gives it.",
            "files": [
              "docs/index.html"
            ],
            "check": "after the landing, `/OrganizationPage/docs/` returns 200 and shows the page",
            "link": "plan.md#73-docsindexhtml-new"
          }
        ],
        "tests": [
          "After the landing — the page is served and its links answer as the plan's table in 7.3 lists, and the owner judges the page"
        ],
        "risks": [
          "The organization work board's link returns 404 until that board's first commit after this landing; a folder link that answers 403 or 404 is a content fix to the page"
        ],
        "source": "plan.md §6, §7.3",
        "link": "plan.md#73-docsindexhtml-new"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          "docs/index.html"
        ],
        "statements": [
          {
            "text": "`docs/index.html` holds the plan's plain static page, titled \"OrganizationPage documents\", so the shared action's check holds on `docs/`.",
            "state": "as-planned"
          },
          {
            "text": "Its four links into the documents are relative; the two that leave the folder, to the site and to the repository, are absolute, as the plan gives them.",
            "state": "as-planned"
          },
          {
            "text": "It holds those links and one line saying what they are, and nothing else.",
            "state": "as-planned"
          }
        ]
      }
    },
    {
      "id": "workflow-checks",
      "group": "Tests",
      "name": "Checks of the workflows and their step bodies",
      "system": "deployment",
      "where": "`.github/workflows/publish-docs.yml`",
      "gap": {
        "kind": "missing",
        "summary": "The change has no code a module test could exercise. Its logic is workflow YAML and shell step bodies, and what it does on the host can only be observed on the real system after it lands.",
        "evidence": [
          "`plan.md` §9 — no module's code changes, so no Gradle suite runs",
          "`plan.md` §9 — the later observations need the live host, the FTP account and the Actions run history"
        ],
        "source": "plan.md §9",
        "link": "plan.md#9-test-plan"
      },
      "options": [
        {
          "id": "gating-then-observations",
          "name": "Gating checks of the step bodies, then observations after the landing",
          "summary": "`actionlint`, the diff scope and the two guard bodies extracted from the committed workflow before the commit; seven observations on the real system after the landing.",
          "verdict": "accepted",
          "why": "The step bodies can be run locally against tables of inputs, and the rest cannot be automated here.",
          "source": "plan.md §9",
          "link": "plan.md#9-test-plan"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "`actionlint` runs on both workflow files, from a release binary in a temporary folder outside the repository.",
            "ref": "plan.md#gating-local-before-committing-nothing-is-committed-as-a-test",
            "excerpt": {
              "ref": "plan.md#gating-local-before-committing-nothing-is-committed-as-a-test",
              "heading": "Gating (local, before committing; nothing is committed as a test)",
              "paragraph": "Each step body below is extracted from the committed `publish-docs.yml` and run in bash, so the file itself is what is exercised; scratch scripts and copies stay outside the repository. A mutant is a scratch copy of the workflow with one change, and the check named for it must fail against it. A mutant that passes means the check is too weak and the change is not ready, and a mutant that fails to apply counts as one that passed.",
              "hash": "11a590a54cde"
            }
          },
          {
            "text": "The target, refusal, marker and confirm step bodies are extracted from the committed workflow and run against the plan's tables of cases, and the workflow's declarative guards are asserted on its text.",
            "ref": "plan.md#gating-local-before-committing-nothing-is-committed-as-a-test",
            "excerpt": {
              "ref": "plan.md#gating-local-before-committing-nothing-is-committed-as-a-test",
              "heading": "Gating (local, before committing; nothing is committed as a test)",
              "paragraph": "Each step body below is extracted from the committed `publish-docs.yml` and run in bash, so the file itself is what is exercised; scratch scripts and copies stay outside the repository. A mutant is a scratch copy of the workflow with one change, and the check named for it must fail against it. A mutant that passes means the check is too weak and the change is not ready, and a mutant that fails to apply counts as one that passed.",
              "hash": "11a590a54cde"
            }
          },
          {
            "text": "Each mutated copy of the workflow must fail the check named for it.",
            "ref": "plan.md#gating-local-before-committing-nothing-is-committed-as-a-test",
            "excerpt": {
              "ref": "plan.md#gating-local-before-committing-nothing-is-committed-as-a-test",
              "heading": "Gating (local, before committing; nothing is committed as a test)",
              "paragraph": "Each step body below is extracted from the committed `publish-docs.yml` and run in bash, so the file itself is what is exercised; scratch scripts and copies stay outside the repository. A mutant is a scratch copy of the workflow with one change, and the check named for it must fail against it. A mutant that passes means the check is too weak and the change is not ready, and a mutant that fails to apply counts as one that passed.",
              "hash": "11a590a54cde"
            }
          },
          {
            "text": "No Gradle suite runs, and nothing is committed as a test.",
            "ref": "plan.md#9-test-plan",
            "excerpt": {
              "ref": "plan.md#9-test-plan",
              "heading": "9. Test plan",
              "paragraph": "No Gradle suite runs. No module's code changes, so no module test belongs to this change; the Component and Deterministic levels have nothing to exercise. A compile is not needed either: no `web`, `server` or `shared` file changes, which `git diff --stat` shows.",
              "hash": "6608d1aa7e04"
            }
          },
          {
            "text": "Ten observations on the real system follow the landing: six close at it and count toward acceptance, and the others close on their own triggers; a refused run is not observed there and rests on the gating checks.",
            "ref": "plan.md#integration-end-to-end-uat",
            "excerpt": {
              "ref": "plan.md#integration-end-to-end-uat",
              "heading": "Integration, End-to-end, UAT",
              "paragraph": "Observations on the real system after landing. They cannot be automated here, because they need the live host, the FTP account and the Actions run history. Results are recorded in a comment on SpartanLaboratories/OrganizationPage#8, with links to the runs; the documents in this folder are committed before the landing, so they cannot carry them.",
              "hash": "10af7f84ae20"
            }
          }
        ],
        "defense": "No `web`, `server` or `shared` file changes, so no module's tests belong to this change, and the Component and Deterministic levels have nothing to exercise.",
        "steps": [
          {
            "id": "9",
            "what": "Run the eight gating checks of the plan's test plan before the first commit, and the `find` over the real `docs/` again immediately before the second.",
            "files": [
              ".github/workflows/deploy-spaceship.yml",
              ".github/workflows/publish-docs.yml"
            ],
            "check": "each check's expected result in the plan's test plan holds",
            "link": "plan.md#gating-local-before-committing-nothing-is-committed-as-a-test"
          }
        ],
        "tests": [
          "L1 gating — `actionlint`, the diff scope, the target check's table, the refusal list's names and symbolic links, the `find` over the real `docs/`, the record and confirm steps' bodies, the declarative guards and the mutated copies",
          "L3 integration, L4b end-to-end, L5 UAT — ten observations on the real system after the landing"
        ],
        "risks": [
          "The observations come after the landing, so the plan's acceptance is only established once it has landed"
        ],
        "source": "plan.md §9",
        "link": "plan.md#9-test-plan"
      },
      "asBuilt": {
        "state": "as-planned",
        "statements": [
          {
            "text": "The gating checks passed, `actionlint` on both workflow files among them.",
            "state": "as-planned"
          },
          {
            "text": "The step bodies' runs and the assertions on the workflow's text are among the gating checks that passed.",
            "state": "as-planned"
          },
          {
            "text": "All 31 mutated copies of the workflow were caught.",
            "state": "as-planned"
          },
          {
            "text": "Nothing was committed as a test: the branch's diff holds no test file and changes no module's code.",
            "state": "as-planned"
          },
          {
            "text": "The ten observations are still to be made: six close at the landing and the others on their own triggers, as planned.",
            "state": "as-planned"
          }
        ]
      }
    },
    {
      "id": "policy-rules",
      "group": "Documents",
      "name": "The deployment rules",
      "system": "deployment",
      "where": "`CLAUDE.md`, `docs/DEPLOYMENT.md`",
      "gap": {
        "kind": "missing",
        "summary": "The written rules hold every change to staging and approval, with no exemption for `docs/`. Publishing `docs/` directly would break rules 1, 2, 3, 5 and 9 as they stand.",
        "evidence": [
          "`CLAUDE.md:13-16` — rules 1 and 2 apply to every change",
          "`docs/DEPLOYMENT.md:12-16` — the same two rules in the full reference"
        ],
        "source": "plan.md §1, requirement 1",
        "link": "plan.md#1-requirements"
      },
      "options": [
        {
          "id": "exempt-docs",
          "name": "Exempt `docs/` in a new rule 10",
          "summary": "Rules 1 and 2 are limited to changes outside `docs/`; rule 10 publishes `docs/` straight to the live site and lifts rules 1, 2, 3, 5 and 9 for that publication.",
          "verdict": "accepted",
          "why": "The interview settled the wording: `docs/` is exempt from the staging and review rules so that the boards update live, and `docs/` changes publish directly to the live site.",
          "source": "plan.md §1, requirement 1; §7.4",
          "link": "plan.md#74-claudemd-changed-deployment-policy-lines-13-27"
        },
        {
          "id": "no-deploy-sentence",
          "name": "Add one sentence that a docs-only push does not deploy",
          "verdict": "declined",
          "why": "`docs/` changes publish directly, so the rule has to state an exemption rather than the absence of a deployment.",
          "source": "interview",
          "link": "plan.md#1-requirements"
        },
        {
          "id": "leave-rules",
          "name": "Leave the rules as written",
          "verdict": "declined",
          "why": "The workflow without the policy text would contradict `CLAUDE.md`.",
          "source": "plan.md §6",
          "link": "plan.md#6-design"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "Rules 1 and 2 in `CLAUDE.md` now apply outside `docs/`.",
            "ref": "plan.md#74-claudemd-changed-deployment-policy-lines-13-27",
            "excerpt": {
              "ref": "plan.md#74-claudemd-changed-deployment-policy-lines-13-27",
              "heading": "7.4 `CLAUDE.md` (changed: deployment policy, lines 13-27)",
              "paragraph": "Replace rules 1 and 2 and add rule 10 after rule 9, with exactly this wording (rules 3-9 untouched):",
              "hash": "5981090e1f27"
            }
          },
          {
            "text": "A new rule 10 publishes `docs/` straight to the live site and lifts rules 1, 2, 3, 5 and 9 for that publication alone.",
            "ref": "plan.md#74-claudemd-changed-deployment-policy-lines-13-27",
            "excerpt": {
              "ref": "plan.md#74-claudemd-changed-deployment-policy-lines-13-27",
              "heading": "7.4 `CLAUDE.md` (changed: deployment policy, lines 13-27)",
              "paragraph": "Replace rules 1 and 2 and add rule 10 after rule 9, with exactly this wording (rules 3-9 untouched):",
              "hash": "5981090e1f27"
            }
          },
          {
            "text": "`docs/DEPLOYMENT.md` states the same three changes in its own policy list.",
            "ref": "plan.md#75-docsdeploymentmd-changed",
            "excerpt": {
              "ref": "plan.md#75-docsdeploymentmd-changed",
              "heading": "7.5 `docs/DEPLOYMENT.md` (changed)",
              "paragraph": "Policy rule 1 becomes: \"Staging first. Every change outside `docs/` goes to staging first and is checked in a browser before it reaches production.\" · Policy rule 2 becomes: \"A person approves production. Outside `docs/`, production only changes after a person explicitly approves it: no automatic, direct or auto-approved production deploys, and no skipping or weakening the approval step.\" · New rule 10 after rule 9: \"`docs/` goes live directly. A push to `main` that changes a file under `docs/` publishes `docs/` straight to the live site, with no staging and no approval, so the boards stay …",
              "hash": "cc3fffd76fc0"
            }
          }
        ],
        "defense": "The exemption covers `docs/` and nothing else: every other change, including the rest of a push that also changes `docs/`, keeps the full path.",
        "steps": [
          {
            "id": "7.4",
            "what": "Replace rules 1 and 2 and add rule 10 in `CLAUDE.md`, with the plan's wording.",
            "files": [
              "CLAUDE.md"
            ],
            "check": "rules 3 to 9 are untouched in the diff",
            "link": "plan.md#74-claudemd-changed-deployment-policy-lines-13-27"
          },
          {
            "id": "7.5",
            "what": "Change policy rules 1 and 2 and add rule 10 in `docs/DEPLOYMENT.md`.",
            "files": [
              "docs/DEPLOYMENT.md"
            ],
            "check": "the three rules read as the plan gives them",
            "link": "plan.md#75-docsdeploymentmd-changed"
          }
        ],
        "tests": [],
        "risks": [
          "A pull request that changes only boards may be merged by the automated version control process without the owner's review, so it goes live with no person looking at it"
        ],
        "source": "plan.md §7.4, §7.5",
        "link": "plan.md#74-claudemd-changed-deployment-policy-lines-13-27"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          "CLAUDE.md",
          "docs/DEPLOYMENT.md"
        ],
        "statements": [
          {
            "text": "Rules 1 and 2 in `CLAUDE.md` now apply outside `docs/`.",
            "state": "as-planned"
          },
          {
            "text": "Rule 10 in `CLAUDE.md` publishes `docs/` straight to the live site and lifts rules 1, 2, 3, 5 and 9 for that publication alone.",
            "state": "as-planned"
          },
          {
            "text": "`docs/DEPLOYMENT.md` states the same three changes in its own policy list.",
            "state": "as-planned"
          }
        ]
      }
    },
    {
      "id": "deployment-reference",
      "group": "Documents",
      "name": "The deployment reference",
      "system": "deployment",
      "where": "`docs/DEPLOYMENT.md`",
      "gap": {
        "kind": "bug",
        "summary": "The reference's manual-run sentence is wrong, and it describes one path where there will be two. It says a manual run on any branch deploys to staging only, but a manual run on `main` also reaches the production job and waits for approval there.",
        "evidence": [
          "`docs/DEPLOYMENT.md:48-50` — the Triggers paragraph",
          "`.github/workflows/deploy-spaceship.yml:167-174` — the `production` job runs for `main`",
          "`docs/DEPLOYMENT.md:76-96` — the hosting table and the rules for folders inside production cover staging alone"
        ],
        "source": "plan.md §7.5",
        "link": "plan.md#75-docsdeploymentmd-changed"
      },
      "options": [
        {
          "id": "correct-manual-run",
          "name": "Correct the sentence with the rest of the Triggers paragraph",
          "verdict": "accepted",
          "why": "The interview settled that the manual-run sentence is corrected in this change.",
          "source": "plan.md §7.5, item 5",
          "link": "plan.md#75-docsdeploymentmd-changed"
        },
        {
          "id": "report-separately",
          "name": "Leave it and report it separately",
          "verdict": "declined",
          "why": "The interview settled that the manual-run sentence is corrected here rather than reported on its own.",
          "source": "interview",
          "link": "plan.md#75-docsdeploymentmd-changed"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "The Triggers paragraph says which pushes start the site deployment and corrects what a manual run does.",
            "ref": "plan.md#75-docsdeploymentmd-changed",
            "excerpt": {
              "ref": "plan.md#75-docsdeploymentmd-changed",
              "heading": "7.5 `docs/DEPLOYMENT.md` (changed)",
              "paragraph": "Policy rule 1 becomes: \"Staging first. Every change outside `docs/` goes to staging first and is checked in a browser before it reaches production.\" · Policy rule 2 becomes: \"A person approves production. Outside `docs/`, production only changes after a person explicitly approves it: no automatic, direct or auto-approved production deploys, and no skipping or weakening the approval step.\" · New rule 10 after rule 9: \"`docs/` goes live directly. A push to `main` that changes a file under `docs/` publishes `docs/` straight to the live site, with no staging and no approval, so the boards stay …",
              "hash": "cc3fffd76fc0"
            }
          },
          {
            "text": "A new Documents workflow subsection covers the publish, its guards, mixed pushes and the silent absence of a run.",
            "ref": "plan.md#75-docsdeploymentmd-changed",
            "excerpt": {
              "ref": "plan.md#75-docsdeploymentmd-changed",
              "heading": "7.5 `docs/DEPLOYMENT.md` (changed)",
              "paragraph": "Policy rule 1 becomes: \"Staging first. Every change outside `docs/` goes to staging first and is checked in a browser before it reaches production.\" · Policy rule 2 becomes: \"A person approves production. Outside `docs/`, production only changes after a person explicitly approves it: no automatic, direct or auto-approved production deploys, and no skipping or weakening the approval step.\" · New rule 10 after rule 9: \"`docs/` goes live directly. A push to `main` that changes a file under `docs/` publishes `docs/` straight to the live site, with no staging and no approval, so the boards stay …",
              "hash": "cc3fffd76fc0"
            }
          },
          {
            "text": "The hosting table gains the documents folder, and the rules for folders inside production cover it.",
            "ref": "plan.md#75-docsdeploymentmd-changed",
            "excerpt": {
              "ref": "plan.md#75-docsdeploymentmd-changed",
              "heading": "7.5 `docs/DEPLOYMENT.md` (changed)",
              "paragraph": "Policy rule 1 becomes: \"Staging first. Every change outside `docs/` goes to staging first and is checked in a browser before it reaches production.\" · Policy rule 2 becomes: \"A person approves production. Outside `docs/`, production only changes after a person explicitly approves it: no automatic, direct or auto-approved production deploys, and no skipping or weakening the approval step.\" · New rule 10 after rule 9: \"`docs/` goes live directly. A push to `main` that changes a file under `docs/` publishes `docs/` straight to the live site, with no staging and no approval, so the boards stay …",
              "hash": "cc3fffd76fc0"
            }
          },
          {
            "text": "The secrets, the operating notes and the deploy mechanism name the documents publish.",
            "ref": "plan.md#75-docsdeploymentmd-changed",
            "excerpt": {
              "ref": "plan.md#75-docsdeploymentmd-changed",
              "heading": "7.5 `docs/DEPLOYMENT.md` (changed)",
              "paragraph": "Policy rule 1 becomes: \"Staging first. Every change outside `docs/` goes to staging first and is checked in a browser before it reaches production.\" · Policy rule 2 becomes: \"A person approves production. Outside `docs/`, production only changes after a person explicitly approves it: no automatic, direct or auto-approved production deploys, and no skipping or weakening the approval step.\" · New rule 10 after rule 9: \"`docs/` goes live directly. A push to `main` that changes a file under `docs/` publishes `docs/` straight to the live site, with no staging and no approval, so the boards stay …",
              "hash": "cc3fffd76fc0"
            }
          }
        ],
        "defense": "A missing run is normal after this change, so the reference has to say so, and the shared-folder rules are what keep a sync from removing what another uploaded.",
        "steps": [
          {
            "id": "7.5",
            "what": "Apply the plan's edits to the rest of `docs/DEPLOYMENT.md`.",
            "files": [
              "docs/DEPLOYMENT.md"
            ],
            "check": "each of the plan's eleven items is present",
            "link": "plan.md#75-docsdeploymentmd-changed"
          }
        ],
        "tests": [],
        "risks": [],
        "source": "plan.md §7.5",
        "link": "plan.md#75-docsdeploymentmd-changed"
      },
      "asBuilt": {
        "state": "as-planned",
        "files": [
          "docs/DEPLOYMENT.md"
        ],
        "statements": [
          {
            "text": "The Triggers paragraph says which pushes start the site deployment, and that a manual run off `main` deploys to staging only while one on `main` also reaches the production job and waits for approval.",
            "state": "as-planned"
          },
          {
            "text": "`### Documents workflow` covers the publish, its three guards, mixed pushes and the silent absence of a run.",
            "state": "as-planned"
          },
          {
            "text": "The hosting table has a Documents row, and the list of folders inside production covers it.",
            "state": "as-planned"
          },
          {
            "text": "The secrets and variables, the operating notes and the deploy mechanism name the documents publish, and the operating notes say `publish-info.json` shows what is live.",
            "state": "as-planned"
          }
        ]
      }
    },
    {
      "id": "readme-changelog",
      "group": "Documents",
      "name": "`README.md` and `CHANGELOG.md`",
      "system": "deployment",
      "where": "`README.md`, `CHANGELOG.md`",
      "gap": {
        "kind": "missing",
        "summary": "The README describes one deployment path, and the repository keeps no `CHANGELOG.md`. It says every change goes to staging first and that the deployment runs on every push to `main`.",
        "evidence": [
          "`README.md:74-76` — every change goes to staging first",
          "`README.md:82` — the deployment runs on every push to `main`",
          "`plan.md` §2 — there is no `CHANGELOG.md`"
        ],
        "source": "plan.md §2",
        "link": "plan.md#2-current-state"
      },
      "options": [
        {
          "id": "documentation-pass",
          "name": "Update the README and create the changelog in the documentation pass",
          "verdict": "accepted",
          "why": "The change adds a workflow, two variables and a policy exemption, so the README moves and the changelog is created with an `Unreleased` entry, as nothing is bumped.",
          "source": "plan.md §5, §7.7",
          "link": "plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit"
        }
      ],
      "verdict": {
        "kind": "build",
        "statements": [
          {
            "text": "The README's deployment section states the exemption, the new workflow and its two variables; its diagram stays.",
            "ref": "plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit",
            "excerpt": {
              "ref": "plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit",
              "heading": "7.7 Documentation pass: `README.md` and `CHANGELOG.md` (commit 2, not part of the implementation commit)",
              "paragraph": "`README.md`:",
              "hash": "8f010e03aee5"
            }
          },
          {
            "text": "A new `CHANGELOG.md` records the change under `Unreleased`.",
            "ref": "plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit",
            "excerpt": {
              "ref": "plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit",
              "heading": "7.7 Documentation pass: `README.md` and `CHANGELOG.md` (commit 2, not part of the implementation commit)",
              "paragraph": "`README.md`:",
              "hash": "8f010e03aee5"
            }
          },
          {
            "text": "Both land in the second commit, after the implementation is done.",
            "ref": "plan.md#11-version-control",
            "excerpt": {
              "ref": "plan.md#11-version-control",
              "heading": "11. Version control",
              "paragraph": "Branch: `build/issue-8-no-deploy-docs-only`. · Commit 1, `ci:` carries `.github/workflows/publish-docs.yml`, the filter in `.github/workflows/deploy-spaceship.yml`, `docs/index.html`, `CLAUDE.md`, `docs/DEPLOYMENT.md` and this plan (`docs/plans/8-docs-only-deploy-skip/plan.md`), so `git log --follow` binds the plan to the implementation. The type is `ci:` because the change is workflow and configuration with no effect on any published artifact. · Commit 2, `docs:` carries the `README.md` and `CHANGELOG.md` deltas of 7.7, written in the documentation pass after the implementation is done, with …",
              "hash": "3d969e94ea1b"
            }
          }
        ],
        "defense": "This is documentation of a change with no published artifact, so it carries no version.",
        "steps": [
          {
            "id": "7.7",
            "what": "Apply the plan's README edits and create `CHANGELOG.md` in the documentation pass.",
            "files": [
              "README.md",
              "CHANGELOG.md"
            ],
            "check": "the README's lines read as the plan gives them",
            "link": "plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit"
          }
        ],
        "tests": [],
        "risks": [],
        "source": "plan.md §7.7",
        "link": "plan.md#77-documentation-pass-readmemd-and-changelogmd-commit-2-not-part-of-the-implementation-commit"
      },
      "asBuilt": {
        "state": "pending"
      }
    },
    {
      "id": "site-deploy-path",
      "group": "Left for later",
      "name": "The production job, the approval gate and the shared action",
      "system": "deployment",
      "where": "`.github/workflows/deploy-spaceship.yml`, `.github/actions/spaceship-deploy/action.yml`, `.github/workflows/ci.yml`",
      "gap": {
        "kind": "risk",
        "summary": "The staging-and-approval path is what every change outside `docs/` keeps. The plan holds it unchanged, apart from the one filter on its trigger.",
        "evidence": [
          "`.github/workflows/deploy-spaceship.yml:167-174` — the `production` job and its required reviewer",
          "`plan.md` §1, requirement 6 — the production job, the approval gate, the shared action and `ci.yml` do not change"
        ],
        "source": "plan.md §1",
        "link": "plan.md#1-requirements"
      },
      "options": [
        {
          "id": "leave-unchanged",
          "name": "Leave them as they are",
          "verdict": "accepted",
          "why": "The documents publish consumes the shared action unchanged, and the site path needs only its one added filter.",
          "source": "plan.md §7.6",
          "link": "plan.md#76-files-not-changed"
        }
      ],
      "verdict": {
        "kind": "leave",
        "statements": [
          {
            "text": "Not changed: the production job, the approval gate, the shared action and `ci.yml`.",
            "ref": "plan.md#76-files-not-changed",
            "excerpt": {
              "ref": "plan.md#76-files-not-changed",
              "heading": "7.6 Files not changed",
              "paragraph": "`.github/actions/spaceship-deploy/action.yml`, `.github/workflows/ci.yml`, the production job and the approval gate in `deploy-spaceship.yml`, and every file under `web/`, `server/`, `shared/` stay as they are. `docs/plans/org-work-board/` and the issue board files in this plan's folder belong to other work and are not touched.",
              "hash": "a6bb1130768b"
            }
          },
          {
            "text": "Not changed: every file under `web/`, `server/` and `shared/`, and the website carries no link to the boards.",
            "ref": "plan.md#4-non-goals",
            "excerpt": {
              "ref": "plan.md#4-non-goals",
              "heading": "4. Non-goals",
              "paragraph": "Serving other repositories' boards. · Pointing the organization work board's links at the served URLs; they stay GitHub URLs until a later change to its template. · A dedicated FTP account confined to the documents folder. · Changing the staging target check's string comparison (SpartanLaboratories/OrganizationPage#9). · Any change to `ci.yml`, the production job, the approval gate or the shared action. · A link from the website to the boards, and any `web`, `server` or `shared` change. · The organization work board in this change: `docs/plans/org-work-board/` first reaches `main` in its own …",
              "hash": "2a82fec7fa13"
            }
          }
        ],
        "defense": "The landing itself is a mixed push, so it starts one full site deployment whose production reviewer step is unchanged.",
        "source": "plan.md §4, §7.6",
        "link": "plan.md#76-files-not-changed"
      },
      "asBuilt": {
        "state": "pending"
      }
    },
    {
      "id": "staging-target-comparison",
      "group": "Left for later",
      "name": "The staging target check's comparison (#9)",
      "system": "deployment",
      "where": "`.github/workflows/deploy-spaceship.yml`",
      "gap": {
        "kind": "bug",
        "summary": "The staging target check compares folder strings. The production folder is configured as `/../../spartanlaboratories.org/`, the same folder as `/spartanlaboratories.org/`, which that comparison does not see.",
        "evidence": [
          "`.github/workflows/deploy-spaceship.yml:105-108` — the staging check compares the two normalized strings",
          "`plan.md` §6 — the documents check resolves paths for this reason"
        ],
        "source": "#9",
        "link": "https://github.com/SpartanLaboratories/OrganizationPage/issues/9"
      },
      "options": [
        {
          "id": "leave-to-9",
          "name": "Leave it to #9",
          "verdict": "accepted",
          "why": "The documents check compares resolved paths and leaves the staging check as it is, so neither issue blocks the other.",
          "source": "plan.md §4, §12",
          "link": "plan.md#4-non-goals"
        },
        {
          "id": "fix-here",
          "name": "Change the staging check in this change",
          "verdict": "declined",
          "why": "It is a non-goal of this plan; #9 carries it.",
          "source": "plan.md §4",
          "link": "plan.md#4-non-goals"
        }
      ],
      "verdict": {
        "kind": "leave",
        "statements": [
          {
            "text": "Not changed: the staging target check's string comparison, which #9 carries.",
            "ref": "plan.md#4-non-goals",
            "excerpt": {
              "ref": "plan.md#4-non-goals",
              "heading": "4. Non-goals",
              "paragraph": "Serving other repositories' boards. · Pointing the organization work board's links at the served URLs; they stay GitHub URLs until a later change to its template. · A dedicated FTP account confined to the documents folder. · Changing the staging target check's string comparison (SpartanLaboratories/OrganizationPage#9). · Any change to `ci.yml`, the production job, the approval gate or the shared action. · A link from the website to the boards, and any `web`, `server` or `shared` change. · The organization work board in this change: `docs/plans/org-work-board/` first reaches `main` in its own …",
              "hash": "2a82fec7fa13"
            }
          }
        ],
        "defense": "The new check is written against resolved paths without touching the old one.",
        "source": "plan.md §4",
        "link": "plan.md#4-non-goals"
      },
      "asBuilt": {
        "state": "pending"
      }
    }
  ],
  "impact": {
    "basis": "plan",
    "summary": "No library artifact or version changes. The live site gains one public folder, `/OrganizationPage/docs/`, mirroring the repository's `docs/`, and everything merged under `docs/` is served from the organization's domain as soon as it lands. The site deployment stops starting for a push that changes only `docs/`, and a file the host would execute now fails the publish on `main`.",
    "none": null,
    "release": {
      "bump": "none",
      "version": null,
      "note": "no published artifact changes, so nothing is bumped or released"
    },
    "downstream": [
      {
        "who": "The live site",
        "kind": "artifact",
        "system": "deployment",
        "effect": "additive",
        "summary": "One new public folder, stored inside the production folder and mirroring `docs/` path for path, with its own publicly readable sync record and a `publish-info.json` naming the commit, run and attempt last published. `/docs/` at the site root stays free, and the production and staging folders are untouched.",
        "link": "consequences.md#published-artifacts"
      },
      {
        "who": "Whoever runs the repository's deployments",
        "kind": "operator",
        "system": "deployment",
        "effect": "behaviour",
        "summary": "A push that changes only `docs/` starts no `OrganizationPage Deploy` run, and a push with nothing under `docs/` starts no publish run; a workflow a push does not match leaves no entry at all in the Actions list. Most landings are mixed pushes, so a board can describe a change before production has it.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "Authors of content under `docs/`",
        "kind": "operator",
        "system": "deployment",
        "effect": "behaviour",
        "summary": "Everything under `docs/`, now and later, is public as soon as it lands and may be indexed by search engines. The repository is already public, so nothing new is disclosed, but nothing sensitive can be committed there. A pull request changing only generated boards can go live with no person looking at it.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "The organization work board",
        "kind": "repository",
        "system": "deployment",
        "effect": "behaviour",
        "summary": "It is committed to this repository from other repositories' landings, and each of those commits now publishes it rather than starting a site deployment.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "The API reference and assets of #7",
        "kind": "system",
        "system": "deployment",
        "effect": "none",
        "summary": "Its API reference at `/docs/api/` is unaffected. The assets it adds under `docs/brand/` and `docs/dokka/` will be served under `/OrganizationPage/docs/` as soon as they land.",
        "link": "consequences.md#neighbouring-issues"
      }
    ],
    "adaptation": [
      {
        "who": "The boards and documents generated under `docs/`",
        "system": "deployment",
        "need": "required",
        "summary": "They have to keep clear of the names the publish refuses (`.php`, `.htaccess`, `.cgi`, `.fcgi` and the rest of the list in `publish-docs.yml`), which now fail the publish on `main`.",
        "link": "consequences.md#blast-radius"
      },
      {
        "who": "The site's build output",
        "system": "deployment",
        "need": "required",
        "summary": "It must never contain a top-level `OrganizationPage` or `staging` entry: a later build without it would make production's sync remove that whole folder.",
        "link": "consequences.md#blast-radius"
      }
    ],
    "api": [
      {
        "surface": "Repository variable `SPACESHIP_DOCS_REMOTE_DIR`",
        "system": "deployment",
        "change": "added",
        "tier": null,
        "summary": "Optional. The documents folder as the FTP login sees it; it must be strictly inside the production folder and clear of staging. Configuration only: no published API changes.",
        "link": "plan.md#6-design"
      },
      {
        "surface": "Repository variable `SPACESHIP_DOCS_URL`",
        "system": "deployment",
        "change": "added",
        "tier": null,
        "summary": "Optional. The documents address, shown in the run summary and used to confirm the upload. Configuration only: no published API changes.",
        "link": "plan.md#6-design"
      }
    ],
    "conversion": [],
    "changes": [],
    "source": "consequences.md",
    "link": "consequences.md#blast-radius"
  },
  "tests": {
    "base": "21c23eb",
    "updated": "2026-11-09T01:13:51Z",
    "added": [],
    "amended": []
  },
  "roadmap": null,
  "followUps": [
    {
      "issue": 9,
      "note": "The staging target check's string comparison. The documents check resolves paths and leaves it as it is; neither issue blocks the other."
    },
    {
      "name": "A dedicated FTP account confined to `/OrganizationPage/docs/`",
      "note": "The publish reuses the account that can write the whole site. A confined account needs the account created on the host, its own secrets and the target check changed to suit a login whose root is that folder."
    },
    {
      "name": "The organization work board's links at the served URLs",
      "note": "They stay GitHub URLs until the board's template changes, which is outside this repository."
    },
    {
      "name": "Sharing the production and staging folder defaults",
      "note": "Both workflow files repeat them today; shared if a third workflow needs them."
    },
    {
      "name": "A regression check for the guards",
      "note": "The target check, the refusal list and the declarative guards are tested once, by checks that are not committed. Committing them needs a CI job, which this change leaves out because `ci.yml` does not change."
    }
  ],
  "documents": [
    {
      "label": "Issue #8",
      "path": "https://github.com/SpartanLaboratories/OrganizationPage/issues/8",
      "note": "the report and its proposed filter"
    },
    {
      "label": "Research",
      "path": "research/README.md",
      "note": "the questions, the verification results and the summary; findings in `github-path-filters.md`, `ftp-deploy-nested-sync.md` and `host-executable-files.md`"
    },
    {
      "label": "plan.md",
      "path": "plan.md",
      "note": "the implementer's spec: requirements, design, each file's changes and the test plan"
    },
    {
      "label": "Consequences",
      "path": "consequences.md",
      "note": "what becomes public, what may no longer be added under `docs/`, the neighbouring issues and the follow-ups"
    },
    {
      "label": "Deployment reference",
      "path": "../../DEPLOYMENT.md",
      "note": "the rules this change amends"
    }
  ],
  "notes": {
    "corrections": [
      {
        "what": "The upload Row's third Verdict statement, its defence and its step named a request for the landing page after the upload. The plan re-pass after Quality Review 1 replaced that check with a comparison of the served `publish-info.json`, and they now read as the plan does.",
        "when": "2026-11-09T01:13:51Z"
      },
      {
        "what": "The checks Row counted two step bodies, five gating checks and seven observations. The plan re-pass after Quality Review 1 widened them to four step bodies, the declarative guards, the mutated copies, eight gating checks and ten observations, and the Row now reads as the plan does; the mutated copies are a Verdict statement of their own.",
        "when": "2026-11-09T01:13:51Z"
      },
      {
        "what": "The tests named on the refusal and landing-page Rows now read as the re-passed test plan does.",
        "when": "2026-11-09T01:13:51Z"
      },
      {
        "what": "The plan re-pass after Quality Review 2 added the refusal of symbolic links. The refusal Row gains a Verdict statement for it, and its defence, check, tests and risks now read as the plan does.",
        "when": "2026-11-09T01:38:23Z"
      },
      {
        "what": "The plan re-pass after Quality Review 2 settled which observations close at the landing and ran the check over the real `docs/` again before the second commit. The checks Row's observations statement, step and tests now read as the plan does.",
        "when": "2026-11-09T01:38:23Z"
      },
      {
        "what": "The deployment rules Row's risk named generated boards; the plan re-pass after Quality Review 2 and `docs/DEPLOYMENT.md` say only boards, and the risk now reads as they do.",
        "when": "2026-11-09T01:38:23Z"
      }
    ]
  },
  "links": {
    "workBoard": "../index.html",
    "repoBoard": "../../dashboards/index.html"
  }
}
);
