{% if loop.index % 2 == 1 %}
  <img class="headshot" src="/assets/people/{{person.name|slugify}}.jpg" width="130" style="float: right">
{% endif %}

<h3 class="h5">
  {% if person.position.sec -%}
  <a href="/constitution#{{person.position.sec}}">{{person.position.name}}</a>
  {%- else %}{{person.position}}{% endif %} :
  <a href="mailto:{{person.email}}">{{person.name}}</a>
  <a href="{{person.link}}" style="text-decoration: none; color: inherit">'</a>
  {{-person.year-}}
</h3>

{% if loop.index % 2 == 0 %}
  <img class="headshot" src="/assets/people/{{person.name|slugify}}.jpg" width="130" style="float: left">
{% endif %}

{{person.position.role|default("")}}

{{person.bio}}

<div style="clear: left; padding-bottom: 2rem"></div>
