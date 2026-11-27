from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]; out=root/'dist'; out.mkdir(exist_ok=True)
with ZipFile(out/'webd-extension.zip','w',compression=ZIP_DEFLATED) as archive:
    for path in sorted([*root.joinpath('extension').glob('*'),root/'LICENSE']):
        if path.is_file():
            name=path.name; info=ZipInfo(name,(1980,1,1,0,0,0)); info.compress_type=ZIP_DEFLATED; info.external_attr=0o644<<16; archive.writestr(info,path.read_bytes())
