import { collectDefaultMetrics, Counter, Histogram, Metric, Registry } from 'prom-client';

class PrometheusClient {
  private readonly register = new Registry();
  private readonly additionalMetrics: Metric[] = [
    new Histogram({
      name: 'http_request_duration_s',
      help: 'Duration of HTTP requests in s',
      labelNames: ['route', 'code'],
    }),
    new Counter({
      name: 'errors_count',
      help: 'Errors counter',
      labelNames: ['error', 'level'],
    }),
  ];

  constructor() {
    this.register.setDefaultLabels({
      app: 'verity',
    });

    for (const metric of this.additionalMetrics) {
      this.register.registerMetric(metric);
    }

    collectDefaultMetrics({ register: this.register });
  }

  public getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  public getContentType(): string {
    return this.register.contentType;
  }

  public resetMetrics(): void {
    this.register.resetMetrics();
  }
}

export const metrics = new PrometheusClient();
