---
title: VSCode 1.49.1 case changing in regex replace
summary: >-
  I was looking through the VSCode 1.49.1 release notes and saw this cool new
  feature which allows you to do case changing in regex replace.
date: "2020-09-23T17:26:17.818Z"
image: https://source.unsplash.com/4oAFasAPftg/3450x2300
---

I was looking through the VSCode 1.49.1 release notes and saw this cool new feature which allows you to do case changing in regex replace.

> In June, we added support for changing the case of regex matching groups while doing a Find/Replace in the editor. This month, we've added the same feature for Search/Replace across the workspace. This is done with the modifiers \u\U\l\L, where \u and \l will upper/lowercase a single character, and \U and \L will upper/lowercase the rest of the matching group.

So what does this actually mean? Let's say we had a bit of javascript where we didn't type the component names properly:

```javascript
const textInputComponent = () => (
...
)
const textAreaComponent = () => (
...
)
```

What we want to do is convert the variable names to a upper first character. To do this with just the find and replace menu we can do the following:

Search (with regex turned on): `(const )([a-zA-Z]*)`
Replace: `$1\u$2`

Replaced:

```javascript
const TextInputComponent = () => (
...
)
const TextAreaComponent = () => (
...
)
```

As you can see the `\u` will take the first character of the matched group `$2` (second group as the first is actually `"const "`).

Let's make up one more contrived example 😅

Ok, so we have react/redux app and have a set of object map for actions for some reducer. Let's say right now it looks something like this:

```javascript
const actions = {
  increment: "increment",
  decrement: "decrement",
};
```

Let's see what we can do by using `\U` this time.

Search (with regex turned on): `([a-z]*?)(: "[a-z]*?")`
Replace: `$1\U$2`

Replaced:

```javascript
const actions = {
  increment: "INCREMENT",
  decrement: "DECREMENT",
};
```

Hope that helps someone out with another tool in their tool belt when it comes to making text transformations at either a file or project level!
