<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture
- The site is multipage: one route per page in src/routes (home, systems, fleet, team, achievements, gallery, contact, blueprint), sharing nav/footer from src/components/site/Shell.tsx. Pages link with plain anchors (full loads) so three.js stays out of pages that don't need it.
- All static content (roster, subsystems, achievements, gallery, contact routes) lives in src/lib/siteData.ts; edit it there, not in the pages.
- The home hero shows real team photos as an onboard camera feed with hand-placed perception boxes (src/components/site/DroneVision.tsx). Box coordinates are image-space percentages; keep .vision-stage at 3:2 to match STAGE_RATIO.
- The home page embeds the interactive 3D blueprint (src/components/site/BlueprintEmbed.tsx → BlueprintViewer with `embedded`): lazy-loaded near the viewport, no wheel zoom and no global keyboard flying, so the page still scrolls. /blueprint is the full-screen version.
- Visual system: navy, blue and white. White pages, dark-navy hero and footer, one blue (#1d6fd8) for actions, IBM Plex Sans, soft 8–18px corners and light shadows, full-colour photos at contained sizes. Keep decoration minimal: no glow gradients, no icon chips on every card.
- Store imported photo media as Lovable asset pointers in src/assets; this keeps large binary uploads outside source control.
- Keep shared interactive controls in src/components/ui; this maintains consistent actions.
