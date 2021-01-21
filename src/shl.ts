import { IShlConnectionOptions } from "./shl_connection";

const Connection = require("./shl_connection");
const ShlClient = require("./shl_client");

export function connect(options: IShlConnectionOptions) {
  return new ShlClient(new Connection(options));
}
