export type PingDatabaseRepository = () => Promise<string>;

export async function pingDatabaseService(
  repository: PingDatabaseRepository,
): Promise<string> {
  return await repository();
}

export function pingServerService(): string {
  return new Date(Date.now()).toString();
}
