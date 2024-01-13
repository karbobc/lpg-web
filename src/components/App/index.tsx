import { search } from "@/services/api/cylinder";
import { CylinderSearchParam } from "@/services/model/request";
import { CylinderSearchVO } from "@/services/model/response/cylinder";
import { AutoComplete, Button, Card, Form, Input } from "antd";
import { useState } from "react";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { ImMobile } from "react-icons/im";
import { PiBarcodeBold } from "react-icons/pi";
import "./index.scss";

const App = () => {
  const [barcode, setBarcode] = useState("");
  const [barcodeOptions, setBarcodeOptions] = useState<{ value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const onBarcodeSearch = async (barcode: string) => {
    if (!barcode) {
      setBarcodeOptions([]);
      return;
    }
    const param: CylinderSearchParam = {
      barcode: barcode,
    };
    const voList: Array<CylinderSearchVO> = await search(param);
    setBarcodeOptions(voList.map((item) => ({ value: item.barcode })) || []);
  };

  const onEnrollFormFinish = () => {
    setLoading(true);
  };

  return (
    <Card title="一瓶一码信息登记" headStyle={{ fontSize: "1.5rem", textAlign: "center" }} style={{ width: "95%" }}>
      <Form
        name="form"
        size="large"
        className="enroll-form"
        scrollToFirstError={true}
        autoComplete="off"
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
          <Input type="number" allowClear prefix={<ImMobile />} placeholder="请输入手机号" />
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
            <Input allowClear style={{ fontSize: "inherit" }} prefix={<PiBarcodeBold />} placeholder="请输入气瓶条码" />
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
  );
};

export default App;
