#!/usr/bin/env node
const Repo = require('npm-api/lib/models/repo');
const table = require('markdown-table');
const width = require('string-width')
const { red, green } = require("colorette");

const getPackageDeps = async (package, version) =>  {
    const repo = new Repo(package);
    const leftPkg = await repo.version(version)
    return Object.keys(leftPkg.dependencies);
}

const zip = (a, b) => Array(Math.max(b.length, a.length)).fill().map((_,i) => [a[i], b[i]]);

const getUrls = (arr) => arr.map(packageName => `https://www.npmjs.com/package/${packageName}`);

const myArgs = process.argv.slice(2);
const [packageName, leftVersion, rightVersion] = myArgs;

(async () => {
    const leftDeps = await getPackageDeps(packageName, leftVersion);
    const rightDeps = await getPackageDeps(packageName, rightVersion);
    const added = leftDeps.filter(x => !rightDeps.includes(x));
    const removed = rightDeps.filter(x => !leftDeps.includes(x));
    const zipped = zip(getUrls(added), getUrls(removed));
    const header = [[green('Added'), red('Removed')]];
    const markdownTable = table(header.concat(zipped), {stringLength: width});
    console.log(markdownTable);
})();
