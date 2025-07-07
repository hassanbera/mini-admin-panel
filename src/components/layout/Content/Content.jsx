import { Layout } from "antd";
import './Content.css';
const { Content } = Layout;

const ContentWrapper = ({ children }) => {
  return (
    <Content className="content-container">
      <div className="content-inner">
        {children}
      </div>
    </Content>
  );
};

export default ContentWrapper;