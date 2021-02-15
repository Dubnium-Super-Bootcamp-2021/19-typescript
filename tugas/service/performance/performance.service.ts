/** @module performanceService */

import { summary } from './performance';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * Service untuk mendapatkan summary worker dan task
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export async function summarySvc(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const sums = await summary();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(sums));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}
