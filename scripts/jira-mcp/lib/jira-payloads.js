const BASE_LABELS = ['ards-sdd', 'control-plane', 'feature-state', 'not-done'];

function buildIssuePayloads(states, config) {
  return states.map((state) => {
    const priority = priorityForStatus(state.status);
    return {
      stateId: state.id,
      summary: summaryForState(state),
      issueType: config.jira.issueType,
      projectKey: config.jira.projectKey,
      boardName: config.jira.boardName,
      priority,
      labels: [...BASE_LABELS, state.status],
      description: descriptionForState(state, config),
      sourceFile: state.file,
      rawState: state,
    };
  });
}

function summaryForState(state) {
  const summaries = {
    'sst-tags-governance': '[SST][feature-state] Cerrar gaps runtime-partial de SST Tags Governance',
    robots: '[SST][feature-state] Formalizar ownership runtime-partial de SST Robots',
    'learning-content-tags': '[SST][feature-state] Completar ruta runtime de SST Learning Content Tags',
    'sst-tag-prefix-engine': '[SST][feature-state] Promover SST Tag Prefix Engine de POC a boundary runtime',
    'sst-chatbot': '[SST][feature-state] Seleccionar transporte runtime para handoff SST Chatbot',
    'document-agent': '[SST][feature-state] Formalizar evidencia de SST Document Agent Workflows',
    'ards-sdd-policy-unification': '[SST][feature-state] Completar handoff y adopcion de ARDS/SDD Policy Unification',
    'dictionary-tags': '[SST][feature-state] Completar validacion live y cierre de gobernanza de SST Dictionary Tags',
    'cluster-publication-ngrok-domain': '[SST][feature-state] Cerrar gaps release-readiness de Cluster publication',
  };

  return summaries[state.id] || `[SST][feature-state] Avanzar ${state.title}`;
}

function priorityForStatus(status) {
  if (status === 'runtime-partial') return 'High';
  if (status === 'implemented-local' || status === 'ards-documented') return 'Medium';
  return 'Low-Medium';
}

function descriptionForState(state, config) {
  const syncProcessId = config && config.evidence && config.evidence.requestId ? config.evidence.requestId : 'TODO';
  return [
    'Proceso de sincronizacion:',
    `- ${syncProcessId}`,
    '',
    'Procesos origen:',
    ...bulletOrNone(state.requestIds),
    '',
    `Estado actual: ${state.status}.`,
    '',
    'Objetivo:',
    'Avanzar esta funcionalidad desde el read-model del control-plane y cerrar los gaps abiertos mediante el lifecycle aprobado.',
    '',
    'Gaps abiertos:',
    ...bulletOrNone(state.openGaps),
    '',
    'State id:',
    `- ${state.id}`,
    '',
    'Servicios afectados:',
    ...bulletOrNone(state.affectedServices),
    '',
    'Request ids relacionados:',
    ...bulletOrNone(state.requestIds),
    '',
    'Fuente control-plane:',
    `- ${state.file}`,
    '',
    'Evidence refs:',
    ...bulletOrNone(state.evidenceRefs),
    '',
    'Validation refs:',
    ...bulletOrNone(state.validationRefs),
    '',
    'Criterio de cierre esperado:',
    '- La decision o implementacion pendiente queda registrada en evidencia.',
    '- Los cambios en repos funcionales, si hacen falta, entran por request aprobado.',
    '- El feature_state se actualiza solo cuando la evidencia soporte una transicion de estado.',
  ].join('\n');
}

function bulletOrNone(items) {
  if (!items || items.length === 0) return ['- ninguno'];
  return items.map((item) => `- ${item}`);
}

module.exports = {
  buildIssuePayloads,
};
