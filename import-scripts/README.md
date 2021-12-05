These scripts were used to import data from the old site. They are primarily of historical interest and do not need to be run again.

## Old Scripts

There are several HTML formats used for the old scripts:

- fall 1975: looks like a Word export. Handled manually.
- `v1` (1993–2001, 2004-2005):
  - h1 headers
  - p->big->big->em->strong subheaders
    - also i->b->p->font
  - directions in p->strong wrapped by parens or brackets
    - also in the format `<p>(<i>...</i>)</p>`
    - also in i->b (and i->b->p)
  - lists in a ul or `table`
    - starting 2004: also inlined with `<br>` separating items
      - starting 2005: outside of p tags
  - some scripts use regular non-ABCDEF ul-based lists
  - brown v dartmouth 1997 has a special note
  - some scripts have editors notes at the top in i->p and p->i
  - some scripts are empty
- 2001: really nicely formatted. Handled manually.
- `v2` (2002-2003):
  - p->b->font headers
  - `<b>[...]</b>` subheaders (just like directions starting 2003)
  - entire script is in one p with `<br><br>` separating paragraphs
    - after 2002, no more wrapping p tag
  - directions are:
    - 2002: unadorned and wrapped in brackets
    - later: `<b>[...]</b>`
  - lists are separated by `<br><br>`
  - editor's notes in p->i
- `v3` (2006-2011):
  - h2 headers
  - h3 subheaders
  - p->em stage directions
  - lists are adjacent paragraphs
