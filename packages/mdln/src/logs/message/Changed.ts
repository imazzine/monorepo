/**
 * @fileoverview Declaration of the Changed class for logs namespace.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export namespace message {
  /**
   * Monitorable object changed log message type.
   */
  export class Changed {
    level: string;
    field: string;
    value: boolean | number | string;
    constructor(
      level: string,
      field: string,
      value: boolean | number | string,
    ) {
      this.level = level;
      this.field = field;
      this.value = value;
    }
  }
}
