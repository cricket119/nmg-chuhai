#!/bin/zsh
# 部署到正式站 https://www.mrchuhai.com（阿里云 OSS 香港 mrchuhai-site + CDN）
# 用法：./deploy.sh            全量（index.html + assets/）
#       ./deploy.sh 文件...    只传指定文件，如 ./deploy.sh assets/js/feed.js
set -e
cd "${0:a:h}"
B=oss://mrchuhai-site
FILES=("$@")
[ ${#FILES} -eq 0 ] && FILES=(index.html ${(f)"$(find assets -type f ! -name '.DS_Store')"})
URLS=()
for f in $FILES; do
  ossutil cp -f "$f" "$B/$f" --cache-control no-cache >/dev/null
  [ "$(md5 -q "$f" | tr a-z A-Z)" = "$(ossutil stat "$B/$f" | awk 'tolower($0)~/etag/{gsub(/"/,"",$NF);print $NF}')" ] || { echo "校验失败: $f"; exit 1; }
  for h in www.mrchuhai.com mrchuhai.com; do URLS+="https://$h/$f"; [ "$f" = index.html ] && URLS+="https://$h/"; done
  echo "已上传 $f"
done
aliyun cdn RefreshObjectCaches --region cn-hangzhou --ObjectType File --ObjectPath "${(F)URLS}" >/dev/null && echo "CDN 已刷新 ${#URLS} 个 URL"
