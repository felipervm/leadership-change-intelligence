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
## Presentation and interpretation

The portfolio uses an independent slate-and-sage identity, an original CSS hero and an original SVG verification-flow diagram. No Leadership Connect logos, screenshots or image assets are included. Rubik and Mulish are served by Google Fonts, with system fallbacks. The chapter navigation retains inspiration from Nick Ho Motorsports.

A 30-second executive brief distinguishes the four-appointment FDA main case (12 verification tasks) from the separate eight-member USPSTF event-pattern check (not part of that queue). The proposed operational decision follows the queue: classify the change before choosing checks, preserve sources and leave unsupported dates unknown.

The queue compares ingestion order with an explicitly editorial heuristic. No review-time reduction, error reduction or validated ranking accuracy is established. The proposal requires controlled operational evaluation.

The static site uses semantic HTML, CSS and vanilla JavaScript; analysis remains Python. The native modal menu, keyboard-accessible method tabs, reduced-motion support and print layout are retained. `python src/build.py` synchronizes the root and `site/` entry points after refreshing the embedded dataset.
