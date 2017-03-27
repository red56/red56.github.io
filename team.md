---
layout: category
redirect_from:
- /people/tim/
categories: team, tech
---

## Who we are
A team of business-focused technologists based mostly in London.

* Tim - CTO
* Ella - full stack web developer
* Garry - full stack web developer
* Jamie - Android developer
* Paul - iOS developer

## Our development practices

New features and bug fixes are built with automated tests (“TDD”). This ensures the expected outcome is achieved while preventing future regressions. These tests are run every time the code changes to catch any unanticipated side effects (“continuous integration”).

We ensure live systems have automated backups, error and performance monitoring and a shadow “staging” system where new features can be trialled before being pushed to production.


## Recent team and tech posts

<ul>
  {% for post in site.categories.tech %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>
