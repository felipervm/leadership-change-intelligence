# Decision brief — The Ripple Effect v3

## Executive question
When an official announcement names government leaders, what changed exactly, what is verifiable today, and which dependent fields should be reviewed before a data team updates customer-facing records?

## Confirmed observations
**Case A — FDA, September 8, 2026 (4 selections).** The HHS announcement names Michael Davis, Karim Mikhail, and Bret Koplow as center directors after serving as Acting Directors, and describes a newly created Deputy Commissioner for Technology and AI position for Jared Seehafer. FDA's dated public calendars confirm the three Acting Director titles in Aug 30–Sep 5 and Director titles in Sep 20–26. This establishes a status transition window, **not an independently proven effective date**.

**Case B — U.S. Preventive Services Task Force, September 17, 2026 (8 named additions).** HHS announces eight incoming members, including Seth J. Corey as Chair. This document supports new membership associations and a chair qualifier; it does **not** establish each appointee's formal start date, predecessor, or whether existing member records have been removed.

**Across both announcements:** 12 people/appointment mentions, two distinct event families, with a total of five official source documents in the study (four FDA sources and one HHS Task Force announcement). The count is an illustrative sample, not a statistically representative dataset.

## Operational finding
A naïve **name + organization** comparison may flag new members but miss three status changes within unchanged person/organization pairs. A naïve **everything is a replacement** assumption could incorrectly mark Task Force predecessors or vacancies where the announcement only describes additions.

## Proposed operating procedure
1. Parse the source into a typed event: `appointment_status_change`, `new_role`, or `membership_addition`.
2. Record the original claim, the source's publication/reporting date, and the person's identity; store *unknown* for start/end dates not substantiated.
3. Generate verification tasks conditional on event type. For status changes, compare old/new appointment qualifiers. For additions, check person-to-body membership, chair roles and incumbent state separately.
4. Flag claims supported by a single announcement separately from those corroborated by an independent later dated source.
5. Send higher-risk ambiguities to human review, preserving a source trail and avoiding a fabricated update.

## How to interpret the prototype
The interactive FDA queue ranks 12 proposed checks using **editorial, noncalibrated** scores. The second event is an **out-of-sample event-type check** stored in `data/external_validation.json`; it is not counted in the FDA UI's 12 tasks. There is no evidence of a defect in Leadership Connect products, measured detection accuracy or saved review hours.

## Next validation, if pursuing a production hypothesis
Take a preregistered sample of 50–100 changes drawn from at least 3 agencies, double-label reference changes, compare exact record diffs with title-only checks, then measure analyst time and missed critical changes under equivalent workloads. Keep explicit disagreements and independent gold-review labels.

## Source links
- FDA/HHS Sept 8 announcement: https://www.hhs.gov/press-room/hhs-announces-key-fda-leadership-selections.html
- FDA Aug 30–Sep 5 calendar: https://www.fda.gov/news-events/public-calendar-meetings-fda-officials/public-calendar-august-30-september-5-2026
- FDA Sept 20–26 calendar: https://www.fda.gov/news-events/public-calendar-meetings-fda-officials/public-calendar-september-20-26-2026
- FDA live organizational chart (mutable): https://www.fda.gov/about-fda/fda-organization-charts/fda-overview-organization-chart-text-version
- HHS Sept 17 Task Force appointments: https://www.hhs.gov/press-room/secretary-kennedy-announces-new-us-preventive-services-task-force-members.html

This work is an independent public-source case study, not affiliated with Leadership Connect or any U.S. agency.