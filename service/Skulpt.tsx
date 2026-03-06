// SkulptRunner.ts
import Sk from "skulpt";

let stopFlag = false;

export function stopPython() {
  stopFlag = true;
}

export function runPython(
  code: string,
  onLog?: (msg: string) => void,
  onHighlight?: (id: string) => void
): Promise<string> {
  stopFlag = false;
  let outputBuffer = "";

  function outf(text: string) {
    if (stopFlag) {
      throw new Sk.builtin.KeyboardInterrupt("Stopped during print");
    }
    outputBuffer += text;
    if (onLog) onLog(text);
  }

  function builtinRead(x: string) {
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles["files"][x] === undefined
    ) {
      throw "File not found: '" + x + "'";
    }
    return Sk.builtinFiles["files"][x];
  }

  Sk.configure({
    output: outf,
    read: builtinRead,
    execLimit: Number.MAX_SAFE_INTEGER,
    yieldLimit: 1,
    interruptHandler: () => {
      if (stopFlag) {
        throw new Sk.builtin.KeyboardInterrupt("Stopped by user");
      }
    },
  });

  // Override sleep trong module time
  if (!Sk.sysmodules["time"]) {
    Sk.sysmodules["time"] = new Sk.builtin.module({});
  }
  Sk.sysmodules["time"].$d["sleep"] = new Sk.builtin.func(function (secs: any) {
    return new Sk.misceval.promiseToSuspension(
      new Promise((resolve, reject) => {
        const ms = Sk.ffi.remapToJs(secs) * 1000;
        const timer = setTimeout(() => {
          if (stopFlag) {
            reject(new Sk.builtin.KeyboardInterrupt("Stopped during sleep"));
          } else {
            resolve(Sk.builtin.none.none$);
          }
        }, ms);

        if (stopFlag) {
          clearTimeout(timer);
          reject(new Sk.builtin.KeyboardInterrupt("Stopped before sleep"));
        }
      })
    );
  });

  (Sk as any).builtins.highlightBlock = new (Sk as any).builtin.func((pyId: any) => {
    const id = pyId?.v ?? String(pyId);
    if (onHighlight) {
      onHighlight(id);
    }
    return (Sk as any).builtin.none.none$;
  });


  return new Promise((resolve, reject) => {
    Sk.misceval
      .asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true))
      .then(
        () => {
          if (!stopFlag) resolve(outputBuffer);
        },
        (err: any) => {
          if (stopFlag) {
            reject("Execution stopped");
          } else {
            reject(err.toString());
          }
        }
      );
  });
}
