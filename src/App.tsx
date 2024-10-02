import { Header } from "antd/es/layout/layout";
import "./App.css";
import { TodoTable } from "./components/TodoTable";
import { Layout, Typography } from "antd";
const { Title } = Typography;

function App() {
    return (
        <>
            <Layout style={{ paddingBottom: "2em" }}>
                <Header>
                    <Title
                        level={2}
                        style={{ color: "white" }}
                    >
                        TODO LIST
                    </Title>
                </Header>
            </Layout>
            <TodoTable></TodoTable>
        </>
    );
}

export default App;
