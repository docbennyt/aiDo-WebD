export function sitePattern(value) {
  let url;
  try { url = new URL(value.trim()); } catch { return null; }
  if (!['http:','https:'].includes(url.protocol) || !url.hostname || url.username || url.password || url.hostname.includes('*')) return null;
  return url.protocol+'//'+url.hostname+'/*';
}
export function accessMessage(error) {
  const message=String(error?.message || error || '');
  if (/chrome web store|extensions gallery|cannot access a chrome|restricted|administrator|policy/i.test(message)) return 'This page is restricted by the browser. Select an ordinary website instead.';
  if (/permission|cannot access|host|not allowed/i.test(message)) return 'Site access is missing. Click the WebD toolbar icon on the page, or allow this site below.';
  return 'Could not start the picker. Reopen WebD on the target tab and try again.';
}
