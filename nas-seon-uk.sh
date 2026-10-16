#!/bin/bash
# nas.seon.uk 를 시놀로지에 추가한다 (기존 nas.seonuk.kim 은 그대로 둔다).
#  1) 역방향 프록시 규칙 추가: nas.seon.uk:443 -> 127.0.0.1:5001
#  2) Let's Encrypt 인증서 발급 (nas.seon.uk)
#  3) 새 인증서를 nas.seon.uk 프록시 규칙에 연결
# 실행: sudo bash ~/nas-seon-uk.sh
set -euo pipefail

NEW=nas.seon.uk
API=/usr/syno/bin/synowebapi
[ "$(id -u)" = 0 ] || { echo "sudo 로 실행하세요: sudo bash $0"; exit 1; }

BK=/root/nas-seon-uk-backup-$(date +%Y%m%d-%H%M%S)
mkdir -p "$BK"
cp -a /usr/syno/etc/www/ReverseProxy.json "$BK/"
cp -a /usr/syno/etc/certificate/_archive/INFO "$BK/cert-INFO"
echo "백업: $BK"

call() { "$API" --exec "$@" 2>/dev/null; }
ok() { python3 -c 'import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get("success") else 1)'; }

echo "== 1) 역방향 프록시 규칙"
if grep -q "\"fqdn\" : \"$NEW\"" /usr/syno/etc/www/ReverseProxy.json; then
  echo "이미 있음, 건너뜀"
else
  ENTRY=$(cat <<EOF
{"description":"$NEW","backend":{"fqdn":"127.0.0.1","port":5001,"protocol":1},"frontend":{"acl":null,"fqdn":"$NEW","port":443,"protocol":1,"https":{"hsts":true}},"customize_headers":[],"proxy_connect_timeout":60,"proxy_read_timeout":60,"proxy_send_timeout":60,"proxy_http_version":1,"proxy_intercept_errors":false}
EOF
)
  OUT=$(call api=SYNO.Core.AppPortal.ReverseProxy method=create version=1 entry="$ENTRY")
  echo "$OUT"
  echo "$OUT" | ok || { echo "프록시 규칙 추가 실패"; exit 1; }
fi

echo "== 2) Let's Encrypt 인증서"
EMAIL=$(call api=SYNO.Core.Certificate.LetsEncrypt.Account method=list version=1 \
  | python3 -c 'import json,sys; d=json.load(sys.stdin)["data"]; a=d.get("accounts",d) if isinstance(d,dict) else d; print(a[0]["email"] if a else "")' 2>/dev/null || true)
[ -n "$EMAIL" ] || read -rp "Let's Encrypt 이메일: " EMAIL
echo "이메일: $EMAIL"
OUT=$(call api=SYNO.Core.Certificate.LetsEncrypt method=create version=1 \
  id='""' desc="\"$NEW\"" as_default=false domain_name="\"$NEW\"" email="\"$EMAIL\"" alt_names='""')
echo "$OUT"
echo "$OUT" | ok || { echo "인증서 발급 실패 (외부에서 80번 포트가 NAS로 열려 있어야 합니다)"; exit 1; }

echo "== 3) 인증서를 프록시 규칙에 연결"
call api=SYNO.Core.Certificate.CRT method=list version=1 > /tmp/crt.json
SETTINGS=$(NEW="$NEW" python3 - <<'PY'
import json, os
new = os.environ["NEW"]
certs = json.load(open("/tmp/crt.json"))["data"]["certificates"]
target = next(c for c in certs if c.get("subject", {}).get("common_name") == new)
for c in certs:
    for s in c.get("services", []):
        if new in (s.get("display_name"), s.get("service")) or new in json.dumps(s):
            if c["id"] == target["id"]:
                raise SystemExit("ALREADY")
            print(json.dumps([{"service": s, "old_id": c["id"], "id": target["id"]}]))
            raise SystemExit
raise SystemExit("NOTFOUND")
PY
) || true
case "$SETTINGS" in
  ALREADY|"") echo "이미 연결돼 있거나 서비스 항목을 못 찾았습니다. DSM > 보안 > 인증서 > 설정에서 확인하세요." ;;
  NOTFOUND)   echo "서비스 항목을 못 찾았습니다. DSM > 보안 > 인증서 > 설정에서 $NEW 에 새 인증서를 직접 고르세요." ;;
  *)
    OUT=$(call api=SYNO.Core.Certificate.Service method=set version=1 settings="$SETTINGS")
    echo "$OUT"
    echo "$OUT" | ok && echo "연결 완료" || echo "연결 실패: DSM > 보안 > 인증서 > 설정에서 직접 고르세요." ;;
esac
rm -f /tmp/crt.json
echo "== 끝"
