---
title: Building a multi-platform ui kit
summary: >-
  Back in 2017 I saw a new library pop up called `react-native-web`. The idea
  was fairly straight forward, a library that has the same exports as
  `react-native` (i.e. `View`, `ScrollView`, `FlatList`, `Image`, etc) but they
  all work on the web and share the same api's as `react-native`. The thought is
  that you can write components in such a way that you can share them between
  both web & native projects.
date: 2020-10-24T18:40:47.902Z
---
Back in 2017 I saw a new library pop up called `react-native-web`. The idea was fairly straight forward, a library that has the same exports as `react-native` (i.e. `View`, `ScrollView`, `FlatList`, `Image`, etc) but they all work on the web and share the same api's as `react-native`. The thought is that you can write components in such a way that you can share them between both web & native projects.

I had been playing with this idea for sometime after I heard about it, but things in the `react-native` space were still a little unstable in my opinion. Fast forward to last year, where SmartRent, the company I work for, after seeing some success with using `react-native` to build native apps allowed a few of us to do some research into using `react-native-web` to build out our web ui as well.

Pretty quickly, we started loving the experience. It enabled us to benefit from a lot of the hard work that the `react-native` has done when building these primitive components. For example, the `ScrollView` component let's you easily create a horizontal slider with snap points with just a few props.

Anyways, we pulled all of the components out of our `react-native` app and put them in our new ui kit. But that's kind of when the issues started. At first it was a single package in a repo and that worked well for awhile.

But then we ran into dependency issues as native projects required specific `react-native` packages that pull in all sorts of peer and normal dependencies that web shouldn't care about.

That led us to create a monorepo and have three different packages that were used: `native-ui`, `shared-ui`, and `web-ui`.

We also along the way needed some shared packages between each of these as well: `utils`, `formatters`, `hooks`, and `types`. 

> _Note: We've had our doubts on whether not the naming is great or if some of these should be merged, but they're doing the job right now._

We built our this monorepo using lerna w/ yarn workspaces.

