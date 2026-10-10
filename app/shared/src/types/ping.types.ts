export interface PingDatabaseErrorResponse {
  result: "database error";
}

export interface PingDatabaseSuccessResponse {
  result: "database ok";
  timestamp: string;
}

export interface PingServerErrorResponse {
  result: "server error";
}

export interface PingServerSuccessResponse {
  result: "server ok";
  timestamp: string;
}

export type PingDatabaseResponse = PingDatabaseErrorResponse | PingDatabaseSuccessResponse ;
export type PingServerResponse = PingServerErrorResponse | PingServerSuccessResponse;
