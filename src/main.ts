import { Args, parse } from "https://deno.land/std/flags/mod.ts";
import CommandProcessor from "./commandProcessor.ts";
import { getConnectionPrefix } from "./connectionUtil.ts";

const name = "redts-cli";
const version = "1.0.0";

function printHelp(): void {
  printVersion();
  console.log("Stars interactive session with a redis-server.");
  console.log("");
  console.log(`Usage: ${name} [OPTIONS]`);
  console.log("  -h <hostname>      Server hostname (default: 127.0.0.1).");
  console.log("  -p <port>          Server port (default: 6379).");
  console.log("  --help             Output this help and exit.");
  console.log("  --version          Output version and exit.");
}

function printVersion(): void {
  console.log(`${name} ${version}`);
}

async function main(args: Args): Promise<void> {
  if (args.help) {
    printHelp();
    return;
  }

  if (args.version) {
    printVersion();
    return;
  }

  const hostname = args.h ?? "127.0.0.1";
  const port = args.p ?? 6379;
  const connection = await Deno.connect({ hostname, port });

  const commandProcessor = new CommandProcessor(connection);
  const connectionPrefix = getConnectionPrefix(connection);

  while (true) {
    const input = prompt(connectionPrefix);
    if (input === null) continue;

    console.log(await commandProcessor.process(input));
  }
}

main(parse(Deno.args));
