# Jira Tool Schema Summary

## Estado

- Fecha: 2026-07-04
- Request: CR-SST-0098
- Escritura Jira: no
- Herramientas requeridas observadas: 5/5

## Herramientas

### getJiraIssue

```json
{
  "type": "object",
  "properties": {
    "cloudId": {
      "type": "string",
      "description": "Cloud ID (UUID or site URL)"
    },
    "issueIdOrKey": {
      "type": "string",
      "description": "Issue ID or key (e.g., PROJ-123 or 10000)"
    },
    "fields": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Issue fields to return. When omitted or empty, defaults to: summary, description, status, issuetype, priority, labels, components, assignee, reporter, created, updated, resolution, project. Pass \"*all\" to return every field (including custom fields). Include \"comment\" to fetch issue comments in fields.comment.comments."
    },
    "fieldsByKeys": {
      "type": "boolean",
      "description": "Whether fields in the request are referenced by field keys instead of IDs."
    },
    "expand": {
      "type": "string",
      "description": "Additional issue details to expand in the response (for example, renderedFields or names)."
    },
    "properties": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Issue property keys to include in the response."
    },
    "updateHistory": {
      "type": "boolean",
      "description": "Whether to update the user's recently viewed projects/history for this issue request."
    },
    "failFast": {
      "type": "boolean",
      "description": "Whether to fail quickly when some fields cannot be loaded instead of partially returning data."
    },
    "responseContentFormat": {
      "type": "string",
      "enum": [
        "markdown",
        "adf"
      ],
      "description": "Content format for body content. Use \"markdown\" for simplified plain text. Use \"adf\" (Atlassian Document Format, JSON) for full programmatic fidelity. Defaults vary by tool when omitted."
    }
  },
  "required": [
    "cloudId",
    "issueIdOrKey"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### editJiraIssue

```json
{
  "type": "object",
  "properties": {
    "cloudId": {
      "type": "string",
      "description": "Cloud ID (UUID or site URL)"
    },
    "issueIdOrKey": {
      "type": "string",
      "description": "Issue ID or key (e.g., PROJ-123 or 10000)"
    },
    "fields": {
      "type": "object",
      "additionalProperties": {},
      "description": "Fields to set, keyed by field name or customfield_* ID. To CLEAR a field, pass an explicit null, e.g. { \"resolution\": null }. Clearing the resolution is the fix when a reopened issue is blocked from transitioning because it still has a Resolution set."
    },
    "contentFormat": {
      "type": "string",
      "enum": [
        "markdown",
        "adf"
      ],
      "description": "Content format for body content. Use \"markdown\" for simplified plain text. Use \"adf\" (Atlassian Document Format, JSON) for full programmatic fidelity. Defaults vary by tool when omitted."
    },
    "responseContentFormat": {
      "type": "string",
      "enum": [
        "markdown",
        "adf"
      ],
      "description": "Content format for body content. Use \"markdown\" for simplified plain text. Use \"adf\" (Atlassian Document Format, JSON) for full programmatic fidelity. Defaults vary by tool when omitted."
    }
  },
  "required": [
    "cloudId",
    "issueIdOrKey",
    "fields"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### getTransitionsForJiraIssue

```json
{
  "type": "object",
  "properties": {
    "cloudId": {
      "type": "string",
      "description": "Cloud ID (UUID or site URL)"
    },
    "issueIdOrKey": {
      "type": "string",
      "description": "Issue ID or key (e.g., PROJ-123 or 10000)"
    },
    "expand": {
      "type": "string"
    },
    "transitionId": {
      "type": "string"
    },
    "skipRemoteOnlyCondition": {
      "type": "boolean"
    },
    "includeUnavailableTransitions": {
      "type": "boolean"
    },
    "sortByOpsBarAndStatus": {
      "type": "boolean"
    }
  },
  "required": [
    "cloudId",
    "issueIdOrKey"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### addCommentToJiraIssue

```json
{
  "type": "object",
  "properties": {
    "cloudId": {
      "type": "string",
      "description": "Cloud ID (UUID or site URL)"
    },
    "issueIdOrKey": {
      "type": "string",
      "description": "Issue ID or key (e.g., PROJ-123 or 10000)"
    },
    "commentBody": {
      "type": "string",
      "description": "Comment body"
    },
    "commentVisibility": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "group",
            "role"
          ]
        },
        "value": {
          "type": "string"
        }
      },
      "required": [
        "type",
        "value"
      ],
      "additionalProperties": false
    },
    "contentFormat": {
      "type": "string",
      "enum": [
        "markdown",
        "adf"
      ],
      "description": "Content format for body content. Use \"markdown\" for simplified plain text. Use \"adf\" (Atlassian Document Format, JSON) for full programmatic fidelity. Defaults vary by tool when omitted."
    },
    "responseContentFormat": {
      "type": "string",
      "enum": [
        "markdown",
        "adf"
      ],
      "description": "Content format for body content. Use \"markdown\" for simplified plain text. Use \"adf\" (Atlassian Document Format, JSON) for full programmatic fidelity. Defaults vary by tool when omitted."
    },
    "commentId": {
      "type": "string",
      "maxLength": 18,
      "description": "ID of an existing comment to update. If omitted, a new comment is added."
    }
  },
  "required": [
    "cloudId",
    "issueIdOrKey",
    "commentBody"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### transitionJiraIssue

```json
{
  "type": "object",
  "properties": {
    "cloudId": {
      "type": "string",
      "description": "Cloud ID (UUID or site URL)"
    },
    "issueIdOrKey": {
      "type": "string",
      "description": "Issue ID or key (e.g., PROJ-123 or 10000)"
    },
    "transition": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        }
      },
      "required": [
        "id"
      ],
      "additionalProperties": false
    },
    "fields": {
      "type": "object",
      "additionalProperties": {}
    },
    "update": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "object",
          "additionalProperties": {}
        }
      }
    },
    "historyMetadata": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "descriptionKey": {
          "type": "string"
        },
        "activityDescription": {
          "type": "string"
        },
        "activityDescriptionKey": {
          "type": "string"
        },
        "emailDescription": {
          "type": "string"
        },
        "emailDescriptionKey": {
          "type": "string"
        },
        "actor": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "displayName": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "generator": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "displayName": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "cause": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "displayName": {
              "type": "string"
            },
            "type": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        "extraData": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "cloudId",
    "issueIdOrKey",
    "transition"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

