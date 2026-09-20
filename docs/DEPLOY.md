# Yayına Alma (Deploy)

Site **moonauto.com.tr** adresinde, cPanel paylaşımlı hostingde yayında.
Deploy tamamen GitHub Actions üzerinden yapılır — kimsenin sunucu şifresine
veya SSH anahtarına ihtiyacı yoktur.

## Değişikliğini nasıl yayınlarsın

```bash
git clone https://github.com/mehmettali/moon-auto-rize.git
cd moon-auto-rize
npm install
npm run dev          # http://localhost:4321 — değişikliği burada gör
```

Memnunsan:

```bash
git add -A
git commit -m "ne değiştirdiğini yaz"
git push origin main
```

`main`'e push ettiğin an **Deploy (cPanel)** action'ı tetiklenir: siteyi build eder,
sunucuya yükler ve sitenin açıldığını doğrular. Yaklaşık 1–2 dakika sürer.

Durumu şuradan izle: **Actions** sekmesi → *Deploy (cPanel)*.
Push etmeden elle tetiklemek istersen aynı sayfada **Run workflow** düğmesi var.

Action yeşil yanmazsa değişiklik **sunucuya gitmemiştir** — log'a bak, düzelt, tekrar push et.

## Nasıl çalışıyor

```
main'e push
   └─ npm ci && npm run build      →  dist/ (statik HTML)
        └─ lftp, SFTP ile dist/ → /home/moonauto/public_html/
             └─ curl ile https://moonauto.com.tr/ 200 mü diye kontrol
```

Sunucuda cPanel hesabında **shell erişimi kapalı**. Bu yüzden `rsync` veya sunucuda
`git pull` çalıştıran yöntemler kullanılamaz — ikisi de uzak tarafta kabuk ister.
Onun yerine `lftp`, SFTP protokolü üzerinden dosyaları aynalar.

**Senkronizasyon davranışı:** ekler ve günceller, **hiçbir şey silmez.** Repodan bir
sayfa silersen sunucudaki kopyası kendiliğinden kaybolmaz; cPanel Dosya Yöneticisi'nden
elle silmen gerekir. (`.well-known` ve `cgi-bin` gibi cPanel'e ait klasörler bu sayede
güvende kalıyor.)

## Ayarlar nerede

Sunucu bilgileri repo **Settings → Secrets and variables → Actions** altında:

| Secret | İçerik |
|---|---|
| `DEPLOY_HOST` | Sunucu IP |
| `DEPLOY_PORT` | SSH portu |
| `DEPLOY_USER` | cPanel kullanıcı adı |
| `DEPLOY_PATH` | `/home/moonauto/public_html` |
| `DEPLOY_SSH_KEY` | Deploy'a özel ed25519 private key (parolasız) |
| `DEPLOY_KNOWN_HOSTS` | Sunucunun host anahtarı — sahte sunucuya bağlanmayı engeller |

Bu anahtar yalnızca deploy için üretildi ve cPanel'de `moonauto_gh` adıyla yetkili.
Sızdığından şüphelenirsen: cPanel → SSH Access → Manage SSH Keys → `moonauto_gh` → Delete,
sonra yeni çift üretip `DEPLOY_SSH_KEY` secret'ını güncelle. Kişisel `moon_ssh`
anahtarın bundan etkilenmez.

## Dikkat

- **Cloudflare önde.** DNS Cloudflare üzerinden geliyor. HTML sayfalarda sorun çıkarmaz,
  ama eski bir dosya inatla görünürse Cloudflare → Caching → Purge Everything.
- `scripts/deploy-vps.sh` **bu sunucu için geçersiz.** Root'lu bir VPS'e nginx kurup
  `rsync` ile atmak üzere yazılmış; cPanel'de çalışmaz. Çalıştırma.
