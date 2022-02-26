---
title: Component Libraries and Module Federation
date: "2022-02-26T19:16:40.697Z"
image: https://source.unsplash.com/8bghKxNU1j0/2874x2156
---

I help build an implementation of our design library at [SmartRent](https://smartrent.com). One of the pain points that we've experienced is how to best get the newest version of our components/utilities/hooks in the hands of the developers for each app that we have.

## The Evolution

We started with a manual process of bumping the package versions of each package that we publish to npm and then opening a PR for each app. This took a lot of time and eventually we started building a way to automate this process.

That automation script does the following:

1. Inside of our monorepo we have a temporary cache directory that each app we want to push our package updates to are cloned.
1. Next, each app's `package.json` is updated with the latest version of our packages and any dependency changes that might have been required as part of that update.
1. Last, we create branches inside of each of these repos and a commit and send them all up to GitHub with a PR as well.

This has been working quite well for us but still requires a decent amount of involvement as each PR needs to be reviewed and examined and that can cause the upgrade process for each app to take upwards of 2 weeks if folks on each team are busy with other efforts.

## Enter Module Federation

I've been keeping tabs on Module Federation w/ Webpack over the last year or so and up to now I've kinda always thought of it as a way to deploy micro-frontends. While that's a feature of it, there are several interesting use cases that I had never thought of.

One of them that I stumbled upon this morning was the ability to simply use it as a delivery method for async modules in your application. Think of it like lazy loading modules but on steroids.

What I'd love to see is any of our apps be able to import modules from our design system without having to think about npm dependencies or anything like that.

```typescript
import { Button } from "system/ui";
```

### Related Dependencies

But before we get farther, what if that `Button` component requires an additional set of dependencies. Maybe things like `lodash-es` or `date-fns`? Right now I have more questions than answers, but I think if there was a way to somehow couple the needed dependencies along with the `Button` module that would work. The only issue there is whether or not we'd end up duplicating dependencies that are loaded when another component has the same dependency. So there would need to be some sort of caching of those libraries. Or perhaps I'm overcomplicating things and there's another way to accomplish this with module federation that I'm overlooking.

### Versioning

Another big item to figure out and tackle would be versioning. Most of the time I'm not sure it would make sense to update all app instances to the latest version always. What about testing new versions before they come out?

What I hope is possible is something like the below:

```typescript
import { Button } from "system@1.0.0/ui";
```

This would mean that for each version of our design system we'd deploy a new federated server that would have to stay up until we decommission that version. It would function something like API versioning, but instead of having to keep track of each version inside of the same codebase that would be handled at the deployment level and older versions would have a no change guarantee.

### Types

The last thing we want is for developers who are writing code with these remote modules to have to update the types on their own. One idea I have is that the federated server would create a new endpoint for IDE's to remotely load these types when they see an import that is connected to a remote module.

So when a developer writes the import, instead of trying to resolve the module and types locally, webpack would tell the IDE to load them from the remote host and cache them locally somewhere.

## Final Thoughts

Most of this is hopes and dreams, but I would love to see more development in this space as it could transform team workflows and simplify getting the latest changes out to projects in minutes instead of hours, days, or weeks.

It could even enable situations where you want to use a different version of a component (perhaps an older version) that you don't have time to refactor by simply not updating the import in that file.

Another possibility is being able to use these federated modules in other environments outside of the web through the help of frameworks like `react-native`.
