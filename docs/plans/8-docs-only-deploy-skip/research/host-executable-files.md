# Which uploaded files can run code or change server behaviour on a LiteSpeed cPanel host

## Question

Which file names and extensions can make a LiteSpeed-on-cPanel shared host (Spaceship, live
site answering `server: LiteSpeed`) execute, interpret or obey an uploaded file, so that the
publish job for `docs/` refuses them? Requirements the answer has to meet:

- the check is a short POSIX shell step on Ubuntu, using `find ... -iname`, run before the
  FTP upload of everything under `docs/` to `https://spartanlaboratories.org/OrganizationPage/docs/`;
- it refuses the whole run when a matching file exists, rather than dropping the file;
- `docs/` holds HTML, JavaScript, JSON and Markdown today, plus diagram sources (`.dsl`) and
  images, and gains more static types over time, so the check must not break on new inert types.

## Bottom line

- **Use a refusal list, not an allow list.** On this stack execution needs a handler mapped to
  a name, and the set of mapped names is small and closed: PHP, CGI/Perl, server-side includes,
  and the config files that can map more (`.htaccess`) or tune PHP (`.user.ini`, `php.ini`).
  Everything else is served as inert bytes. A refusal list never blocks a new inert type; an
  allow list fails the publish on `main` the first time someone adds a `.yaml`, and still needs
  the refusal patterns to catch `name.php.md`.
- **Match case-insensitively and match inner dot-segments, not only the last extension.**
  Extension matching on the Apache-style config this stack inherits is case-insensitive, and
  Apache-style `AddHandler` compares every dot-separated part of a name, so `x.php.jpg` can run
  as PHP. The LiteSpeed engine's open-source sibling looks only at the last suffix, and
  LiteSpeed Enterprise (what Spaceship runs) is closed source, so inner segments are treated as
  dangerous.
- **`.htaccess` is the most important name to refuse.** cPanel sets `AllowOverride All`
  globally, so a single `.htaccess` in `docs/` can map any extension (including `.md` or
  `.json`) to PHP or CGI, add `Options +ExecCGI`, rewrite, redirect or set headers for the
  whole subtree.
- **Recommended `find` expression** (full text under *Recommendation*): `.htaccess`,
  `.htpasswd`, `.user.ini`, `php.ini`, `*.php*`, `*.pht*`, `*.phar*`, `*.cgi*`, `*.pl`,
  `*.pl.*`, `*.plx*`, `*.ppl*`, `*.perl*`, `*.shtm*`, all with `-iname`, no `-type` filter.
  It passes `.html`, `.js`, `.json`, `.md`, `.dsl`, `.puml`, `.plantuml`, images and `.py`.
- A name-based check cannot detect a handler the host maps onto an inert extension at account
  level (for example `.html` parsed as PHP); that is a property of the account, not of the
  repository, and is listed under *Gaps*.

## Findings

### 1. What the host executes or honours by default

**1a. Spaceship's configuration (common practice for the platform; Spaceship's pages are
inferred from a search summary).** Spaceship's shared hosting lists LiteSpeed, CloudLinux and
cPanel as standard features; its knowledgebase describes `.htaccess` as a directory-level
configuration file whose changes apply instantly, and describes a per-domain `php.ini` and a
PHP Tweaks plugin. My tools received HTTP 403 from every `spaceship.com` page, so this is
second-hand; no Spaceship page was read directly. The configuration below is therefore
inferred from cPanel's EasyApache 4 defaults and LiteSpeed's documented cPanel behaviour.
Evidence tier: common practice, platform inferred. Applies to: search results of 2026-11-08.

**1b. PHP handler extensions (common practice, two independent cPanel-generated files).**
cPanel writes a block into an account's `.htaccess` when the PHP version is chosen:
`AddHandler application/x-httpd-ea-php81 .php .php8 .phtml` (PHP 8.1) and
`AddHandler application/x-httpd-ea-php70 .php .php7 .phtml` (PHP 7.0). So `.php`, one
major-version-numbered extension (`.php7`, `.php8`), and `.phtml` are mapped by default;
`.php5` and `.php56` appear in older generated blocks. cPanel's own mitigation file lists the
set it treats as PHP: `.php`, `.php5`, `.php7`, `.php8`, `.phtml`. LiteSpeed additionally
treats a PHP handler's ID as a suffix and accepts extra "Handled Suffixes" per handler, so the
mapped set is not fixed by LiteSpeed alone. `.phar`, `.pht` and `.phps` are not in cPanel's
generated lists; they are included in the recommended patterns because they are PHP-family
names that cost nothing to refuse and could be mapped by a handler line. Sources: the
`myuom` and `sidega-master` repositories' pasted cPanel blocks (dated by their PHP versions),
[`php_add_handler_fix.conf`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/php_add_handler_fix.conf)
at commit `ee51d1c` (2026-11-02), and LiteSpeed's
[PHP configuration page](https://docs.litespeedtech.com/lsws/extapp/php/getting_started/).

**1c. `.htaccess` is read and obeyed (established consensus for this stack).** LiteSpeed
reads Apache-style `.htaccess` files directly; the cPanel EasyApache template sets
`AllowOverride All` for `<Directory "/">` unless a server tweak turns it off, and cPanel's
vhost template sets `Options -ExecCGI -Includes` and removes the CGI handler only for accounts
without CGI. `AddHandler` is a `.htaccess`-legal directive with the `FileInfo` override.
LiteSpeed's cPanel PHP page states "LiteSpeed uses .htaccess" for PHP settings, and its
standalone guide enables the same with "Allow Override: Select every box except None".
Sources: [`ea4_main.default`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/ea4_main.default)
and [`vhost.default`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/vhost.default)
at `ee51d1c`; [mod_mime `AddHandler`](https://github.com/apache/httpd/blob/2.4.62/docs/manual/mod/mod_mime.xml)
at Apache 2.4.62; [LiteSpeed per-user php.ini page](https://docs.litespeedtech.com/lsws/cp/cpanel/php-user-ini/)
(page dated 2026-08-14).

**1d. `.user.ini` and `php.ini` (established consensus: off or inert by default here).**
LiteSpeed's PHP SAPI parses `.user.ini` only when the environment variable
`LSPHP_ENABLE_USER_INI` is set to `on`; LiteSpeed's docs also say `.user.ini` "is not intended
for use with LiteSpeed Web Server". A `php.ini` is read only from the location the server's
`PHPRC` points at (the account or domain document root); `docs/` sits in a subfolder of the
site root, so a `php.ini` there is not loaded. Both files only configure PHP scripts, so
neither does anything without a PHP file to run. They are still worth refusing: cPanel itself
lists `.htaccess`, `.htpasswd`, `.user.ini` and `php.ini` in its "Required cPanel security
policy" `FilesMatch`, and the cost is two names. Tier: established consensus (host source
code and docs agree) that they are inert by default; the refusal is cheap belt-and-braces.
Sources: [`lsapi_main.c`](https://github.com/php/php-src/blob/php-8.3.0/sapi/litespeed/lsapi_main.c)
at `php-8.3.0` (`PHP_MINIT_FUNCTION(litespeed)`); LiteSpeed per-user php.ini page above;
[`ea4_main.default`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/ea4_main.default).

**1e. CGI and Perl (common practice; needs the account's CGI feature).** cPanel's global
Apache configuration maps `.cgi .pl .plx .ppl .perl` to `cgi-script`. A vhost for an account
without CGI gets `Options -ExecCGI -Includes` and `RemoveHandler cgi-script .cgi .pl .plx .ppl
.perl`; an account with CGI keeps the mapping, and `Options +ExecCGI` is also settable in
`.htaccess` under `AllowOverride All`. Whether Spaceship enables CGI on this account is not
known from my sources, so `.cgi`, `.pl`, `.plx`, `.ppl`, `.perl` are refused. `.py`, `.rb`,
`.sh` and `.js` have no default handler on this stack; they run only if a `.htaccess` (already
refused) or an account-level handler maps them. Source: `ea4_main.default` and `vhost.default`
at `ee51d1c`.

**1f. Server-side includes (common practice; LiteSpeed's own SSI behaviour not confirmed).**
cPanel's global configuration declares `AddType text/html .shtml` and
`AddHandler server-parsed .shtml`; the same `Options -Includes` applies to accounts without
CGI. I found no LiteSpeed Enterprise document stating that `.shtml` is parsed. The name is
refused anyway, with `.shtm`, because its cost is nil. Source: `ea4_main.default` at `ee51d1c`.

**1g. Other names that change server behaviour.** `.htpasswd` is data, not configuration: it
does nothing unless an `.htaccess` references it, so it is covered only to keep the pair
together with `.htaccess`. `web.config` is IIS configuration and LiteSpeed ignores it (OWASP
lists it for IIS); it is not in the recommended list. The FTP-Deploy-Action default `exclude`
(`**/.git*`, `**/.git*/**`, `**/node_modules/**`) does not exclude `.htaccess`,
`.user.ini` or any extension above, so nothing downstream of the check removes them.
Source: [FTP-Deploy-Action README](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.4.0/README.md)
at `v4.4.0`.

### 2. Double extensions (`name.php.txt`, `name.php.jpg`)

Whether a double extension executes depends on how the handler is matched. Tier: established
consensus for Apache-style matching; one source (the engine's source code) for LiteSpeed.

- **Apache-style `AddHandler` (mod_mime): yes.** "Filenames may have multiple extensions and
  the extension argument will be compared against each of them", and Apache's page says that
  if you want only the last part mapped, do not use the `Add*` directives. cPanel's own
  `php_add_handler_fix.conf` exists because of this: its comment reads "e.g. we do not want
  logo.php.png to be handled by PHP", and it strips the PHP handler unless the name *ends* in
  a PHP extension, matching case-insensitively with `(?i)`. It is installed for Apache under
  `/etc/apache2/conf.d`; whether LiteSpeed applies it is not documented, so it cannot be
  relied on.
- **LiteSpeed engine: last suffix only (open-source sibling).** In OpenLiteSpeed at commit
  `031b2c8` (2026-11-01), `findSuffix` returns only the text after the last `.` of the URI
  and `HttpContext::determineMime` lowercases it before the lookup; LiteSpeed's docs say its
  "script handlers use MIME types, not suffixes". OpenLiteSpeed also answers 403 for a MIME
  type of the form `application/x-httpd-*` rather than serving it as a static file. This
  suggests `x.php.jpg` is served as an image and `x.jpg.php` runs, but LiteSpeed Enterprise
  is closed source and cPanel's Apache-to-LiteSpeed translation of `AddHandler` is not
  documented, so the behaviour on Spaceship is unconfirmed.
- Names that end in an extra dot or space (`x.php.`, `x.php `) are not covered by an
  exact-extension test; a trailing `*` in the pattern covers them.

Sources: [mod_mime.xml](https://github.com/apache/httpd/blob/2.4.62/docs/manual/mod/mod_mime.xml)
at 2.4.62; [`php_add_handler_fix.conf`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/php_add_handler_fix.conf);
[`httpreq.cpp`](https://github.com/litespeedtech/openlitespeed/blob/031b2c8973b3d377efad54f165decd5ce8b9a4a5/src/http/httpreq.cpp)
(`findSuffix`, `HttpReq::setMimeBySuffix`) and
[`httpcontext.cpp`](https://github.com/litespeedtech/openlitespeed/blob/031b2c8973b3d377efad54f165decd5ce8b9a4a5/src/http/httpcontext.cpp)
(`HttpContext::determineMime`); [LiteSpeed Script Handler](https://www.litespeedtech.com/docs/webserver/config/scripthandler).

### 3. Case sensitivity

The check must match case-insensitively. Tier: established consensus.

- Apache: "The extension argument is case-insensitive" for `AddHandler`, `AddType` and the
  other `Add*` directives, so `NAME.PHP` and `NAME.Php` are handled as PHP.
- cPanel's own fix file uses `(?i)`; OpenLiteSpeed lowercases the suffix
  (`StringTool::strnlower`) before the MIME lookup.
- OWASP lists "Case manipulation, e.g. `.pHp`, `.phP`, to bypass case-sensitive blocklist
  filters" as a bypass.
- Whether `.HTACCESS` is read depends on the filesystem (Linux is case-sensitive); I did not
  establish it either way, and `-iname` removes the question.

POSIX `find -iname` is an extension to the strict POSIX specification, but it is present in
GNU findutils on the `ubuntu-latest` runner, which is the only place the step runs.

### 4. Refusal list or allow list

Tier: reasoning from sources (OWASP on one side, the host's own mapping on the other); the
two recommendations diverge on the threat model, and that is the axis.

- **OWASP's position.** The File Upload Cheat Sheet says to "ensure the usage of
  business-critical extensions only" (an allow list) and that "blocking specific extensions is
  a weak protection method on its own". That guidance is written for files chosen by an
  untrusted uploader, who will try double extensions, case changes and null bytes. The files
  in `docs/` are committed and merged by the maintainer; the check is a guard against a stray
  or generated file, not a boundary against an attacker choosing names.
- **What a refusal list misses.** Any handler the account maps onto a name not on the list.
  The set that the cPanel/LiteSpeed stack maps by default is enumerated above, so the list
  covers the default mapping; it cannot see a custom account-level mapping, and neither can an
  allow list (an allowed `.html` mapped to PHP is still allowed).
- **What an allow list misses and breaks.** On its own it checks the last extension, so
  `report.php.md` passes: it needs the same dangerous-segment patterns as a refusal list to be
  safe on an Apache-style handler. And it fails the publish on `main` for every new inert
  type (`.yaml`, `.csv`, `.woff2`), after the merge, leaving the live copy stale until someone
  edits the workflow. Since the job refuses rather than drops, the failure is loud, but it is
  recurring friction, and the usual response to recurring friction is to widen the list until
  it means nothing.
- **Where an allow list would win.** If the folder ever receives files from parties other
  than the maintainer, or if the host's handler set were unknown and open-ended. Neither
  holds here, and a refusal list can be switched to an allow list later without changing the
  step's shape.

## How comparable projects do it

- **cPanel EasyApache 4** ([`CpanelInc/ea-apache24-config`](https://github.com/CpanelInc/ea-apache24-config/tree/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES),
  commit `ee51d1c`) ships a refusal-style guard: `php_add_handler_fix.conf` with
  `<FilesMatch "(?i)(?<!\.php|\.php5|\.php7|\.php8|\.phtml)$"> RemoveHandler .php .php5 .php7
  .php8 .phtml`, and a `FilesMatch "^(\.ht(access|passwds?)|\.user\.ini|php\.ini)$"` that
  denies remote access to those files. Both are enumerations of the same names recommended
  below, not allow lists.
- **OWASP File Upload Cheat Sheet** pairs an allow list with a block-list layer for
  configuration files: "disable per directory configuration overrides on upload directories at
  the web server level" and a warning that an attacker may upload `.htaccess` or `web.config`.
- **FTP-Deploy-Action v4.4.0** offers an `exclude` glob list that drops matching files from
  the upload; it excludes `.git*` and `node_modules` by default. It is the wrong tool for this
  check because it drops silently, where the job must refuse.
- **Apache's own guidance** in mod_mime: to map only the last dot-separated part, "do not use
  the `Add*` directives" (use a `FilesMatch` with `SetHandler`, which is what cPanel's fix
  approximates).

## Pitfalls & regrets

- A last-extension-only test (`case "$f" in *.php)`) misses `x.php.txt` under Apache-style
  handlers, and `x.PHP` if written case-sensitively. Both are standard bypasses.
- `-iname '*.pl*'` would refuse `.plantuml`, which is a likely diagram source in this repo;
  `*.perl*` refuses `perlmutter.md`. The recommended list uses exact `*.pl` and `*.pl.*`, and a
  prefix wildcard only where no common static type shares the prefix. Remaining false
  positives (a `howto.phpunit.md`) are loud and are fixed by renaming.
- `-iname '.ht*'` would refuse `.htmlhintrc`; the exact names `.htaccess` and `.htpasswd` do not.
- Leaving out `-type f` is deliberate: a directory named `x.php` or `.htaccess` is refused too.
- A refusal that only drops files (FTP-Deploy-Action `exclude`) hides the problem from the
  author; the job should exit non-zero and print each matching path.
- A scan of names says nothing about content: an `.html` or `.md` file that contains
  `<?php` or an SSI directive is inert unless the account maps its extension to a handler.
- A check on the runner proves only what the repository holds; it does not prove what the host
  does. The host side is unverified for Spaceship (see *Gaps*).

## Recommendation for this repo

Add a refusal step, in the publish workflow before the FTP upload, that runs `find` over
`docs/` and fails the job on any hit:

```sh
set -euo pipefail
bad=$(find docs \( \
    -iname '.htaccess' -o -iname '.htpasswd' -o -iname '.user.ini' -o -iname 'php.ini' \
    -o -iname '*.php*' -o -iname '*.pht*' -o -iname '*.phar*' \
    -o -iname '*.cgi*' -o -iname '*.pl' -o -iname '*.pl.*' -o -iname '*.plx*' \
    -o -iname '*.ppl*' -o -iname '*.perl*' \
    -o -iname '*.shtm*' \) -print)
if [ -n "$bad" ]; then
  echo "::error::docs/ holds files the host would execute or interpret; refusing to publish:" >&2
  printf '%s\n' "$bad" >&2
  exit 1
fi
```

What each pattern is for, so the list can be pruned or extended deliberately:

| Pattern(s) | Why it is refused |
|---|---|
| `.htaccess` | reads as server configuration; can map any extension to a handler (cPanel sets `AllowOverride All`) |
| `.htpasswd` | pairs with `.htaccess`; inert alone |
| `.user.ini`, `php.ini` | PHP configuration; inert by default here, named in cPanel's own security policy |
| `*.php*` | `.php`, `.php5`/`.php7`/`.php8`, `.phps`, and any inner or trailing segment; covers `x.php.jpg` and `x.php.` |
| `*.pht*` | `.phtml` (cPanel default), `.pht`, `.phtm` |
| `*.phar*` | PHP archive |
| `*.cgi*`, `*.plx*`, `*.ppl*`, `*.perl*` | cPanel's default CGI/Perl mapping |
| `*.pl`, `*.pl.*` | the same, written so `.plantuml` and `.pls` pass |
| `*.shtm*` | `.shtml` (cPanel's server-parsed mapping) and `.shtm` |

Reasoning: the check protects a folder that only the maintainer writes, against a stray file
turning into server-side code, and the default mapping on this host is a short closed set.
A refusal list over that set costs nothing when a new static type arrives and still catches
double extensions and case variants; an allow list adds a recurring failure on `main` and
needs the same inner-segment patterns anyway. If the folder ever accepts files from anyone
else, switch to an allow list on the last extension *plus* these patterns.

One adjacent fact about this repository: `.github/actions/spaceship-deploy/action.yml`
fails with "Nothing to deploy" unless `<local-dir>/index.html` exists, and `docs/` has no
`index.html` today. Reusing that action for `docs/` needs either an `index.html` in `docs/` or
a bypass of that one check; the refusal step above is independent of it.

## Load-bearing claims

1. cPanel writes a PHP handler block into `.htaccess` mapping `.php`, one numbered extension
   and `.phtml`. Quote: "`AddHandler application/x-httpd-ea-php81 .php .php8 .phtml`" and
   "`AddHandler application/x-httpd-ea-php70 .php .php7 .phtml`" (each preceded by "# php --
   BEGIN cPanel-generated handler, do not edit"). Links:
   [open-source-uom/myuom `docs/en/deployment-en.md`](https://github.com/open-source-uom/myuom/blob/HEAD/docs/en/deployment-en.md),
   [desagarut/sidega-master `x.htaccess`](https://github.com/desagarut/sidega-master/blob/HEAD/x.htaccess).
   Read 2026-11-08; both are third-party repositories pasting cPanel output.
2. cPanel treats `.php .php5 .php7 .php8 .phtml` as the PHP set and strips the handler from
   other names, case-insensitively. Quote: "# if it does not end in .<PHP EXT> remove the PHP
   handler. # e.g. we do not want logo.php.png to be handled by PHP" and
   "`<FilesMatch "(?i)(?<!\.php|\.php5|\.php7|\.php8|\.phtml)$"> RemoveHandler .php .php5 .php7
   .php8 .phtml`". Link: [`php_add_handler_fix.conf`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/php_add_handler_fix.conf),
   `ea-apache24-config` commit `ee51d1c`, 2026-11-02.
3. cPanel's global Apache configuration maps CGI/Perl and server-parsed extensions. Quote:
   "`AddHandler cgi-script .cgi .pl .plx .ppl .perl`" and "`AddHandler server-parsed .shtml`".
   Link: [`ea4_main.default`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/ea4_main.default),
   commit `ee51d1c`, 2026-11-02.
4. cPanel's template allows `.htaccess` overrides everywhere unless an optimisation tweak is on.
   Quote: "`<Directory "/">` ... `AllowOverride All`" (the `ELSE` branch of the
   `optimize_htaccess` condition). Link: `ea4_main.default` as above, commit `ee51d1c`.
5. Accounts without CGI get CGI and includes switched off; accounts with CGI do not. Quote:
   "`[% IF !vhost.hascgi -%]  Options -ExecCGI -Includes  RemoveHandler cgi-script .cgi .pl .plx
   .ppl .perl`". Link: [`vhost.default`](https://github.com/CpanelInc/ea-apache24-config/blob/ee51d1ca4d4f4a612cc4cbcf62557f9a3a8afb8e/SOURCES/vhost.default),
   commit `ee51d1c`, 2026-11-02.
6. cPanel names these files as a security policy. Quote: "# Required cPanel security policy:
   Disallow remote access to .htaccess, .htpasswd, .user.ini, and php.ini files". Link:
   `ea4_main.default` as above, commit `ee51d1c`.
7. Apache's `AddHandler` compares every extension of a name and is case-insensitive. Quote:
   "The extension argument is case-insensitive and can be specified with or without a leading
   dot. Filenames may have multiple extensions and the extension argument will be compared
   against each of them." Link: [`mod_mime.xml`](https://github.com/apache/httpd/blob/2.4.62/docs/manual/mod/mod_mime.xml),
   Apache httpd 2.4.62.
8. Apache says to avoid `Add*` directives when only the last extension should count. Quote:
   "If you would prefer only the last dot-separated part of the filename to be mapped to a
   particular piece of meta-data, then do not use the `Add*` directives." Link: `mod_mime.xml`
   as above, 2.4.62.
9. LiteSpeed's script handlers are keyed by MIME type. Quote: "Though we list suffixes in this
   field, the script handlers use MIME types, not suffixes, to decide which scripts to handle."
   Link: [LiteSpeed Script Handler](https://www.litespeedtech.com/docs/webserver/config/scripthandler),
   read 2026-11-08 (page carries no version).
10. The OpenLiteSpeed engine derives the suffix from the last dot only and lowercases it.
    Quote (code): "`if (ch == '.') return pCur;`" in `findSuffix`, and
    "`StringTool::strnlower(pSuffix, achSuffix, len);`" in `HttpContext::determineMime`. Links:
    [`httpreq.cpp`](https://github.com/litespeedtech/openlitespeed/blob/031b2c8973b3d377efad54f165decd5ce8b9a4a5/src/http/httpreq.cpp),
    [`httpcontext.cpp`](https://github.com/litespeedtech/openlitespeed/blob/031b2c8973b3d377efad54f165decd5ce8b9a4a5/src/http/httpcontext.cpp),
    OpenLiteSpeed commit `031b2c8`, 2026-11-01. This describes the open-source sibling, not
    LiteSpeed Enterprise.
11. LiteSpeed's PHP SAPI reads `.user.ini` only when switched on. Quote (code):
    "`const char *p = getenv("LSPHP_ENABLE_USER_INI"); if (p && 0 == strcasecmp(p, "on"))
    parse_user_ini = 1;`". Link: [`lsapi_main.c`](https://github.com/php/php-src/blob/php-8.3.0/sapi/litespeed/lsapi_main.c),
    php-src `php-8.3.0`.
12. LiteSpeed under cPanel uses `.htaccess` for PHP settings and discourages `.user.ini`.
    Quote: "LiteSpeed uses .htaccess." and "It is not recommended to use .user.ini with LSWS,
    since it is part of cPanel's MultiPHP manager function, and is intended for Apache
    PHP-FPM." Link: [Per-User php.ini](https://docs.litespeedtech.com/lsws/cp/cpanel/php-user-ini/),
    page dated 2026-08-14.
13. LiteSpeed enables `.htaccess` through an Allow Override setting. Quote: "Allow Override:
    Select every box except None  Access File Name: .htaccess". Link:
    [LiteSpeed Standalone installation](https://docs.litespeedtech.com/lsws/standalone/),
    read 2026-11-08.
14. A PHP handler's ID counts as a handled suffix and extra suffixes can be added. Quote: "The
    ID itself will also be treated as a handled suffix." and "Extra file suffixes to be handled
    by this handler." Link: [LiteSpeed PHP getting started](https://docs.litespeedtech.com/lsws/extapp/php/getting_started/),
    read 2026-11-08.
15. OWASP recommends an allow list and calls a block list weak on its own, and lists the
    double-extension, case and configuration-file bypasses. Quote: "Ensure the usage of
    business-critical extensions only, without allowing any type of non-required extensions."
    and "Please be aware that blocking specific extensions is a weak protection method on its
    own." and "Case manipulation, e.g. `.pHp`, `.phP`, to bypass case-sensitive blocklist
    filters" and "Be aware that an attacker may attempt to upload a web server configuration
    file". Link: [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html),
    read 2026-11-08 (the page's own version marker was not captured).
16. FTP-Deploy-Action's default `exclude` does not drop `.htaccess` or any extension above.
    Quote: "`exclude` has the following default value ... `**/.git*` `**/.git*/**`
    `**/node_modules/**`". Link: [FTP-Deploy-Action README](https://github.com/SamKirkland/FTP-Deploy-Action/blob/v4.4.0/README.md),
    `v4.4.0`.
17. PHP's per-directory INI files are processed by CGI/FastCGI SAPIs. Quote: "PHP includes
    support for configuration INI files on a per-directory basis. These files are processed
    only by the CGI/FastCGI SAPI." Link: [PHP manual, .user.ini files](https://www.php.net/manual/en/configuration.file.per-user.php),
    read 2026-11-08 (documents PHP 8.x; the same page lists 8.6.0 RC5 in its banner). The
    LiteSpeed SAPI code in claim 11 shows the manual's sentence is not exhaustive.

## Gaps

- **No Spaceship page was read.** Every `spaceship.com` URL returned HTTP 403 to my tools,
  and I did not work around it. Spaceship's use of LiteSpeed, cPanel, CloudLinux and
  `.htaccess` is taken from a search-result summary of its pages and from the live `server:
  LiteSpeed` header; the handler set is inferred from cPanel EasyApache 4 defaults. Whether
  Spaceship overrides any of them (CGI off, a custom handler list, `AllowOverride` limited) is
  unknown. The recommended list is safe either way, because it only refuses more.
- **LiteSpeed Enterprise's multi-extension behaviour is unconfirmed.** The only code I read is
  OpenLiteSpeed's (last suffix only); Enterprise is closed source. The recommendation
  assumes the worst case (any segment counts).
- **Whether `.shtml` is parsed, and whether `.cgi` runs, on this account is unconfirmed.**
  No LiteSpeed document I could read states SSI behaviour, and the account's CGI feature is not
  visible from outside. Both are refused regardless.
- **Account-level handler mappings** (cPanel's "Apache Handlers" screen, which can map an
  extension such as `.html` to PHP or `server-parsed`) are a property of the Spaceship account,
  not the repository, and no name-based check detects them. I did not verify the screen's
  behaviour from cPanel's own documentation. A one-time manual check that a static `.html`
  and `.md` under `/OrganizationPage/docs/` are served unmodified would close it.
- **Whether `php_add_handler_fix.conf` is applied under LiteSpeed** is undocumented in what I
  read; it is not relied on.
- **`.HTACCESS` (upper case) on LiteSpeed** was not established; `-iname` makes it moot.
- **Cited cPanel generated blocks (claim 1) come from two third-party repositories**, not from
  cPanel documentation; the PHP set in claim 2 comes from cPanel's own repository and agrees
  with them.
- The recommended `-iname` expression was run against a scratch folder of sample names on
  Windows (Git Bash `find`); case-variant names collapse on that filesystem, so the
  upper-case cases were confirmed through names created in mixed case (`NAME.Php` matched)
  rather than through separate upper- and lower-case files. It was not run on an Ubuntu runner.
