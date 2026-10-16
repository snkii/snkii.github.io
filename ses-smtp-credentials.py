#!/usr/bin/env python3
"""SES SMTP 인증 정보를 새로 만든다 (서울 리전, ses-smtp-user.20250522-164302).

IAM 접근 키를 하나 발급하고, AWS 문서의 방식대로 SMTP 비밀번호로 변환해 화면에만 출력한다.
파일로 저장하지 않는다. 출력된 값은 Gmail과 비밀번호 관리자에 넣고 터미널을 지우면 된다.
"""
import base64, hashlib, hmac, json, subprocess, sys

USER = "ses-smtp-user.20250522-164302"
REGION = "ap-northeast-2"


def smtp_password(secret: str, region: str) -> str:
    def sign(key, msg):
        return hmac.new(key, msg.encode(), hashlib.sha256).digest()
    sig = sign(("AWS4" + secret).encode(), "11111111")
    for part in (region, "ses", "aws4_request", "SendRawEmail"):
        sig = sign(sig, part)
    return base64.b64encode(bytes([0x04]) + sig).decode()


out = subprocess.run(["aws", "iam", "create-access-key", "--user-name", USER, "--output", "json"],
                     capture_output=True, text=True)
if out.returncode != 0:
    sys.exit("키 발급 실패:\n" + out.stderr)
key = json.loads(out.stdout)["AccessKey"]

print()
print("SMTP 서버   : email-smtp.%s.amazonaws.com  (포트 587, TLS)" % REGION)
print("사용자 이름 : " + key["AccessKeyId"])
print("비밀번호    : " + smtp_password(key["SecretAccessKey"], REGION))
print()
print("이 값은 다시 볼 수 없습니다. Gmail에 넣고 비밀번호 관리자에도 저장한 뒤 터미널을 지우세요 (cmd+K).")
