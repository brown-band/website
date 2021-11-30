---
pagination:
  data: scripts.bySemester
  size: 1
  alias: semester
permalink: "{{semester.permalink}}"
---

{% for script in semester.scripts %}

- [{{script.title}}]({{semester.permalink}}{{script.id}}/) {% endfor %}
