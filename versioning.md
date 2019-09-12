# A guide on how versioning works

Right how the files that contain the version are as follows:

* `README.md`
* `package.json`
* `spudslices.ts`
* `test.ts`

> This guide is mostly for me, but if you came here looking for what system I
> use, I just use semantic versioning.

`a.b.c`

change c on "Backward compatible bug fixes"

change b on "Backward compatible new features"

change a on "Changes that break backward compatibility"

reset all numbers following a changed num to 0.

## Deprications

* If you are using `import {ss} from 'spudslices'` or
`import {spudslices} from 'spudslices'` use `import ss from 'spudslices`
or `import spudslices from 'spudslices'`.
  * Starting in version 1.3.3, there will be a warning printed to the console on
  the first use of this depricated feature. This is done via a `get` patch. It's
  a bit smelly, but it has a strict deadline of it's removal.
  * Starting in version 2, the warning will be a `console.error` on
  the first use of this depricated feature.
  * Starting in version 2.1 the warning will be thrown on
  the first use of this depricated feature.
  * This feature will be completly removed in 2.2.
