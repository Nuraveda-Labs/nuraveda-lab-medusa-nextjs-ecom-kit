#!/usr/bin/env python3
"""Auto-cancel Medusa draft orders that are older than N hours and still awaiting payment.

Run hourly via systemd timer. Reads credentials from
your storefront's .env file or the environment.
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone

MEDUSA_URL = os.environ.get("MEDUSA_BACKEND_URL", "http://127.0.0.1:9000").rstrip("/")
ADMIN_EMAIL = os.environ["MEDUSA_ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["MEDUSA_ADMIN_PASSWORD"]
WEBHOOK_URL = os.environ.get(
    "ORDER_WEBHOOK_URL", "http://127.0.0.1:3000/api/webhooks/order-status"
)
WEBHOOK_SECRET = os.environ["ORDER_WEBHOOK_SECRET"]
MAX_AGE_HOURS = int(os.environ.get("DRAFT_MAX_AGE_HOURS", "24"))


def admin_token():
    req = urllib.request.Request(
        f"{MEDUSA_URL}/auth/user/emailpass",
        data=json.dumps({"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}).encode(),
        headers={"Content-Type": "application/json"},
    )
    return json.loads(urllib.request.urlopen(req, timeout=20).read())["token"]


def admin_call(method: str, path: str, token: str, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        f"{MEDUSA_URL}{path}",
        data=data,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method=method,
    )
    try:
        return json.loads(urllib.request.urlopen(req, timeout=30).read())
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:400]}


def post_canceled_email(order: dict, reason: str):
    customer = order.get("customer") or {}
    name = " ".join(filter(None, [customer.get("first_name"), customer.get("last_name")]))
    payload = {
        "stage": "canceled",
        "orderId": order.get("id"),
        "orderDisplayId": order.get("display_id"),
        "customerEmail": order.get("email"),
        "customerName": name or (order.get("email", "").split("@")[0] if order.get("email") else ""),
        "orderTotal": order.get("total"),
        "currencyCode": order.get("currency_code"),
        "reason": reason,
    }
    if not payload["customerEmail"]:
        return
    req = urllib.request.Request(
        WEBHOOK_URL,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json", "x-webhook-secret": WEBHOOK_SECRET},
        method="POST",
    )
    try:
        urllib.request.urlopen(req, timeout=15).read()
    except Exception as e:
        print(f"  email delivery failed for {order.get('id')}: {e}", file=sys.stderr)


def main():
    cutoff = datetime.now(timezone.utc) - timedelta(hours=MAX_AGE_HOURS)
    token = admin_token()

    # Fetch all draft orders — no built-in date filter on this endpoint
    drafts = []
    offset, page = 0, 100
    while True:
        resp = admin_call(
            "GET",
            f"/admin/draft-orders?limit={page}&offset={offset}&fields=id,display_id,email,status,total,currency_code,created_at,customer.first_name,customer.last_name,metadata",
            token,
        )
        batch = resp.get("draft_orders") or resp.get("orders") or []
        drafts += batch
        if len(batch) < page:
            break
        offset += page

    stale = []
    for d in drafts:
        created_raw = d.get("created_at")
        if not created_raw:
            continue
        try:
            created = datetime.fromisoformat(created_raw.replace("Z", "+00:00"))
        except ValueError:
            continue
        if created < cutoff and d.get("status") in (None, "draft"):
            stale.append(d)

    print(f"found {len(stale)} stale drafts (> {MAX_AGE_HOURS}h old) of {len(drafts)} total")

    for d in stale:
        oid = d["id"]
        display = d.get("display_id")
        print(f"  cancelling #{display} ({oid}) — created {d.get('created_at')}")
        result = admin_call("DELETE", f"/admin/draft-orders/{oid}", token)
        if "_error" in result:
            print(f"    DELETE failed: HTTP {result['_error']} {result['_body']}")
            continue
        post_canceled_email(d, f"Your order was canceled because we didn't receive payment within {MAX_AGE_HOURS} hours.")

    print("done")


if __name__ == "__main__":
    main()
