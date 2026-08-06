# Scope Partition Analysis - CR-4UENTES-0001

## Feature

The active feature is `multi-solution-scope-partition`.

This feature separates control-plane governance scope from product solution
scope. SST remains a logical solution, not the global scope for every repository.

## Current Decision

- `sst` remains the SST solution.
- `4uentes` owns public 4uentes assets such as `4uentes-portfolio`.
- Future Fulbito work should enter as `solutions/fulbito.yaml` and its own
  service catalog entries, not as SST scope.
- Shared services can be referenced by multiple solutions without moving their
  canonical identity into one solution.

## Portfolio Scope

`4uentes-portfolio` is scoped to:

- professional public presentation;
- user work-history narrative;
- project and evidence visibility;
- certificates, CV and contact paths;
- future curated evidence enrichment if approved.

It is not scoped to:

- SST roadmap ownership;
- SST runtime or deployment assumptions;
- backend, BFF or auth ownership;
- automatic runtime GitHub or LinkedIn scraping;
- control-plane governance rules.

## Fulbito Implication

Fulbito can be managed by the same control-plane without overloading it if it
enters as a separate logical solution with separate services, requests, evidence
and owner docs.

The control-plane overload risk is scope mixing, not solution count.

## Next Work

The next decision is whether to open a child-repo mutation CR for
`4uentes-portfolio` owner documentation. That follow-up would be separate from
this control-plane-only scope partition.
