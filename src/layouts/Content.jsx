import { Layout } from "antd";

const { Content } = Layout;

const ContentWrapper = ({ children }) => {
  return (
    <Content style={{ margin: "16px" }}>
      <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
        {children}
      </div>
    </Content>
  );
};

export default ContentWrapper;
