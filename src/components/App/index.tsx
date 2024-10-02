import QrCodeScanner from "@/components/QrCodeScanner";
import { search } from "@/services/api/cylinder";
import { enroll } from "@/services/api/misc";
import { CylinderSearchParam } from "@/services/model/request/cylinder";
import { EnrollParam } from "@/services/model/request/misc";
import { ApiResult } from "@/services/model/response/base";
import { CylinderSearchVO } from "@/services/model/response/cylinder";
import {
  App as AntdApp,
  AutoComplete,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Result,
  Spin,
  Tooltip,
} from "antd";
import { Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState } from "react";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { FaPowerOff } from "react-icons/fa6";
import { ImMobile } from "react-icons/im";
import { PiBarcodeBold } from "react-icons/pi";
import { TbSquareLetterR } from "react-icons/tb";
import "./index.scss";

const App = () => {
  const { message } = AntdApp.useApp();
  const [enrollForm] = Form.useForm();
  const [barcodeOptions, setBarcodeOptions] = useState<{ value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [barcodeSearchLoading, setBarcodeSearchLoading] = useState(false);
  const [enrollResult, setEnrollResult] = useState<ApiResult>();
  const [enrollResultModalOpen, setEnrollResultModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);

  const onBarcodeSearch = async (barcode: string) => {
    if (!barcode) {
      setBarcodeOptions([]);
      return;
    }
    setBarcodeSearchLoading(true);
    try {
      const param: CylinderSearchParam = {
        barcode: barcode,
      };
      const voList: Array<CylinderSearchVO> = await search(param);
      setBarcodeOptions(voList.map((item) => ({ value: item.barcode })) || []);
    } catch (e) {
      message.error("查询失败！！！");
    } finally {
      setBarcodeSearchLoading(false);
    }
  };

  const onEnrollFormFinish = async () => {
    setLoading(true);
    try {
      const values = enrollForm.getFieldsValue();
      const response = await enroll(values as EnrollParam);
      setEnrollResult(response);
    } finally {
      setEnrollResultModalOpen(true);
      setLoading(false);
    }
  };

  const hideEnrollResultModal = () => {
    setEnrollResultModalOpen(false);
    if (enrollResult?.success) {
      enrollForm.resetFields();
    }
  };

  const hideScannerModal = () => {
    setScannerModalOpen(false);
  };

  const onQrCodeScanButtonClick = () => {
    enrollForm.resetFields(["barcode"]);
    setScannerModalOpen(true);
  };

  const onQrCodeScannedSuccess = (content: string) => {
    console.log(`扫码内容识别成功: ${content}`);
    let barcode = content;
    if (content.startsWith("http")) {
      barcode = content.split("|")[1];
    }
    if (barcode === enrollForm.getFieldValue("barcode")) {
      return;
    }
    message.success("条码识别成功");
    enrollForm.setFieldValue("barcode", barcode);
    setScannerModalOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    enrollForm.setFieldsValue({
      name: params.get("name"),
      mobile: params.get("mobile"),
      address: params.get("address"),
      barcode: params.get("barcode"),
    });
  }, [enrollForm]);

  return (
    <div className="enroll-container">
      <Spin spinning={loading}>
        <Card
          title="一瓶一码实名登记"
          headStyle={{ fontSize: "2.0rem", textAlign: "center" }}
          style={{
            width: "95%",
            margin: "auto",
          }}
        >
          <Form
            size="large"
            className="enroll-form"
            autoComplete="off"
            form={enrollForm}
            scrollToFirstError
            onFinish={onEnrollFormFinish}
          >
            <Form.Item
              name="name"
              className="enroll-form-item"
              rules={[
                {
                  required: true,
                  message: "姓名不能为空",
                },
              ]}
            >
              <Input allowClear prefix={<AiOutlineUser />} placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item
              name="mobile"
              className="enroll-form-item"
              rules={[
                {
                  required: true,
                  message: "手机号不能为空",
                },
              ]}
            >
              <Input type="tel" allowClear prefix={<ImMobile />} placeholder="请输入手机号" />
            </Form.Item>
            <Tooltip
              title="XX县XX镇/乡XX村/社区XX屯/街/区/路/巷"
              trigger={["focus"]}
              overlayInnerStyle={{ fontSize: "larger" }}
            >
              <Form.Item
                name="address"
                className="enroll-form-item"
                rules={[
                  {
                    required: true,
                    message: "现住地址不能为空",
                  },
                ]}
              >
                <Input allowClear prefix={<AiFillHome />} placeholder="现住地址" />
              </Form.Item>
            </Tooltip>
            <Form.Item className="enroll-form-item">
              <Flex gap="small">
                <Form.Item
                  noStyle
                  name="barcode"
                  style={{ width: "calc(100% - 50px)" }}
                  rules={[
                    {
                      required: true,
                      message: "气瓶条码不能为空",
                    },
                  ]}
                >
                  <AutoComplete options={barcodeOptions} onSearch={onBarcodeSearch}>
                    <Input.Search
                      allowClear
                      type="text"
                      loading={barcodeSearchLoading}
                      style={{ fontSize: "inherit" }}
                      prefix={<TbSquareLetterR />}
                      placeholder="请输入气瓶条码"
                    />
                  </AutoComplete>
                </Form.Item>
                <Button size="large" onClick={onQrCodeScanButtonClick} icon={<PiBarcodeBold />} />
              </Flex>
            </Form.Item>
            <Form.Item className="enroll-form-item">
              <Popconfirm
                title="您确认要清空全部内容吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => enrollForm.resetFields()}
              >
                <Button type="default" block>
                  清空
                </Button>
              </Popconfirm>
            </Form.Item>
            <Form.Item className="enroll-form-item">
              <Button loading={loading} type="primary" htmlType="submit" block>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
      <Modal
        closable={false}
        centered={true}
        open={enrollResultModalOpen}
        footer={[
          <div
            key="enroll-modal-footer"
            style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Button key="enroll-modal-ok" size="large" type="primary" onClick={hideEnrollResultModal}>
              确认
            </Button>
          </div>,
        ]}
      >
        {enrollResult ? (
          <Result
            status={enrollResult?.success ? "success" : "error"}
            title={enrollResult?.success ? "登记成功" : enrollResult?.message}
          />
        ) : (
          <Result status="error" title="发生未知异常" />
        )}
      </Modal>
      <Modal
        destroyOnClose={true}
        closable={false}
        centered={true}
        open={scannerModalOpen}
        footer={[
          <Flex key="scanner-modal-footer" justify="center">
            <Button danger key="scanner-modal-cancel" size="large" icon={<FaPowerOff />} onClick={hideScannerModal} />
          </Flex>,
        ]}
      >
        <QrCodeScanner
          config={{
            fps: 15,
            qrbox: 300,
            verbose: false,
            formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.QR_CODE],
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            showTorchButtonIfSupported: true,
          }}
          onSuccess={onQrCodeScannedSuccess}
        />
      </Modal>
    </div>
  );
};

export default App;
