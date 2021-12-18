---
title: Next.js, Vite, and the future
summary: >-

date: "2021-03-17T22:38:03.821Z"
image: https://source.unsplash.com/bZZp1PmHI0E/5500x3781
---

At my [day job](https://smartrent.com), I work on a lot of developer tooling and our design system. As of now we've been building all of our react apps as a _simple_ spa. We have an internal monorepo where we maintain a webpack config that all of our projects rely on.

In different research phases I've picked up [Next.js](https://nextjs.org/) and have tried making it the foundation of our projects. But as many of you know, tooling is hard. We have a component library written in typescript to think about. Utility packages, hook packages. But after a lot of struggling and frustration I ended up getting it working (or so I thought).

What I noticed was spikes of memory usage that kept growing over time to where the dev server would eventually spit out a v8 memory error and quit. I tried diagnosing it and found myself down a rabbit hole of how the guts of Next.js work. As I dug, I found that Next.js is a labyrinth of configs, plugins, and abstracted magic. I mean knew building a SSR meta-framework on top of React would be complicated, but oh I didn't realize how much.

I found tons of custom webpack loaders, aliases, babel plugins, etc. Each of them making me more confused on how we don't have more memory leaks and issues. I say that with love to the whole vercel org and all of the hard work they doing. Honestly, Next.js is a great product that works really well for lots of situtations.

However, I personally found that if you want to use it with a lot of customizations, which most larger apps end up needing, you end up with a monstrosity of a config with hundreds of dependencies that you need to worry about all playing with each other.

## Search for Simplicity

Around this same time I started to hear more and more people talking about [Vite](https://vitejs.dev/)(pronounced VEET I believe). What amazed me about it was how different it's setup is. First, yes I know it doesn't come with the same feature set (SSR, SSG, etc.), but that's not what I'm getting at at all.

It's like Evan You took an honest look at the ecosystem and realized: _we need simple tools_. We need to figure out a way of looking at where we are in 2021 and building tools on top of the latest things out there. I'm starting to fall in love with it as it does so many smart things that I honestly wish I would have come up with.

- I love that it pushes using esmodules in dev and because of that has a _nearly_ instant startup time.
- I love that it uses the existing rollup plugin model and doesn't make me learn a "new" thing.
- I love that things like `fast-refresh` come as a simple plugin that requires **no extra setup**.

## Closing Thoughts

It made me realize that we need more engineers that are building tools with concepts like ease of use, simplicity, and simply being productive. I also love how there are multiple different SSR solutions already popping up that provide similar functionality for Next.js already and honestly, a whole lot less magic under the hood.

I really hope your takeaway isn't me trashing Next.js or Vercel as that's not my intention. My hopes are that they will take a page out of the Vite playbook and simplify things for everyone. Especially with things like [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) on the horizon.

Best of luck building out there!
