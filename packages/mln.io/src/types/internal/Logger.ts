import { stdout, stderr } from "process";
import { Logger as BaseLogger, LogLevel } from "mln";
class Logger extends BaseLogger {
  $log(level: LogLevel, msg: string): boolean {
    if (this.level === LogLevel.NONE) {
      return false;
    } else {
      switch (level) {
        case LogLevel.TRACE:
          if (this.level == LogLevel.TRACE) {
            stdout.write(msg);
            return true;
          }
          break;
        case LogLevel.DEBUG:
          if (this.level <= LogLevel.DEBUG) {
            stdout.write(msg);
            return true;
          }
          break;
        case LogLevel.INFO:
          if (this.level <= LogLevel.INFO) {
            stdout.write(msg);
            return true;
          }
          break;
        case LogLevel.WARN:
          if (this.level <= LogLevel.WARN) {
            stdout.write(msg);
            return true;
          }
          break;
        case LogLevel.ERROR:
          if (this.level <= LogLevel.ERROR) {
            stderr.write(msg);
            return true;
          }
          break;
        case LogLevel.FATAL:
          stderr.write(msg);
          return true;
      }
      return false;
    }
  }
}
export default Logger;
