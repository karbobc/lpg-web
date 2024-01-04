import { Button, Card, Form, Input } from "antd";
import { useState } from "react";
import { AiFillHome, AiOutlineUser } from "react-icons/ai";
import { ImMobile } from "react-icons/im";
import { PiBarcodeBold } from "react-icons/pi";
import "./index.scss";

const App = () => {
  const [loading, setLoading] = useState(false);

  const onEnrollFormFinish = () => {
    setLoading(true);
  };

  return (
    <Card title="一瓶一码信息登记" headStyle={{ fontSize: "1.5rem" }} style={{ width: "95%" }}>
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
              message: "居住地址不能为空",
            },
          ]}
        >
          <Input allowClear prefix={<AiFillHome />} placeholder="请输入居住地址" />
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
          <Input allowClear prefix={<PiBarcodeBold />} placeholder="请输入气瓶条码" />
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
