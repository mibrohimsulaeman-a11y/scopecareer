# PV-1 Scheduling & Follow-up Templates

Status: Ready for use  
Rule: Never include hypothesis names, intended answers, or product differentiation claims in any message.

---

## Screener-passed → scheduling invite

> Hi [first name],
>
> Thanks for your interest in the research session! I'd like to schedule your 25–35 minute screen-share.
>
> Here are some times (all [timezone]):
>
> - Option 1: [day, date, time]
> - Option 2: [day, date, time]
> - Option 3: [day, date, time]
>
> If none work, let me know what does.
>
> What to expect:
> - You'll share your screen while using a prototype with fictional data
> - I'll ask you to think out loud as you explore
> - No job applications or messages are sent; nothing is shared externally
> - Recording is optional and requires separate consent — let me know if you prefer no recording
>
> I'll send the meeting link once you confirm a slot.

---

## Confirmation + calendar hold

> Hi [first name], confirming our session on [date] at [time] ([timezone]).
>
> Meeting link: [link]
>
> Please have a stable internet connection and be ready to share your screen for about 30 minutes. You don't need to prepare anything in advance.

---

## Reminder (24h before)

> Hi [first name], looking forward to our session tomorrow at [time]. The meeting link is: [link]. See you then!

---

## Rescheduling request

> Hi [first name], no problem if you need to reschedule — here are alternative slots: [options]. Just let me know which works best.

---

## Post-session thank-you

> Hi [first name],
>
> Thank you for your time today — your input was genuinely useful.
>
> As mentioned, this is an early-stage research prototype; there is no public launch timeline to share yet. If you're open to a brief follow-up question later, I may reach out once more.
>
> Thanks again!

---

## No-response follow-up (after 5 business days from screener)

> Hi [first name], just following up on my earlier message about the research session. No pressure — if now isn't the right time, just let me know and I won't follow up again.

---

## Withdrawal / exclusion

> Hi [first name], thanks for your willingness to participate. Based on the screening criteria for this particular round, we've filled our participant mix. I appreciate your interest and will keep you in mind for future rounds if relevant.

---

## Pipeline update protocol

After each message exchange, update `participant_pipeline.json`:

| Event | New stage |
|---|---|
| Screener responses received | `sourced` → `screened` |
| Slot confirmed by participant | `screened` → `scheduled` |
| Session conducted + JSON saved | `scheduled` → `completed` |
| Participant withdraws or fails criteria | → `excluded` |

Set `updated_at` to today's ISO date on every stage change.
