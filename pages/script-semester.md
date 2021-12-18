---
pagination:
  data: scripts.semesterCollections
  size: 1
  alias: semester
permalink: "{{semester.permalink}}"
---

{% for script in collections[semester.collection] %}

- [{{script.data.title}}]({{script.url}})

{% endfor %}
