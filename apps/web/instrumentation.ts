export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setupApm } = await import('./instrumentation-node');
    await setupApm();
  }
}
