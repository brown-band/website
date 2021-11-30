<h3 class="h5">
  {% if person.position.sec -%}
  <a href="/constitution#{{person.position.sec}}">{{person.position.name}}</a>
  {%- else %}{{person.position}}{% endif %} :
  <a href="mailto:{{person.email}}">{{person.name}}</a>
  <a href="{{person.link}}" style="text-decoration: none; color: inherit">'</a>
  {{-person.year-}}
</h3>

{{person.position.role}}

{{person.bio}}
