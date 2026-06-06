import {
  type GuestbookContext,
  listGuestbookEntries,
  optionsResponse,
  parseCursor,
} from '../../_lib/guestbook';

export const onRequestOptions = () => optionsResponse();

export const onRequestGet = async ({ request, env }: GuestbookContext) => {
  const cursor = parseCursor(request);
  return listGuestbookEntries(env.DB, cursor);
};
