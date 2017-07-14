---
layout: section
section: team
redirect_from:
- /people/tim/
categories: team, tech
---

**Red56** are a team of business-focused technologists based mostly in London.

* Tim Diggins - CTO, product manager, technologist
* Garry Hill - Full stack web developer, interaction designer
* Jamie Higgins - Android developer
* Paul Harter - iOS developer

# Alumni

We have been priviledged to have some great people work with us  

* Ella Schofield 
* Nick Roberts 
* Paul Battley 
* Kolin Burges
* Alistair Roche
* Callum Chapman
 
# Our development practices

New features and bug fixes are built with automated tests (“TDD”). This ensures the expected outcome is achieved while preventing future regressions. These tests are run every time the code changes to catch any unanticipated side effects (“continuous integration”).

We ensure live systems have automated backups, error and performance monitoring and a shadow “staging” system where new features can be trialled before being pushed to production.


# Recent team and tech posts

<div class="posts">
  {% for post in site.categories.tech %}
    <div class="post">
      <a href="{{ post.url }}">{{ post.title }}
        <small class="excerpt">{{ post.excerpt }}</small>
      </a>
    </div>
  {% endfor %}
</div>
