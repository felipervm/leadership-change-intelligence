# The Ripple Effect

**When one leadership change affects more than one data record.**  
Independent Data Operations research case study by Felipe Mattos.

## [Open the interactive FDA case](https://felipervm.github.io/leadership-change-intelligence/)

The repository includes a root entry point and a `site/` entry point for GitHub Pages.

## What the work investigates

How should a government leadership intelligence data team distinguish an *acting-to-director transition*, a *newly created office*, and a *new membership appointment*? What additional source verification is needed before updating customer-visible profiles or organizational relationships?

### Two independently researched case types

| Public announcement | Documented events | Key challenge |
|---|---:|---|
| FDA leadership selections — Sep 8, 2026 | 3 acting → director transitions + 1 new role | Detect role qualifier changes without pretending to know the effective start date |
| USPSTF membership additions — Sep 17, 2026 | 8 announced additions, including one Chair | Avoid inventing departures, replacements or formal service start dates |

The FDA case has **four dated primary sources**; the USPSTF case currently has **one primary announcement** and therefore does not establish independent corroboration. These are **12 announced appointments across two event families**, not 12 validated historical transitions.

## Files
- `data/events.json`: FDA source-linked research case
- `data/external_validation.json`: USPSTF event-pattern test with eight named appointees
- `src/build.py`: 12 transparent FDA verification tasks and illustrative queue rankings
- `src/cross_case.py`: validate source references and compare event families
- `site/index.html`, `site/styles.css`, `site/app.js`: interactive FDA case and editorial portfolio experience
- `site/case.json`, `site/cross_case.json`: generated reproducible analysis
- `docs/decision_brief.md`: source links, findings, caveats and operating proposal
- `tests/`: automated integrity tests

## Run locally

```bash
python src/build.py
python src/cross_case.py
python -m unittest discover -s tests -v
cd site && python -m http.server 8000
```

Then open http://localhost:8000.

## Proposed operational value
A data-quality workflow should model **typed changes**, preserve appointment qualifiers and source provenance, and distinguish **unknown** dates from missing records. The project illustrates that reasoning, without alleging unverified errors in Leadership Connect data or claiming measured ROI.

## Limitations

- No access to Leadership Connect's internal systems.
- No measured time savings, classifier precision/recall, or statistically representative event sample.
- FDA UI queue scores are explanatory heuristics, not a calibrated prioritization model.
- The live FDA organizational chart is mutable and not an immutable historic snapshot.
- No production deployment or ongoing monitoring.
- This project is not affiliated with or endorsed by Leadership Connect, HHS, FDA or USPSTF.

**Created by Felipe Mattos.**
## Interactive research story

The default reading path now has five moments: **Signal → Discovery → Decision → Evidence → Takeaway**. It leads with the three documented Acting Director → Director changes while treating the fourth FDA selection as a distinct newly created role.

- **Before / After:** the same three identity rows stay in place while the appointment qualifier and corresponding official calendar citation change. Observation weeks are not presented as effective appointment dates.
- **Decision explorer:** keyboard-accessible tabs switch between a status change, a newly created role and a separate USPSTF membership addition. Each state shows only its checks, a proposed review record, its evidence and unresolved fields.
- **Evidence trail:** four FDA records and the separate USPSTF announcement have expandable source notes. The mutable organizational-chart caveat remains visible and is explained in its document record.
- **Progressive disclosure:** the full 12-task FDA queue and its editorial ranking remain available under “Inspect the FDA verification exercise.” Neither ordering is a validated performance result. Full methodology and source caveats remain in `docs/decision_brief.md` and the JSON datasets.
- **Original visuals:** the hero depicts verification dependencies, not organizational reporting lines; state-specific SVGs show the corresponding event pattern. Motion is decorative to the explanation, never required, and disabled under `prefers-reduced-motion`.

The site uses deep navy / charcoal / restrained cyan, Rubik and Mulish, semantic HTML, responsive CSS and vanilla JavaScript. No framework, package installation, analytics or external data API is required. Google Fonts is optional; readable system fallbacks are provided.

`python src/build.py` refreshes **both** embedded research datasets from source and synchronizes the root GitHub Pages entry point with `site/index.html`, rewriting only local asset paths. `python src/cross_case.py` retains the separate comparative analysis. Both root and `site/` work on a static host.

## Validation

Run `python -m unittest discover -s tests -v` and `node --check site/app.js`. Publishing tests cover source-payload synchronization, safe JSON embedding, idempotent regeneration and root asset paths in addition to the original research-integrity checks. Manual browser validation covers observation toggles, three decision states, source disclosures, the optional queue, keyboard controls, navigation and responsive layouts.
