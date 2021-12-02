{% macro peopleTable(positions) %}

<table class="table">
{% for position in positions %}
{% for person in position.people %}
<tr>
  <th class="people-table-head">
    
  {{position.name | safe if loop.first}}
    
  </th>
  <td><a href="mailto:{{person.email}}">{{person.name}}</a> '{{person.year}}</td>
</tr>
{% endfor %}
{% endfor %}
</table>
{% endmacro %}
