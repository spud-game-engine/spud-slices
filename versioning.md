# A guide on how versioning works

Right how the files that contain the version are as follows:

* `README.md`
* `package.json`
* `spudslices.ts`

> This guide is mostly for me, but if you came here looking for what system I
> use, I just use semantic versioning.

`a.b.c`

change c on "Backward compatible bug fixes"

change b on "Backward compatible new features"

change a on "Changes that break backward compatibility"

## Deprications

* If you are using `import {ss} from 'spudslices'` or
`import {spudslices} from 'spudslices'` use `import ss from 'spudslices`
or `import spudslices from 'spudslices'`.
  * Starting in version 1.3.3, there will be a warning printed to the console on
  the first use of this depricated feature.
  * Starting in version 2, the warning will be a `console.error` on
  the first use of this depricated feature.
  * Starting in version 2.1 the warning will be thrown on
  the first use of this depricated feature.
