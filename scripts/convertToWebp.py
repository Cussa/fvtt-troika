import os
import re
from subprocess import call
import sys

folder = sys.argv[1]

if not folder:
    folder = "./assets"

result = [
    os.path.join(dp, f)
    for dp, dn, filenames in os.walk(folder)
    for f in filenames
    if os.path.splitext(f)[1] in [".png", ".jpg", ".tif"] #and f.startswith("_0e7")
]

for f in result:
    new_file_name = f"{os.path.splitext(f)[0]}.webp".lower()
    new_file_name = re.sub("chapbook_towers_", "", new_file_name)
    new_file_name = re.sub("(?i)_printready", "", new_file_name)
    new_file_name = re.sub("(?i)_print", "", new_file_name)
    new_file_name = re.sub("\s", "-", new_file_name)
    new_file_name = re.sub("_", "-", new_file_name)
    ret = call(["cwebp", f, "-o", new_file_name])
    if ret != 0:
        print("ERROR")
        exit(1)
    os.remove(f)

exit(0)

file_path = "src/packs/kogarashi/adventures_Kogarashi_E5MbFwGnYbaL2yYL.json"

with open(file_path, "r") as file:
    filedata = file.read()

for f in result:
    new_file_name = f"{os.path.splitext(f)[0]}.webp"
    ret = call(["cwebp", f, "-o", new_file_name])
    if ret != 0:
        print("ERROR")
        exit(1)
    os.remove(f)
    filedata = filedata.replace(f[2:], new_file_name[2:])

with open(file_path, "w") as file:
    file.write(filedata)
