import { Layout } from "antd";
import './Content.css';
const { Content } = Layout;

const ContentWrapper = ({ children }) => {
  return (
    <Content className="content-container">
     
        {children}
    </Content>
  );
};

export default ContentWrapper;