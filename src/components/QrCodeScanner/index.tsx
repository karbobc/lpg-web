import { Result } from "antd";
// file = QrCodeScanner/index.tsx
import {
  Html5QrcodeCameraScanConfig,
  Html5QrcodeScanType,
  Html5QrcodeScannerState,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import { Html5Qrcode, Html5QrcodeConfigs } from "html5-qrcode/esm/html5-qrcode";
import { ForwardedRef, forwardRef, useCallback, useEffect, useRef, useState } from "react";

const QR_CODE_REGION_ID = "QR-CODE-SCANNER-REGION";

export enum QrCodeScannerState {
  INITIAL = "Initial",
  STARTING = "Starting",
  STARTED = "Started",
  STARTING_FAILED = "StartingFailed",
  STOPPING_FAILED = "StoppingFailed",
}

export interface QrCodeScannerForwardedRef {
  pause: () => void;
  resume: () => void;
}

export interface QrCodeScannerProps {
  onSuccess: QrcodeSuccessCallback;
  config: QrCodeScannerConfig;
  onError?: QrcodeErrorCallback;
}

export interface QrCodeScannerConfig extends Html5QrcodeCameraScanConfig, Html5QrcodeConfigs {
  verbose: boolean;
  rememberLastUsedCamera?: boolean | undefined;
  supportedScanTypes?: Array<Html5QrcodeScanType> | [];
  showTorchButtonIfSupported?: boolean | undefined;
  showZoomSliderIfSupported?: boolean | undefined;
  defaultZoomValueIfSupported?: number | undefined;
}

const QrCodeScanner = forwardRef((props: QrCodeScannerProps, ref: ForwardedRef<QrCodeScannerForwardedRef>) => {
  const { config, onSuccess, onError } = props;
  const scannerRef = useRef<null | Html5Qrcode>(null);
  const stateRef = useRef<QrCodeScannerState>(QrCodeScannerState.INITIAL);
  const [startingFailed, setStartingFailed] = useState(false);

  const pause = useCallback(() => {
    if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
      scannerRef.current?.pause(true);
    }
  }, []);

  const resume = useCallback(() => {
    console.log(Html5QrcodeScannerState);
    if (scannerRef.current?.getState() === Html5QrcodeScannerState.PAUSED) {
      scannerRef.current?.resume();
    }
  }, []);

  const innerRef = useRef<QrCodeScannerForwardedRef>({
    pause,
    resume,
  });

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(innerRef.current);
      } else {
        ref.current = innerRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(QR_CODE_REGION_ID, config);
    }
    if (scannerRef.current && stateRef.current === QrCodeScannerState.INITIAL) {
      stateRef.current = QrCodeScannerState.STARTING;
      // environment: 后置摄像头, user: 前置摄像头
      scannerRef.current
        .start({ facingMode: { exact: "environment" } }, config, onSuccess, onError)
        .then(() => {
          stateRef.current = QrCodeScannerState.STARTED;
        })
        .catch((e) => {
          console.log(e);
          stateRef.current = QrCodeScannerState.STARTING_FAILED;
          setStartingFailed(true);
        });
    }

    // cleanup function when component will unmount
    return () => {
      if (scannerRef.current && stateRef.current === QrCodeScannerState.STARTED) {
        scannerRef.current
          ?.stop()
          .then(() => {
            stateRef.current = QrCodeScannerState.INITIAL;
          })
          .catch(() => {
            stateRef.current = QrCodeScannerState.STOPPING_FAILED;
          });
      }
    };
  }, [config, onSuccess, onError]);

  return (
    <div>
      <div id={QR_CODE_REGION_ID} />
      {startingFailed && <Result status="error" title="相机权限未开启" />}
    </div>
  );
});

export default QrCodeScanner;
