import { search } from "@/services/api/cylinder";
import { enroll } from "@/services/api/misc";
import { CylinderSearchParam } from "@/services/model/request/cylinder";
import { EnrollParam } from "@/services/model/request/misc";
import { CylinderSearchVO } from "@/services/model/response/cylinder";
import { AutoComplete, Button, Card, Form, Input, Modal, Popconfirm, Result, Spin, Tooltip } from "antd";
import { useState } from "react";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { ImMobile } from "react-icons/im";
import { PiBarcodeBold } from "react-icons/pi";
import "./index.scss";

const App = () => {
  const [enrollForm] = Form.useForm();
  const [barcode, setBarcode] = useState("");
  const [barcodeOptions, setBarcodeOptions] = useState<{ value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [barcodeSearchLoading, setBarcodeSearchLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
    } finally {
      setBarcodeSearchLoading(false);
    }
  };

  const onEnrollFormFinish = async () => {
    setLoading(true);
    try {
      const values = enrollForm.getFieldsValue();
      const response = await enroll(values as EnrollParam);
      if (response.success) {
        showModal();
      }
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const hideModal = () => {
    setModalOpen(false);
    enrollForm.resetFields();
  };

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
            <Form.Item
              name="barcode"
              className="enroll-form-item"
              rules={[
                {
                  required: true,
                  message: "气瓶条码不能为空",
                },
              ]}
            >
              <AutoComplete
                options={barcodeOptions}
                value={barcode}
                onChange={(barcode) => setBarcode(barcode)}
                onSearch={onBarcodeSearch}
              >
                <Input.Search
                  allowClear
                  type="text"
                  loading={barcodeSearchLoading}
                  style={{ fontSize: "inherit" }}
                  prefix={<PiBarcodeBold />}
                  placeholder="请输入气瓶条码"
                />
              </AutoComplete>
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
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                onClick={() => console.log(enrollForm.getFieldsValue())}
                block
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
      <Modal
        closable={false}
        centered={true}
        open={modalOpen}
        footer={[
          <div key="footer" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button key="ok" size="large" type="primary" onClick={hideModal}>
              确认
            </Button>
          </div>,
        ]}
      >
        {modalOpen ? <Result status="success" title="登记成功" /> : <></>}
      </Modal>
    </div>
  );
};

export default App;
