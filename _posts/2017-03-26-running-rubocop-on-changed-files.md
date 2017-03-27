---
layout: post
title:  "Running rubocop on changed files"
date:   2017-03-26
categories: tech
---


We have just started using rubocop rigorously on legacy codebases we work on, but rubocop takes a minute or more to run every time we commit. This is a bit boring, but we don't want to have to wait for CI to tell us that it fails.

So should really just run rubocop **on changed files** at latest before committing, or on the diff between head and
remote's head before pushing.

### tldr;

* before commiting:

      git ls-files -m | xargs ls -1 2>/dev/null | xargs grep '\.rb$' | rubocop
* before pushing:

      git diff-tree -r --no-commit-id --name-only master@\{u\} head | xargs ls -1 2>/dev/null | xargs grep '\.rb$' | rubocop
* in ci

      rubocop

### Non technical overview

Rubocop is a tool to make some kinds of ruby coding errors and bad formatting more obvious (and sometimes automatically fixable). The consistency if enforces makes code more readable, more reliable and faster to extend and improve. In this article I give some tips for how to make rubocop check just the files that have changed (and explain how I got there).

### Run before committing

There's a [great post on this by Michal Orman](http://michalorman.com/2013/12/run-rubocop-against-modified-files/)
which was a really great start. But there are tweaks to improve this:  `git ls-files -m` is better than `git status --porcelain | cut -c4-`, as git status includes more complex output in the case of renames. However it will still include deleted files, so you need to filter through `ls` to find files that *actually* exist (and this stack overflow question helped here http://stackoverflow.com/questions/21119035/filter-list-of-files-to-those-that-exist) so: `git ls-files -m | xargs ls -1 2>/dev/null` (you don't actually need the -1 if you're piping it to another command, but useful to see what's happening here).

One more thing (adding to [Pawel's tweak](http://michalorman.com/2013/12/run-rubocop-against-modified-files/#comment-3096557836)) is that if you have any files which end with .rb.something (e.g. .rb.orig might be still kicking around from a previous merge conflict) then you want to just get ones that have .rb at the end `grep '\.rb$'`

So my final version is:

    git ls-files -m | xargs ls -1 2>/dev/null | xargs grep '\.rb$' | rubocop

### Run before pushing

When pushing, the final `| xargs ls -1 2>/dev/null | xargs grep '\.rb$' | rubocop` is the same, but gathering the list of changed files is different. If it' just one commit you could use `git diff-tree -r --no-commit-id --name-only head` to output a list of files changed (including deleted) in the head. But this won't be comprehensive if you have more than one commit. Another option is to compare with master or origin/master with `git diff-tree -r --no-commit-id --name-only head origin/master`. Or a fancy option is to use `git diff-tree -r --no-commit-id --name-only @\{u\} head` to track changes against the current upstream. But this won't work if you haven't yet set up a remote tracking branch. I'd like to have some shortcut for files that have changed since master and that seems to me to be (using master@\{u\} to refer)

    git diff-tree -r --no-commit-id --name-only master@\{u\} head

(NB giving the command the form that will work in zsh -- it can simply be `@{u}` without backslashes if your shell doesn't use zsh's brace expansion)

### Git hooks! Yes? Not for me

You could go all out and add this as a git hook and force yourself and/or everyone to have this workflow. Feels like a mistake to me. That's what CI is for, to catch errors. There may be good reason not to run rubocop (e.g. you just ran it anyway) or bad reasons (you don't have time...)

### Moreover

In general:

* `git ls-files -m | xargs ls -1 2>/dev/null` is useful as an alias for "files modified since the last commit"
* `git diff-tree -r --no-commit-id --name-only master@\{u\} head | xargs ls -1 2>/dev/null` is useful as an alias for "files modified compared with master"

These might work well as git aliases or zsh functions
