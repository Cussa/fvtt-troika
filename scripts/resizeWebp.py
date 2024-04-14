import os
from subprocess import call
import sys

folder = sys.argv[1]
width = sys.argv[2]

if not width:
    print("ERROR: widht not set")
    exit(1)


if os.path.isfile(folder):
    result = [folder]
else:
    result = [
        os.path.join(dp, f)
        for dp, dn, filenames in os.walk(folder)
        for f in filenames
        if os.path.splitext(f)[1] in [".webp"]  # and f.startswith("_0e7")
    ]

for f in result:
    ret = call(["cwebp", f, "-resize", width, "0", "-o", f])
    if ret != 0:
        print("ERROR")
        exit(1)