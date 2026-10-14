# The Ripple Effect

**When one leadership change affects more than one data record.**  
Independent Data Operations research case study by Felipe Mattos.

## [Open the interactive FDA case](https://felipervm.github.io/leadership-change-intelligence/)

> This URL will work **only after** the GitHub repository is created and GitHub Pages is enabled. It is not a live link yet.

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
- `site/index.html`: self-contained interactive visualization of the FDA case
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