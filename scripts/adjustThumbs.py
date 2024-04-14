import os
from pathlib import Path
import re
import shutil

regexPattern = r"\"thumb\": \"(worlds/(.*)/assets/scenes/(.*))\","

dataFolder = Path(os.getcwd()).parent.parent.absolute()

origin_format = "{}/worlds/{}/assets/scenes/{}"
destiny_format = "assets/map/{}"
module_format = "modules/slate-chalcedony/assets/map/{}"

file_path = "src/packs/slate-chalcedony/adventures_Slate___Chalcedony_uyUTdWGCqUhIJ95p.json"

with open(file_path, "r") as file:
    filedata = file.read()

for match in re.finditer(regexPattern, filedata):
    full_origin = origin_format.format(dataFolder, match[2], match[3])
    full_destiny = destiny_format.format(match[3])
    shutil.copy2(full_origin, full_destiny)
    thumb_new_path = module_format.format(match[3])
    filedata = filedata.replace(match[1], thumb_new_path)

with open(file_path, "w") as file:
    file.write(filedata)
