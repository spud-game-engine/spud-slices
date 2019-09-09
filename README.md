# Spud-Slices v1.2.0

The library that lets you make shapes.

This library is a component of Lazerbeak12345's larger, Spud Game Engine (SGE).
It is designed to be a base for libraries such as physics engines. Primarally,
it works with 2d applications only, but it should, in the future be able to work
in 3d.

## Unit testing

Run `npm test` for basic testing. It will build, then run the program in node,
as it is written in TypeScript. I don't yet know how to make it run in a browser
env, but I'm looking into it.

## My dialog about moving to TypeScript

I had heard many times that JavaScript was a "bad" programmng language, and that
all programs made with it inevitably become bloatware. At first when I heard
statements such as this, I dissagreed. As my first programming language I
learned, all the way back at the end of middle school (and yes, this is
excluding Scratch), it was hard to see why something that granted such a supurb
level of creation would be bad.

It wasn't until I graduated from High School, having learned of the dynamics of
many, many other programming languages, that I braved a language I had internal
opposition to: "TypeScript."

This was, by far, not the first time I had looked into languages that compile
into JavaScript. Once I noticed just how many people reccomended "CoffeScript"
to people like me, I took a look-see.

When I did look at CoffeScript, I was dissapointed. "This bizzare language is
supposed to be the new JavaScript? It looks completely different!" I had, at the
time only been using es5, which didn't have many of the dynamics, typeing and
modulisation that JS would later come to accept, so I stayed away. (I was told
that this is also what Java code looked like, so I had avoided Java as well
until I took CS 1410, a course that was, at the time, on Java. I still hate the
installer(s) though.)

Eventually, I heard word of a language that was basically CoffeScript, but
valid JS is valid TS. By the time I got to trying it out, my JS from the 2014-16
era was a little antuiqe, as according to tsc, but it took a remarkably small
amount of work to convert the lib. (I probabbly spent more time worring about
API compatibility, and thus first made my own test lib, then went and found a
better one)

For info about how the conversion was done, look at the git repo. For
commentary, read all commits. Some are actually pretty funny, looking back.
