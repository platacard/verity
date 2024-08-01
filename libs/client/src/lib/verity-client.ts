import { VerityClientConfig, VerityDependency } from './models';

export class VerityClient {
  private readonly config: VerityClientConfig;

  constructor(config: VerityClientConfig) {
    this.config = config;
  }

  /*
   * Fetches the dependencies for the application from the Verity service.
   * @returns {Promise<VerityDependency[]>} A promise that resolves to an array of VerityDependency objects.
   */
  public async getDependencies(): Promise<VerityDependency[]> {
    try {
      const params = new URLSearchParams({
        appId: this.config.applicationId,
        version: this.config.applicationVersion,
      }).toString();

      const response = await fetch(`${this.config.verityUrl}/api/deps?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch dependencies: ${response.statusText}`);
        return [];
      }

      // TODO: merge with overrides from dev-tools package after it's implemented

      return (await response.json()) as VerityDependency[];
    } catch (error) {
      console.error('Failed to fetch dependencies due to network or other error', error);
      return [];
    }
  }

  private getOverrides(): VerityDependency[] {
    console.error('Overrides not implemented yet');
    return [];
  }
}
