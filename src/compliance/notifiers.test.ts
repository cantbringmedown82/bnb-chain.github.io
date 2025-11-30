/**
 * Tests for notifiers withRetry function
 */

import { withRetry, withTimeout } from './notifiers';

describe('withRetry', () => {
  test('succeeds on first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const result = await withRetry(fn, 3, 10);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('retries on failure and succeeds', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');

    const result = await withRetry(fn, 3, 10);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('throws after all retries exhausted', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));

    await expect(withRetry(fn, 3, 10)).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  test('uses default attempts and delay', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    await withRetry(fn);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('handles non-Error rejections', async () => {
    const fn = jest.fn().mockRejectedValue('string error');

    await expect(withRetry(fn, 2, 10)).rejects.toThrow('string error');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('withTimeout', () => {
  test('succeeds before timeout', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const result = await withTimeout(fn, 1000);

    expect(result).toBe('success');
  });

  test('throws on timeout', async () => {
    const fn = jest.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('late'), 200))
    );

    await expect(withTimeout(fn, 50)).rejects.toThrow('Operation timed out after 50ms');
  });

  test('uses default timeout', async () => {
    const fn = jest.fn().mockResolvedValue('success');

    const result = await withTimeout(fn);

    expect(result).toBe('success');
  });
});
