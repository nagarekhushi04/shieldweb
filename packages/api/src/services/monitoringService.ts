import { Signer } from '@stellar/stellar-sdk';
import axios from 'axios';

class MonitoringService {
  private metrics = {
    requestCount: 0,
    errorCount: 0,
    responseTimes: [] as number[],
    threatChecksToday: 0,
    lastReset: new Date()
  }

  constructor() {
    // Reset daily metrics at midnight
    setInterval(() => {
      const now = new Date();
      if (now.getDate() !== this.metrics.lastReset.getDate()) {
        this.metrics.requestCount = 0;
        this.metrics.errorCount = 0;
        this.metrics.responseTimes = [];
        this.metrics.threatChecksToday = 0;
        this.metrics.lastReset = now;
      }
    }, 60000);
  }

  recordRequest(path: string, duration: number, statusCode: number): void {
    this.metrics.requestCount++;
    this.metrics.responseTimes.push(duration);
    if (statusCode >= 400) {
      this.metrics.errorCount++;
    }
    // Limit array size to avoid memory issues
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes.shift();
    }
  }

  recordThreatCheck(): void {
    this.metrics.threatChecksToday++;
  }

  private calculatePercentile(percentile: number): number {
    if (this.metrics.responseTimes.length === 0) return 0;
    const sorted = [...this.metrics.responseTimes].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  getMetrics() {
    const p50 = this.calculatePercentile(50);
    const p95 = this.calculatePercentile(95);
    const p99 = this.calculatePercentile(99);
    const errorRate = (this.metrics.errorCount / (this.metrics.requestCount || 1)) * 100;
    
    return {
      requestCount: this.metrics.requestCount,
      errorRate: parseFloat(errorRate.toFixed(2)),
      avgLatency: this.metrics.responseTimes.length > 0 
        ? Math.round(this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length)
        : 0,
      p50, p95, p99,
      threatChecksToday: this.metrics.threatChecksToday
    };
  }

  async checkStellarHealth() {
    const start = Date.now();
    try {
      await axios.get('https://horizon-testnet.stellar.org');
      return { status: 'healthy', latency: Date.now() - start };
    } catch (err) {
      return { status: 'degraded', latency: Date.now() - start };
    }
  }

  async checkMLHealth() {
    const start = Date.now();
    try {
      const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:10000';
      await axios.get(`${mlUrl}/health`);
      return { status: 'healthy', latency: Date.now() - start };
    } catch (err) {
      return { status: 'unreachable', latency: Date.now() - start };
    }
  }
}

export const monitoring = new MonitoringService();
