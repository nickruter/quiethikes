# quiethikes
AWS s3 bucket 

# quiethikes.org — Infrastructure Summary

## S3 Bucket
- **Bucket:** `quiethikes.org` (us-east-1)
- **Website:** Static hosting enabled (`index.html` / `error.html`)
- **Access:** Public read via bucket policy
- **Encryption:** SSE-S3 (AES256)
- **Versioning:** Not enabled

## CloudFront Distribution
- **Distribution ID:** `E1N8DXETHGJG77`
- **Domain:** `quiethikes.org`
- **CDN Domain:** `d13ijhugwsguv7.cloudfront.net`
- **Origin:** S3 website endpoint (`quiethikes.org.s3-website-us-east-1.amazonaws.com`)
- **HTTPS:** Redirect HTTP → HTTPS (TLS 1.2+)
- **SSL:** Custom ACM certificate
- **WAF:** Enabled
- **Compression:** Enabled
- **Edge Locations:** Worldwide

## Architecture

