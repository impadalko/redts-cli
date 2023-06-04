import { parse } from "https://deno.land/std/flags/mod.ts";
import { main } from "./cli.ts";

main(parse(Deno.args));
