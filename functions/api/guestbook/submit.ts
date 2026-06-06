import {
  type GuestbookContext,
  optionsResponse,
  submitGuestbookEntry,
} from '../../_lib/guestbook';

export const onRequestOptions = () => optionsResponse();

export const onRequestPost = async ({ request, env }: GuestbookContext) =>
  submitGuestbookEntry(request, env);
