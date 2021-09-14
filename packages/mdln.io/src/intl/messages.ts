import * as colors from "colors";
import formatMessages from "./formatMessages";
export default formatMessages({
  cli_err_unknown_option:
    `\n${colors.red(`Error: unknown option ${colors.bold("{option}")}`)}\n\n` +
    colors.white(`(try ${colors.bold("mdln.io --help")} to get some help)\n\n`),
  cli_err_req_path_missed:
    `\n${colors.red(
      `Error: required ${colors.bold("<path>")} is missed`,
    )}\n\n` +
    colors.white(`(try ${colors.bold("mdln.io --help")} to get some help)\n\n`),
  cli_err_file_not_found:
    `\n${colors.red(`Error: file ${colors.bold("{file}")} not found`)}\n\n` +
    colors.white(`(try ${colors.bold("mdln.io --help")} to get some help)\n\n`),
  cli_err_invalid_host_value:
    `\n${colors.red(
      `Error: host should be a valid RFC1123 hostname or an IPv4, not a given: ${colors.bold(
        "{host}",
      )}`,
    )}\n\n` +
    colors.white(`(try ${colors.bold("mdln.io --help")} to get some help)\n\n`),
  cli_err_invalid_port_value:
    `\n${colors.red(
      `Error: port should be a number between 0 and 65535, not a given: ${colors.bold(
        "{port}",
      )}`,
    )}\n\n` +
    colors.white(`(try ${colors.bold("mdln.io --help")} to get some help)\n\n`),
  cli_err_req_host_missed:
    `\n${colors.red(
      `Error: required ${colors.bold("<host>")} is missing`,
    )}\n\n` +
    colors.white(`(try ${colors.bold("mdln.io --help")} to get some help)\n\n`),
  cli_err_req_port_missed:
    `\n${colors.red(
      `Error: required ${colors.bold("<port>")} is missing`,
    )}\n\n` +
    colors.white(`(try ${colors.bold("mdln.io --help")} to get some help)\n\n`),
  cli_version: `\n${colors.bold.white("{version}")}\n\n`,
  cli_help: `
${colors.white("Usage:")} ${colors.bold.green("mdln.io [options]")}

${colors.white("where")} ${colors.bold.green("[options]")} ${colors.white(
    "are:",
  )}

\t${colors.bold.green("--help")}\t\t${colors.white("display this message")}
\t${colors.bold.green("--version")}\t\t${colors.white("version information")}
\t${colors.bold.green("--host <host>")}\t${colors.white("Web server <host>")}
\t${colors.bold.green("--port <port>")}\t${colors.white("Web server <port>")}
\t${colors.bold.green("--cert <path>")}\t${colors.white(
    "HTTPS certificate file absolute <path>",
  )}
\t${colors.bold.green("--key <path>")}\t${colors.white(
    "HTTPS certificate key file absolute <path>",
  )}
\t${colors.bold.green("--io <path>")}\t${colors.white(
    "IO static absolute <path>",
  )}
\t${colors.bold.green("--nodes <path>")}\t${colors.white(
    "Nodes static absolute <path>",
  )}

`,
});
