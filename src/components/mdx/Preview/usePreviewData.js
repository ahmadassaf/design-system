'use client';

/**
 * usePreviewData hook
 *
 * @description Data layer for the link Preview component: fetches metadata for
 * a URL from the /api/preview endpoint with an LRU + TTL cache, in-flight
 * request deduplication, abort-on-unmount, and a stale-response guard.
 */

import { useEffect, useRef, useState } from 'react';

// npmjs.com returns 403 to metadata fetches, so previews are synthesized locally
export const NPM_HOSTNAME = 'npmjs.com';
export const NPM_FAVICON_URL = 'https://static.npmjs.com/58a19602036db1daee0d7863c94673a4.png';

// Screenshot / thumbnail service endpoints
export const MICROLINK_SCREENSHOT_API = 'https://api.microlink.io/';
export const YOUTUBE_THUMBNAIL_API = 'https://img.youtube.com/vi';
export const GITHUB_OPENGRAPH_API = 'https://opengraph.githubassets.com/1';

/**
 * Generate preview image URL based on platform
 */
export const getPreviewImageUrl = (url, data) => {
  try {
    if (data?.image) return data.image;

    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const { pathname } = urlObj;

    // YouTube video thumbnails
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      const videoId = hostname.includes('youtube.com') ? urlObj.searchParams.get('v') : pathname.slice(1);

      if (videoId) return `${YOUTUBE_THUMBNAIL_API}/${videoId}/maxresdefault.jpg`;
    }

    // GitHub repository OpenGraph cards
    if (hostname.includes('github.com')) {
      const [ owner, repo ] = pathname.split('/').filter(Boolean);

      if (owner && repo) return `${GITHUB_OPENGRAPH_API}/${owner}/${repo}`;
    }

    // Fallback to Microlink screenshot service
    return `${MICROLINK_SCREENSHOT_API}?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
  } catch {
    return null;
  }
};

// Simple LRU + TTL cache (Map preserves insertion order)
const CACHE_MAX_SIZE = 100;
const CACHE_TTL = 3600000; // 1 hour
const ERROR_CACHE_TTL = 60000; // Retry failed URLs after 1 minute

const previewCache = new Map();

const getCached = (url) => {
  const entry = previewCache.get(url);

  if (!entry) return null;

  const ttl = entry.data.error ? ERROR_CACHE_TTL : CACHE_TTL;

  if (Date.now() - entry.timestamp > ttl) {
    previewCache.delete(url);

    return null;
  }

  // Refresh recency (LRU)
  previewCache.delete(url);
  previewCache.set(url, entry);

  return entry.data;
};

const setCached = (url, data) => {
  if (previewCache.size >= CACHE_MAX_SIZE) previewCache.delete(previewCache.keys().next().value);

  previewCache.set(url, { data, 'timestamp': Date.now() });
};

// Request deduplication to prevent duplicate API calls for the same URL
const pendingRequests = new Map();

const getHostnameFallback = (url, fallback = url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return fallback;
  }
};

/**
 * Fetch preview metadata from the API with a timeout. Returns data or an
 * error-shaped object; throws on network failure.
 */
const fetchPreviewData = async(url, timeout) => {
  const controller = new AbortController();
  const safeTimeout = Number.isFinite(timeout) && timeout > 0 ? timeout : 20000;
  const timeoutId = setTimeout(() => controller.abort(), safeTimeout);

  try {
    const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`, {
      'cache': 'force-cache',
      'signal': controller.signal
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;

      try {
        const errorData = await response.json();
        const parsed = typeof errorData === 'string' ? JSON.parse(errorData) : errorData;

        errorMessage = parsed.error || errorMessage;
      } catch {

        // Keep the default message if the error body isn't parseable
      }

      return { 'error': true, errorMessage, 'status': response.status };
    }

    const parsedData = await response.json();

    if (!parsedData || typeof parsedData !== 'object') return {
      'error': true,
      'errorMessage': 'Preview response was empty',
      'status': 502
    };

    if (parsedData.error) return {
      'error': true,
      'errorMessage': parsedData.errorMessage || 'Failed to fetch preview',
      'status': parsedData.status || 404
    };

    return parsedData;
  } finally {
    clearTimeout(timeoutId);
  }
};

const withTitle = (data, customTitle) => (customTitle ? { ...data, 'title': customTitle } : data);

/**
 * Custom hook for fetching preview data with caching and deduplication
 */
export function usePreviewData(url, customTitle, options = {}) {
  const { previewData = null, skip = false, timeout = 20000 } = options;
  const [ state, setState ] = useState({ 'data': null, 'error': null, 'loading': true });
  const abortControllerRef = useRef(null);

  useEffect(() => {

    // Synchronous resolutions — no fetch needed
    if (previewData) {
      setState({ 'data': withTitle(previewData, customTitle), 'error': null, 'loading': false });

      return undefined;
    }

    if (skip) {
      setState({
        'data': { 'siteName': 'Internal', 'title': customTitle || url, 'type': 'internal' },
        'error': null,
        'loading': false
      });

      return undefined;
    }

    if (!url) {
      setState({ 'data': null, 'error': null, 'loading': false });

      return undefined;
    }

    // Synthesize npm package previews instead of fetching
    if (url.includes(NPM_HOSTNAME)) {
      const packageMatch = url.match(/npmjs\.com\/package\/(?<packageName>[^/]+)/);

      setState({
        'data': {
          'favicon': NPM_FAVICON_URL,
          'siteName': 'npm',
          'title': customTitle || packageMatch?.groups?.packageName || 'npm package',
          'type': 'package'
        },
        'error': null,
        'loading': false
      });

      return undefined;
    }

    const cached = getCached(url);

    if (cached) {
      setState({ 'data': withTitle(cached, customTitle), 'error': null, 'loading': false });

      return undefined;
    }

    // Stale-response guard: aborted on unmount or when the url/options change,
    // so a slow response for a previous url can't overwrite the current one
    const controller = new AbortController();

    abortControllerRef.current = controller;
    setState({ 'data': null, 'error': null, 'loading': true });

    const run = async() => {

      // Deduplicate concurrent requests for the same URL
      let request = pendingRequests.get(url);

      if (!request) {
        request = fetchPreviewData(url, timeout);
        pendingRequests.set(url, request);
        request.finally(() => pendingRequests.delete(url)).catch(() => {});
      }

      try {
        const result = await request;

        if (controller.signal.aborted) return;

        setCached(url, result);

        const resolvedTitle = result.error ? { 'title': customTitle || getHostnameFallback(url) } : {};

        setState({ 'data': { ...withTitle(result, customTitle), ...resolvedTitle }, 'error': null, 'loading': false });
      } catch (err) {
        if (controller.signal.aborted) return;

        let fallbackTitle = customTitle || url;

        try {
          fallbackTitle = customTitle || new URL(url).hostname;
        } catch {

          // If URL parsing fails, keep the raw URL
        }

        const errorData = {
          'error': true,
          'errorMessage': err?.message || 'Failed to fetch preview',
          'status': err?.status || 404,
          'title': fallbackTitle
        };

        // Cache error responses (short TTL) to prevent retry loops
        setCached(url, errorData);

        setState({
          'data': errorData,
          'error': err?.name !== 'AbortError' && !String(err?.message || '').includes('HTTP') ? err : null,
          'loading': false
        });
      }
    };

    run();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [ url, customTitle, previewData, skip, timeout ]);

  return state;
}

export default usePreviewData;
