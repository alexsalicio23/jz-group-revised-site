# JZ Group Website Security and Privacy Operations

Last reviewed: August 27, 2026

This runbook supports the public privacy notice and the technical controls in the JZ Group website. It is an operating checklist, not a legal certification. JZ Group should have Florida counsel review the public policies and this schedule before launch and after material changes.

## Data inventory

| Flow | Data | System | Purpose |
| --- | --- | --- | --- |
| Project inquiry | Business name, company, work email, optional phone, scope, location, facility status, timeline, plan-room URL | Vercel Function, Resend, delivery mailbox | Evaluate and respond to project opportunities |
| Website operations | IP, user agent, request path, timestamp, diagnostics | Vercel | Hosting, security, troubleshooting |
| Web analytics | Page path without query string, referrer, coarse location, device/browser, anonymous daily visitor hash | Vercel Web Analytics | Aggregate site measurement |
| Performance | Page path without query string and Core Web Vitals | Vercel Speed Insights | Performance monitoring |
| Client portal | Essential signed session cookie; no visitor profile | Browser and Vercel Function | Authorized portal access |

Public file uploads are disabled. Confidential files must remain in an access-controlled plan room. Credentials must be transmitted separately.

## Launch control status

Status recorded August 27, 2026:

- Resend is provisioned through the Vercel Marketplace on the free plan for `jzgroupmiami.com`; SPF and DKIM records are present and the resource is completing provider onboarding.
- DMARC is enabled in monitoring mode with strict SPF and DKIM alignment. Move from `p=none` to enforcement only after legitimate delivery has been reviewed.
- All four service lanes deliver to the verified central mailbox `estimating@jzdemo.com`. Do not publish division-specific addresses until each mailbox is confirmed operational.
- Vercel WAF logging rules are active for `POST /api/contact` and `POST /api/client-portal/login`. Review traffic before replacing either rule with rate-limit enforcement.
- Vercel reports one owner account and MFA is not enabled. Enabling MFA is a launch blocker.
- GitHub `main` has no branch-protection rule, Dependabot alerts are disabled, and the local GitHub session belongs to a collaborator with push access rather than the repository owner. The owner must review and correct these controls.
- `jzgroupmiami.com` does not yet have inbound MX service for `privacy@` or `security@`; the public policies therefore use the monitored estimating mailbox as an interim contact.

## Access and account controls

1. Require MFA on Vercel, GitHub, Resend, Namecheap, and every delivery mailbox.
2. Give each person an individual account. Do not share owner credentials.
3. Keep at least two trusted administrators on domain and hosting accounts.
4. Review administrators and API keys quarterly and immediately after staffing changes.
5. Rotate the client portal password before sharing it with a client and after any suspected disclosure.
6. Store recovery codes offline in a controlled company record.

## Retention and disposal

1. Review unconverted website inquiries after 12 months of inactivity. Delete inquiries that no longer serve a bid, contract, claim, or legal purpose.
2. Move records needed for an active bid or contract into the approved project system and remove unnecessary duplicates from personal inboxes.
3. Do not download plan-room files to unmanaged personal devices.
4. When deleting customer records, remove them from active mailboxes, exports, shared drives, and local downloads using the platform's secure deletion controls.
5. Suspend routine deletion for records covered by a legal hold, active dispute, insurer request, or statutory obligation.
6. Document the date, record category, person responsible, and disposition for each annual retention review.

## Security incident response

1. Contain: revoke exposed sessions, credentials, keys, and links. Preserve relevant logs and do not destroy evidence.
2. Escalate: notify the designated JZ incident owner, website administrator, counsel, insurer, and affected vendors.
3. Investigate: identify the systems, dates, data categories, individuals, and likely harm involved. Record decisions in writing.
4. Florida timing: a third-party agent must notify a covered entity no later than 10 days after determining a breach. Required notices to affected Florida individuals and, for 500 or more affected Florida residents, the Florida Department of Legal Affairs generally must occur no later than 30 days after determining the breach, subject to statutory exceptions.
5. If JZ concludes notice is not required because financial harm is not likely, involve counsel and preserve the written determination for at least five years as required by Florida law.
6. Recover: fix the root cause, validate controls, restore service, and monitor for recurrence.
7. Learn: record the timeline, impact, decisions, notifications, remediation, and follow-up owner.

## Monthly launch checks

- Run `npm audit --omit=dev` and remediate supported production findings.
- Run `npm run lint`, `npm run build`, and `npm run test:e2e` before production promotion.
- Run `npm run check:security -- https://www.jzgroupmiami.com` after deployment.
- Confirm the contact route delivers to each intended mailbox.
- Confirm Resend open and click tracking remain disabled for transactional messages.
- Review Vercel Firewall activity and portal login failures.
- Verify Privacy, Terms, Accessibility, `robots.txt`, `sitemap.xml`, and `/.well-known/security.txt` are reachable.

## Account-level launch controls

These controls cannot be guaranteed by code in this repository:

- Enable MFA and individual accounts for every provider.
- Enable Vercel Bot Protection in log mode, review legitimate traffic, then move to challenge mode.
- Add Vercel WAF rate limits for `POST /api/contact` and `POST /api/client-portal/login`; stage in log mode before enforcement.
- Sign or accept the Resend Data Processing Addendum and document its subprocessors.
- Confirm the delivery mailbox retention and deletion schedule with JZ management.
- Create a dedicated monitored privacy/security mailbox and replace the interim estimating address.
- Review cyber-liability insurance notification requirements and vendor contacts.

## Annual review

Review this runbook and the public Privacy Notice at least annually and whenever the site adds marketing cookies, advertising, a CRM, user accounts, payments, employment applications, location tracking, or collection of sensitive personal data.
