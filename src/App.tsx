import "./App.css";
import { TodoTable } from "./components/TodoTable";
import { Typography } from "antd";
const { Title } = Typography;

function App() {
    return (
        <>
            <Title>TECHNICAL TEST </Title>
            <TodoTable></TodoTable>
        </>
    );
}

export default App;
