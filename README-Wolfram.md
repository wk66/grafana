#  wolfram's fork of the grafana/grafana project
(commit this to my repo? i think yes, but do never make a pull request
of course)

## naming
has to be named like the original, because builds would not work with
a different name

## sync fork

with IDEA: Git - rebase fork or manually:

    git fetch upstream
    git checkout master # just in case
    git merge upstream/master
    git push --tags


## building

This starts a blocking run of continuously build and run

```
bra run
```

this runs all tests and runs the program.
then use Grafana at [localhost:3000](http://localhost:3000/)

User: wolle, Password: w123

## tests

with IDEA I can run go lang tests

but it is unclear how to run the JS tests (https://github.com/karma-runner/grunt-karma ?)
