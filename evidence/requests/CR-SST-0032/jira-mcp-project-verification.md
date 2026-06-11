# Verificacion Read-Only Jira MCP

## Estado

- Fecha: 2026-06-05
- Request: CR-SST-0032
- Modo: connect
- Resultado: PARTIAL_PASS
- Config source: `environments/local/jira-mcp.local.example.yaml`
- Server URL: `https://mcp.atlassian.com/v1/mcp/authv2`
- Jira board: `SST-Team`
- Project key esperado: `SST`
- Confluence space key esperado: `SST`
- Issue type asumido: `Tarea`
- Operaciones de escritura: no

## Recursos Atlassian Accesibles

- `recurso-atlassian-1` cloudId: `[cloudId-redacted]`

## Resultado De Proyecto

- Jira project key visible: si
- Confluence space key visible: no

## Tools Descubiertas

- `atlassianUserInfo`: Get current user info
- `getAccessibleAtlassianResources`: Get cloudId to make tool calls. When a link is provided (e.g. [jira-site-redacted]), try passing the site hostname (e.g. [jira-site-redacted]) as cloudId to other tools first; if that fails, use this tool to list accessible resources.
- `getConfluencePage`: Get a Confluence page or blog post by ID, including body content.
- `searchConfluenceUsingCql`: Search Confluence content (pages, blog posts, comments, attachments) using CQL (Confluence Query Language). CQL is specific to Confluence and is not interchangeable with JQL.
- `getConfluenceSpaces`: Get spaces
- `getPagesInConfluenceSpace`: Get pages or blog posts in a space
- `getConfluencePageFooterComments`: Get footer comments for a page or blog post
- `getConfluencePageInlineComments`: Get inline comments for a page or blog post
- `getConfluenceCommentChildren`: Get reply(child) comments for a comment
- `getConfluencePageDescendants`: Get child pages of specified page
- `createConfluencePage`: Create a Confluence page or blog post
- `updateConfluencePage`: Update a Confluence page or blog post
- `createConfluenceFooterComment`: Create a footer comment on a page or blog post
- `createConfluenceInlineComment`: Create an inline comment on specific text in a page or blog post. For top-level comments, provide pageId and inlineCommentProperties (text selection + match counts). For replies, provide parentCommentId only (no pageId or inlineCommentProperties). You must first fetch the page content (e.g. using getConfluencePage) to find the exact text and count how many times it appears. Incorrect or missing inlineCommentProperties can result in a 400 error from the Confluence API.
- `getJiraIssue`: Get issue details
- `editJiraIssue`: Update issue
- `createJiraIssue`: Create a Jira issue. Use additional_fields to set any Jira field that does not have its own parameter (e.g. custom fields, priority, components).
- `getTransitionsForJiraIssue`: Get transitions
- `getJiraIssueRemoteIssueLinks`: Get remote links
- `getVisibleJiraProjects`: Get projects
- `getJiraProjectIssueTypesMetadata`: Get issue types
- `getJiraIssueTypeMetaWithFields`: Get field metadata
- `addCommentToJiraIssue`: Add or update a comment on a Jira issue
- `transitionJiraIssue`: Transition issue status
- `searchJiraIssuesUsingJql`: Search issues with JQL
- `lookupJiraAccountId`: Lookup user IDs
- `addWorklogToJiraIssue`: Add or update a worklog on a Jira issue. When worklogId is provided, updates that worklog;
- `getIssueLinkTypes`: Get available Jira issue link types (e.g. Blocks, Duplicate, Clones, Relates). For createIssueLink: inwardIssue = blocker, outwardIssue = blocked (e.g. "A is blocked by B" → inwardIssue: B, outwardIssue: A).
- `createIssueLink`: Create a link between two Jira issues. For directional link types (e.g. Blocks): inwardIssue = issue that blocks, outwardIssue = issue that is blocked (e.g. "A is blocked by B" → inwardIssue: B, outwardIssue: A). Use getIssueLinkTypes if link type is unknown.
- `search`: Search Jira and Confluence using Rovo Search, ALWAYS use this tool to search for Jira and Confluence content unless the word CQL or JQL is used in the context
- `fetch`: Get details of a Jira issue or Confluence page by ARI (Atlassian Resource Identifier), if the id is not an ARI, then use a different tool to fetch the content

## Notas

- Tool usada para proyectos Jira: getVisibleJiraProjects
- Project key SST visible en recurso recurso-atlassian-1.
- Tool usada para espacios Confluence: getConfluenceSpaces

## Errores

- ninguno

## Boundary

- No se crean Jira issues.
- No se editan Jira issues.
- No se comentan Jira issues.
- No se transicionan Jira issues.
- No se registran tokens, cookies ni secretos.
