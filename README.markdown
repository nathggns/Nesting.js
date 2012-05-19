# Nesting.js

Nesting.js is a pollyfill designed to allow you to use nesting in `CSS` **now** with **no** pre processing required. Just include the script, and you're done.

**At the moment, this is, and should be considered, a proof of concept. In NO situation should you EVER be using this on a production site. Has not been tested outside of Chrome 19, at all. Preformance on mobile is probably killer, and chances are, it could explode your computer in Internet Explorer.**

## Restrictions

 * All rules not found inside *blocks* will completely kill your website, like, literally.
 * Preformance is probably terrible.
 * The normaliser is extremely restricted, so parsing could die if you write your `CSS` any different from how I do.
 * May mess up your overwritten rules, as all blocks are grouped.

## Features

 * Only the extreme basics of nesting is supported.
 * Based on the syntax proposed [here](http://lists.w3.org/Archives/Public/www-style/2011Jun/0022.html)

## Note

Don't use this.