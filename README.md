> :warning: Deprecated! Use [@thi.ng/geom](https://www.npmjs.com/package/@thi.ng/geom) instead!


# Spud-Slices v1.3.5

[![Coverage Status](https://coveralls.io/repos/github/spud-game-engine/spud-slices/badge.svg?branch=master)](https://coveralls.io/github/spud-game-engine/spud-slices?branch=master)
[![Build Status](https://travis-ci.org/spud-game-engine/spud-slices.svg?branch=master)](https://travis-ci.org/spud-game-engine/spud-slices)

The library that lets you make shapes.

This library is a component of Lazerbeak12345's larger, Spud Game Engine (SGE).
It is designed to be a base for libraries such as physics engines. Primarally,
it works with 2d applications only, but it should, in the future be able to work
in 3d.

Here's some of the coolest features:

* The ability to make almost any 2d shape.
* The ability to test the collision of any shape with any other shape. (Using
  line-intercept collision only, for now)

## Using the library

Download and mark as a dependancy with `npm i spud-slices -D`.

<!--Right now, ss depends on tslib, as I plan on using tslib in all of my SGE
components. (NOT TRUE RIGHT NOW: I'll need to look into it)-->

Import the library with one of the following:

* Include everything: `include ss from 'spud-slices';`
* Include just parts you are using:
  `include {Polygon, Circle, version} from 'spud-slices';`

Should you need support for more than just recent browsers, you could use the
es3 file instead: `import ss from 'spud-slices/dist/es3/lib/spudslices';`

## Documentation

Run `npm install` then `npm run build`. This will make the html5 documentation,
using the source code. Elsewise, just use the source code.

If you are viewing this in the HTML5 documentation, click `"spudslices"` on the
left, then `spudslices` in the center to get started. [Here's the link if you
would rather just use this.](modules/_spudslices_.spudslices.html)

## Unit testing

Run `npm test` for basic testing. It will build, then run the program in node,
as it is written in TypeScript. I don't yet know how to make the tests run in a
browser env, but I'm looking into it.

## (May) pair well with

If you need _something more_.

* [Wilderness](https://wilderness.now.sh/) A library made for the purpose of
  having fancy animation stuff, all with SVG. I highly reccomend this over using
  canvases for everything, as it is more native.
* [subdivide-arc](https://www.npmjs.com/package/subdivide-arc) This may be
  useful if you want a round part attached to the rest of a polygon.
* [Shapes-Interaction-Library](https://www.npmjs.com/package/shapes-interaction)
  Just in case I'm not good enough at collision algorithims for your taste. With
  the exeption of circles, there is a direct mapping from `Shape.points` to
  the arguments of their `intersection` or their `contain`. For circles, swap
  the first and second elms of the `Circle.points` array, then it's a perfect
  fit. Note that it doesn't give info about the location, or angle of collision.

## Alternatives

If this is close, but not quite what you need.

* [@thi.ng/geom](https://www.npmjs.com/package/@thi.ng/geom) Really big, but can
  do everything this can do and more.
* [Shapes-Interaction-Library](https://www.npmjs.com/package/shapes-interaction)
  Just collisions, nothing more. (Doesn't give lines as output when there is a
  collision, so this may not be what you want)
* [Paper.js](http://paperjs.org/) It's like Spud-Slices, but it focues more on
  rendering.

## Licencing

This is licenced under the GNU GPL-3.0.
