import { pingServerService } from '../services/ping.service.js';
import type { PingDatabaseResponse, PingServerResponse } from '@summit/shared';
import type { Request, Response } from 'express';

type PingDatabaseService = () => Promise<string>;

export function pingServerController(
  _request: Request,
  response: Response<PingServerResponse>,
): void {
  try {
    response.status(200).json({
      result: 'server ok',
      timestamp: pingServerService(),
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ result: 'server error' });
  }
}

export function createPingDatabaseController(service: PingDatabaseService) {
  return async (
    _request: Request,
    response: Response<PingDatabaseResponse>,
  ): Promise<void> => {
    try {
      response.status(200).json({
        result: 'database ok',
        timestamp: await service(),
      });
    } catch {
      response.status(500).json({
        result: 'database error',
      });
    }
  };
}
