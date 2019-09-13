# Spud-Slices v1.3.1

[![Coverage Status](https://coveralls.io/repos/github/spud-game-engine/spud-slices/badge.svg?branch=master)](https://coveralls.io/github/spud-game-engine/spud-slices?branch=master)
[![Build Status](https://travis-ci.org/spud-game-engine/spud-slices.svg?branch=master)](https://travis-ci.org/spud-game-engine/spud-slices)

The library that lets you make shapes.

This library is a component of Lazerbeak12345's larger, Spud Game Engine (SGE).
It is designed to be a base for libraries such as physics engines. Primarally,
it works with 2d applications only, but it should, in the future be able to work
in 3d.

## Using the library

Import the library with one of the following:

* Include everything: `include ss from 'spudslices'`
* Include just parts you are using:
  `include {Polygon, Circle, version} from 'spudslices'`

## Documentation

Run `npm install` then `npm run build`. This will make the html5 documentation,
using the source code. Elsewise, just use the source code.

If you are viewing this in the HTML5 documentation, click `"spudslices"` on the
left, then `spudslices` in the center to get started. [Here's the link if you
would rather just use this.](modules/_spudslices_.spudslices.html)

## Unit testing

Run `npm test` for basic testing. It will build, then run the program in node,
as it is written in TypeScript. I don't yet know how to make it run in a browser
env, but I'm looking into it.

## Licencing

This is licenced under the GNU GPL-3.0.
