import { search } from "@/services/api/cylinder";
import { enroll } from "@/services/api/misc";
import { CylinderSearchParam } from "@/services/model/request/cylinder";
import { EnrollParam } from "@/services/model/request/misc";
import { CylinderSearchVO } from "@/services/model/response/cylinder";
import { AutoComplete, Button, Card, Form, Input, Spin, message } from "antd";
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
        message.success("登记成功", 5);
        enrollForm.resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enroll-container">
      <Spin spinning={loading}>
        <Card
          title="一瓶一码信息登记"
          headStyle={{ fontSize: "1.5rem", textAlign: "center" }}
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
              <Input allowClear prefix={<AiFillHome />} placeholder="请输入现住地址" />
            </Form.Item>
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
              <Button type="default" htmlType="reset" block>
                清空
              </Button>
            </Form.Item>
            <Form.Item className="enroll-form-item">
              <Button loading={loading} type="primary" htmlType="submit" block>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default App;
