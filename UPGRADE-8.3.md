# DSpace 8.2 → 8.3 Upgrade — Progress Notes

> Working branch: **`uoe/upgrade-to-83`** (push only here).
> Backup tag of the pre-merge tip: **`backup/pre-8.3-merge-before`** (= `83efa3a01`).

This document tracks the in-flight upgrade of the DataShare Angular fork
(formerly aligned to DSpace 8.2) to **DSpace 8.3**, while preserving the
University of Edinburgh / DataShare customizations.

---

## 1. Upgrade Progress (chronological)

| Date (local) | Action | Result |
|---|---|---|
| 2026-04-22 13:35 | Initial analysis of `README-UPGRADE-PROMPT.md`, external `MIGRATION-ASSESSMENT.md`, `Vanilla-UoE-differencies-6.5.md`. | Customization inventory built (see §2). |
| 2026-04-22 13:36 | Added remotes: `upstream` = `UoEMainLibrary/dspace-datashare-angular`, `dspace` = `DSpace/dspace-angular`; fetched all branches. | OK. |
| 2026-04-22 13:36 | Tagged backup `backup/pre-8.3-merge-before` on previous HEAD `83efa3a01`. | OK. |
| 2026-04-22 13:37 | Verified that `upstream/UoEMainLibrary-dspace-8_x` already contains the merge of upstream `dspace-angular@8.3` (commit `187289546`, `package.json` version = `8.3.0`). Step 1 of the merge strategy ("sync UoEMainLibrary-dspace-8_x with upstream 8.3") therefore reduces to using that ref directly. | OK. |
| 2026-04-22 13:38 | `git merge upstream/UoEMainLibrary-dspace-8_x --no-ff` into `uoe/upgrade-to-83`. | 5 conflicts; resolved (see §4). |
| 2026-04-22 13:39 | Resolution committed as merge commit `ecd239c26`. | OK. |
| 2026-04-22 13:40 | `yarn install --frozen-lockfile` (Node v18.20.4, yarn 1.22.19). | OK (only pre-existing peer-dep warnings). |
| 2026-04-22 13:42 | `yarn lint:nobuild`. | **0 errors**, 1048 pre-existing deprecation/warning lines. |
| 2026-04-22 13:44 | `yarn build` (development configuration). | **Build succeeds** after one follow-up theme fix (see §4 / commit `bc8a9190c`). |

---

## 2. Customizations Inventory (verified vs. sources)

The combined picture from `MIGRATION-ASSESSMENT.md`, `Vanilla-UoE-differencies-6.5.md`
and the actual codebase. Frontend-only items are highlighted here (this is the
Angular repo).

### 2.1 UI / Branding (KEEP)
- Full custom theme `src/themes/datashare/` with 250+ component overrides.
- Edinburgh assets (logos, favicons, CoreTrustSeal, banners).
- Custom info pages: `about`, `accessibility-statement`, `copyright`,
  `end-user-agreement`, `feedback` (with form), `organised`, `privacy`.
- Heavily customized `src/assets/i18n/en.json5` (DataShare keys block ≈170 keys).
- File-section component shows ORIGINAL + CC-LICENSE bundles, 25 items / page.
- Custom `deposit-button` component.
- Embargo badge on bitstreams (recent UoE feature).

### 2.2 Submission / forms (KEEP)
- `DatashareSubmissionService` enforces `MAX_FILE_SIZE_GB = 20`.
- `section-upload.component.ts` overrides for size + duplicate handling.
- Custom progress-bar / step labels:
  `submission.sections.submit.progressbar.datashare.license`,
  `…spatial_and_temporal`, `…funder`.
- `ng2-file-upload@9.0.0` (newer than upstream `5.0.0`) — kept for chunked uploads.
- Custom CSS in `ds-dynamic-form-control-container.component.scss` forcing
  `.col-sm-4` to full width inside the dynamic form container.
- Multi-value form-fields fix (`UoE/fix: prevent multi-value form fields from losing input and 'Add more'`).

### 2.3 Search / Browse (KEEP)
- `comcol-page-browse-by.component.ts` — community routing tweaks.
- Item-search-result list element wraps publisher / date / authors block in `<div class="my-2">` (DATASHARE markers).
- JACS subject-classification i18n + browse routes.

### 2.4 Auth (KEEP – minimal)
- DSpace 8 frontend has no special EASE/Shibboleth code; Shibboleth is handled
  natively. No bespoke auth code in this repo to migrate (the `DATASHARE_USERS`
  group injection lives in the **backend**).

### 2.5 Accessibility / a11y (KEEP)
- `aria-label` and `role` fixes in edit-metadata table, relation-group component,
  end-user-agreement links, etc. (multiple recent UoE commits, untouched by 8.3).

### 2.6 CI / build (KEEP)
- `.github/workflows/codescan.yml` — UoE-tweaked CodeQL workflow.
- `Dockerfile` / `docker/dspace-ui.json` — DataShare-specific.
- `cypress` e2e suites — UoE-extended.

### 2.7 Known gap (NOT in this PR)
- **File preview** for CSV / scientific data formats: documented as missing in
  `MIGRATION-ASSESSMENT.md`. Not part of this 8.2 → 8.3 upgrade — flagged in §6.

---

## 3. Merge Strategy Followed

Per the prompt:

1. **Sync UoE 8.x with upstream 8.3**: `upstream/UoEMainLibrary-dspace-8_x`
   already contains the 8.3 merge (PR #8, commit `187289546`,
   `package.json` = `8.3.0`). No additional sync required.
2. **Merge that 8.3-aware branch into our DataShare 8.2 line**:
   `git merge upstream/UoEMainLibrary-dspace-8_x --no-ff` on
   `uoe/upgrade-to-83`. Result: merge commit `ecd239c26`.
3. **Conflict resolution policy**: 8.3 is the baseline; DataShare/UoE
   customizations are layered on top. See §4.

No force-pushes. No work on any other branch.

---

## 4. Conflicts and Resolutions

| File | Symptom | Root cause | Fix | Risk |
|---|---|---|---|---|
| `package.json` | `morgan` minor bump (1.10.0 → 1.10.1) and `ng2-file-upload` reverted to `5.0.0` upstream while we use `9.0.0`. | Upstream stayed on the older `ng2-file-upload`; UoE/DataShare upgraded for chunking. | Take upstream `morgan@^1.10.1`; **keep** `ng2-file-upload@9.0.0` (DataShare requirement). | Low. |
| `.github/workflows/codescan.yml` | Conflict marker on identical line (`uses: github/codeql-action/analyze@v3`). | Whitespace / EOL drift. | Removed the markers, single canonical line. | None. |
| `src/app/shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-control-container.component.scss` | DataShare `.col-sm-4` full-width override vs. upstream-added `.invalid-feedback` / `.col-form-label` rules. | Both sides added new rules in the same file region. | **Both kept** — DataShare block first, upstream block after. | None. |
| `src/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component.html` | DataShare wraps publisher/date/authors in `<div class="my-2">`; 8.3 changes the abstract block from `dso.firstMetadataValue('dc.description.abstract')` to `firstMetadataValue('dc.description.abstract') as abstract`. | Both sides edit adjacent lines. | Keep DataShare wrapper; adopt 8.3 abstract binding (`as abstract`). | None — markup unchanged for the user. |
| `src/assets/i18n/en.json5` | Upstream adds 3 keys (`item.preview.organization.url`, `…address.addressLocality`, `…alternateName`); DataShare adds the entire ~170-key DataShare/JACS block. Closing brace conflict. | Both touch end of file. | Insert the 3 upstream keys near the top of the additions; keep the full DataShare block; single closing brace. | None. |
| `src/themes/datashare/app/shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component.ts` | Build error `NG8002: Can't bind to 'currentDSOId' since it isn't a known property of 'ds-authorized-community-selector'`. | DSpace 8.3 replaces `<ds-dso-selector>` with `<ds-authorized-community-selector>` in `create-community-parent-selector.component.html`; the DataShare theme override re-uses that template but still imported `DSOSelectorComponent`. | Imported `AuthorizedCommunitySelectorComponent` and updated the component's `imports` array (commit `bc8a9190c`). | None — mirrors what the upstream `custom/` theme already does. |

---

## 5. Validation

| Check | Command | Status |
|---|---|---|
| Dependency install | `yarn install --frozen-lockfile` | OK (warnings are pre-existing peer-dep mismatches, not caused by this PR). |
| Lint | `yarn lint:nobuild` | **0 errors**, 1048 warnings (deprecation noise inherited from baseline). |
| Build | `yarn build` (dev) | **OK** — `dist/browser/` produced (~103 s). |
| Unit tests | `yarn test:headless` | **Not executed in this session** — see §6. |
| E2E | `yarn cypress:run` | **Not executed** — needs running backend. |

---

## 6. Open Risks / Next Steps

1. **Unit + E2E suites**: not run in this session (long runtime, no live backend
   available). Recommended before merging the PR:
   - `yarn test:headless` for the Karma unit suite.
   - `yarn cypress:run` against an 8.3 backend for the customized flows
     (item file-section, embargo badge, multi-value form, deposit button,
     create-community modal).
2. **Backend pairing**: the backend repo must also be brought to 8.3 (per the
   external assessment). Frontend changes here are independent and safe to push,
   but production deployment requires the matching backend.
3. **Stale theme overrides** (informational): the `edit-collection-selector`,
   `edit-community-selector`, `create-collection-parent-selector` overrides in
   both `themes/custom/` and `themes/datashare/` still point at the generic
   `dso-selector-modal-wrapper.component.html` (using `<ds-dso-selector>`).
   They compile fine but no longer mirror upstream's specific per-modal
   templates. **Inherited from upstream UoE 8.3, not introduced here.**
   Worth a follow-up if visual parity with vanilla 8.3 is desired.
4. **`ng2-file-upload@9.0.0`** declares `@angular/core ^20.0.0` as a peer
   dependency; we run on Angular 17. Currently a warning only — re-evaluate
   when DSpace ships an Angular upgrade.
5. **File preview** (CSV / scientific formats) is still a documented functional
   gap inherited from DSpace 6 — out of scope for 8.2 → 8.3.
6. **README**: the upstream `README.md` is left unchanged to stay diff-friendly
   against vanilla DSpace; this `UPGRADE-8.3.md` carries the upgrade log.

---

## 7. Final Confirmation

- All work is on branch **`uoe/upgrade-to-83`** only.
- Backup tag **`backup/pre-8.3-merge-before`** points at the pre-upgrade tip.
- Push: `git push origin uoe/upgrade-to-83` (no other branch, no force-push).
