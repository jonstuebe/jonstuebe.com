---
title: Controlling Wemo switches from a mac
summary: >-
  So bit of a long intro, but I have a set of KRK audio monitors that I've had
  for years and love. However, they run into my computer through an audio
  interface and eventually hook up to my computer via usb. Because of this if my
  mac goes to sleep there's a loud pop. Enter Wemo...
date: "2020-09-22T20:20:00.000Z"
image: "https://source.unsplash.com/Roepy2SBHQg/4000x1824"
---

So bit of a long intro, but I have a set of KRK audio monitors that I've had for years and love. However, they run into my computer through an audio interface and eventually hook up to my computer via usb. Because of this if my mac goes to sleep there's a loud pop. Enter Wemo:

I wanted to figure out a way to automatically turn off the speakers when I locked my computer (I use alfred's lock command). I started down a bit of a rabbit hole and initially found a solution using applescript and siri.

### Applescript & Siri

The first rendition of this solution essentially did the following. I first turned on the macos accessibility settings "Enable Type to Siri". Then with applescript, I told siri to activate and then passed it my command. This only worked as I have an apple tv and my wemo devices are registered as part of homekit.

This worked well but was kind of slow. Around 3-6s because of the ui needing to be present, keystrokes, and delays and such. I kept at it and finally found an alternative solution.

### Direct Wemo control

I found this package: [`belkin-wemo-command-line-tools`](https://www.npmjs.com/package/belkin-wemo-command-line-tools) which lets you control your wemo devices via bash commands. The trick I had to do was to login to my router (which happens to be google wifi mesh) and find my wemo plug device for my office and reserve the ip. After doing that I simply ran

```bash
wemo --host 192.168.xx.xxx --action "off"
```

That command runs almost instantly and was perfect. To add the final finishing touches, I created an alfred workflow which runs this command prior to "locking" my mac and also checks if spotify is currently playing and pauses any tunes. Here's the applescript portion for the spotify control:

```applescript
if speakerStateValue is "off" then
	using terms from application "Spotify"
		if player state of application "Spotify" is playing then
			tell application "Spotify" to pause
		end if
	end using terms from
end if
```

Hope that helps anyone who is trying to figure out something similar! Many thanks to James Borkowski (agilemation).

### _UPDATE 10-31-2020_

It seems as though the package `belkin-wemo-command-line-tools` isn't working anymore. I spent a little bit getting a cli setup using the package `wemo` and published it as [`wemo-cli`](https://github.com/jonstuebe/wemo-cli);

#### Install:

```bash
yarn global add wemo-cli
```

#### Usage:

```bash
wemo-cli on --ip="192.168.xx.xxx"
```

or

```bash
wemo-cli off --ip="192.168.xx.xxx"
```
