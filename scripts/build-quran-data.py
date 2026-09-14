#!/usr/bin/env python3
"""Build the offline Quran dataset for the Al Quran PWA.

Downloads four editions from alquran.cloud and emits trimmed JSON keyed by
surah number. Two corrections are applied to the upstream data:

  1. A stray U+FEFF (BOM) inside surah 1, verse 1.
  2. The `quran-uthmani` edition prepends the Bismillah to verse 1 of every
     surah except 1 and 9 (112 surahs). The translations do not, so rendering
     them side by side misaligns the first verse. We strip the prefix and
     expose the Bismillah separately for the app to render as a surah header.

Re-run with:  python3 build-quran-data.py <output-dir>
"""
import json, sys, os, re, gzip, unicodedata, urllib.request

EDITIONS = {'arabic': 'quran-uthmani', 'en': 'en.sahih',
            'bn': 'bn.bengali', 'translit': 'en.transliteration'}
BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
NO_BISMILLAH_SURAHS = {1, 9}   # 1: it *is* verse 1. 9: At-Tawba has none.
EXPECTED_SURAHS, EXPECTED_AYAHS = 114, 6236


def norm(t):
    t = unicodedata.normalize('NFKD', t)
    t = ''.join(c for c in t if not unicodedata.combining(c))
    t = t.replace('﻿', '')
    t = re.sub('[ٱآأإ]', 'ا', t)
    return re.sub(r'\s+', '', t)


def fetch(edition, cache_dir):
    path = os.path.join(cache_dir, f"ed_{edition}.json")
    if not os.path.exists(path):
        url = f"https://api.alquran.cloud/v1/quran/{edition}"
        with urllib.request.urlopen(url, timeout=180) as r, open(path, 'wb') as f:
            f.write(r.read())
    return json.load(open(path, encoding='utf-8'))['data']


def main(out_dir, cache_dir='/tmp'):
    os.makedirs(out_dir, exist_ok=True)
    bism_norm = norm(BISMILLAH)
    report, stripped_total = [], 0

    for name, edition in EDITIONS.items():
        d = fetch(edition, cache_dir)
        data, stripped = {}, 0
        for s in d['surahs']:
            n = s['number']
            verses = [a['text'].replace('﻿', '').strip() for a in s['ayahs']]
            if name == 'arabic' and n not in NO_BISMILLAH_SURAHS:
                v1 = verses[0]
                if norm(v1).startswith(bism_norm):
                    # cut after the Bismillah, preserving the original glyphs
                    acc = ''
                    for i, ch in enumerate(v1):
                        acc += ch
                        if norm(acc) == bism_norm:
                            # consume any trailing combining marks belonging to
                            # the Bismillah's final letter before cutting
                            j = i + 1
                            while j < len(v1) and unicodedata.combining(v1[j]):
                                j += 1
                            verses[0] = v1[j:].strip()
                            stripped += 1
                            break
            data[str(n)] = verses
        stripped_total += stripped

        assert len(data) == EXPECTED_SURAHS, f"{name}: {len(data)} surahs"
        assert sum(len(v) for v in data.values()) == EXPECTED_AYAHS, f"{name}: ayah count"
        assert not [1 for v in data.values() for t in v if not t], f"{name}: empty verse"

        blob = json.dumps(data, ensure_ascii=False, separators=(',', ':')).encode()
        open(os.path.join(out_dir, f"quran-{name}.json"), 'wb').write(blob)
        report.append((name, len(blob), len(gzip.compress(blob, 9)), stripped))

        if name == 'arabic':
            idx = [{'n': s['number'], 'name': s['name'], 'en': s['englishName'],
                    'tr': s['englishNameTranslation'], 'ayahs': len(s['ayahs']),
                    'type': s['revelationType']} for s in d['surahs']]
            json.dump({'bismillah': BISMILLAH, 'surahs': idx},
                      open(os.path.join(out_dir, 'surah-index.json'), 'w', encoding='utf-8'),
                      ensure_ascii=False, separators=(',', ':'))

    print(f"{'edition':<12}{'bytes':>10}{'gzip':>10}{'bismillah stripped':>21}")
    print('-' * 53)
    for n, b, g, s in report:
        print(f"{n:<12}{b:>10}{g:>10}{s:>21}")
    print('-' * 53)
    print(f"{'TOTAL':<12}{sum(r[1] for r in report):>10}{sum(r[2] for r in report):>10}"
          f"{stripped_total:>21}")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'quran-data'))
