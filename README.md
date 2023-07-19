# redts-cli

A simplified Redis CLI made in Typescript.

## Getting started

To start the CLI:

```
deno task run
```

This will attempt to connect to a Redis server at the port 6379 of localhost.
The host can be changed with the `-h` flag while the port can be changed with
the `-p` flag.

### Testing

To run all the unit tests:

```
deno task unit-test
```

It's also possible to check code coverage by running:

```
deno task coverage
```

To run all integration tests (please ensure there is a redis server listening on
`localhost:6379` before running):

```
deno task integration-test
```

## Compiling

To generate an executable binary:

```
deno task compile
```

This will generate an executable called `redts-cli`
