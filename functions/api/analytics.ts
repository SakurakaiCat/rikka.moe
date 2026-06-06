import {
  type AnalyticsContext,
  jsonResponse,
  optionsResponse,
  recordVisitAndGetStats,
} from '../_lib/analytics';

export const onRequestOptions = () => optionsResponse();

export const onRequestGet = async ({ request, env }: AnalyticsContext) => {
  const result = await recordVisitAndGetStats(request, env);
  const { setCookie, ...body } = result;
  const headers = setCookie ? { 'set-cookie': setCookie } : undefined;

  return jsonResponse(body, {
    headers,
  });
};
