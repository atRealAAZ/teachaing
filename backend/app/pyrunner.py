"""Executes participant scripts for the Python Lab.

Scripts run in a subprocess of the backend's own interpreter (which has
numpy/pandas/matplotlib installed), in a temp directory holding the chosen
dataset as data.csv. This is a classroom tool: participants are trusted,
but a timeout still guards against infinite loops.
"""

import base64
import os
import subprocess
import sys
import tempfile

RUN_TIMEOUT = int(os.getenv("PY_RUN_TIMEOUT", "15"))
MAX_STDOUT = 20_000
MAX_STDERR = 4_000
CHART_FILE = "_lab_chart.png"

_HEADER = "import matplotlib\nmatplotlib.use('Agg')\n"
_FOOTER = f"""

import matplotlib.pyplot as _plt
if _plt.get_fignums():
    _plt.savefig({CHART_FILE!r}, dpi=110, bbox_inches='tight')
"""


def run_python(code: str, csv: str) -> dict:
    with tempfile.TemporaryDirectory() as tmpdir:
        with open(os.path.join(tmpdir, "data.csv"), "w") as f:
            f.write(csv)
        script_path = os.path.join(tmpdir, "script.py")
        with open(script_path, "w") as f:
            f.write(_HEADER + code + _FOOTER)

        try:
            proc = subprocess.run(
                [sys.executable, "-I", script_path],
                cwd=tmpdir,
                capture_output=True,
                text=True,
                timeout=RUN_TIMEOUT,
            )
        except subprocess.TimeoutExpired:
            return {
                "stdout": "",
                "stderr": "",
                "exit_code": None,
                "image_base64": None,
                "timed_out": True,
            }

        stdout = proc.stdout or ""
        if len(stdout) > MAX_STDOUT:
            stdout = stdout[:MAX_STDOUT] + "\n… (output truncated)"
        stderr = proc.stderr or ""
        if len(stderr) > MAX_STDERR:
            # Keep the tail: the last lines of a traceback are the lesson.
            stderr = "… (truncated)\n" + stderr[-MAX_STDERR:]

        image_base64 = None
        chart_path = os.path.join(tmpdir, CHART_FILE)
        if os.path.exists(chart_path):
            with open(chart_path, "rb") as f:
                image_base64 = base64.b64encode(f.read()).decode("ascii")

        return {
            "stdout": stdout,
            "stderr": stderr,
            "exit_code": proc.returncode,
            "image_base64": image_base64,
            "timed_out": False,
        }
