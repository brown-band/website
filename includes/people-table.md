{% macro peopleTable(positions) %}

<table class="table">
{% for position in positions %}
{% for person in position.people %}
<tr>
  <th>
    
  {{position.name | safe if loop.first}} {style="margin: 0"}
    
  </th>
  <td><a href="mailto:{{person.email}}">{{person.name}}</a> '{{person.year}}</td>
</tr>
{% endfor %}
{% endfor %}
</table>
{% endmacro %}
