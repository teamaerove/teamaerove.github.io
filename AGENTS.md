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
- Keep the supplied single-page AeRoVe content and static roster in the home route; this preserves the original site without unnecessary backend work.
- Store imported photo media as Lovable asset pointers in src/assets; this keeps large binary uploads outside source control.
- Keep shared interactive controls in src/components/ui; this maintains consistent actions.
