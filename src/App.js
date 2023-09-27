import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { UserData } from "./Data";
import Modal from "react-modal";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
function App() {
  const [data, setData] = useState(UserData);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPoint, setNewPoint] = useState("");
  const [filterTime, setFilterTime] = useState(10 * 60 * 1000); // Default filter time is 10 minutes

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addNewPoint = useCallback(() => {
    if (newPoint !== "") {
      const newData = [
        ...data,

        {
          id: data.length + 1,
          userGain: parseInt(newPoint),
          year: new Date().getFullYear(),
        },
      ];
      newData.sort((a, b) => a.timestamp - b.timestamp);
      setData(newData);
      closeModal();
      setNewPoint("");
    }
  }, [newPoint, data]);

  const userData = {
    labels: data.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: data.map((data) => data.userGain),
        backgroundColor: ["rgba(75,192,192,1)"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [
        ...data,
        {
          id: data.length + 1,
          userGain: Math.floor(Math.random() * 90_000 + 1),
          year: new Date().getFullYear(),
        },
      ];

      setData(newData);
    }, filterTime);
    return () => clearInterval(interval);
  }, [data, filterTime]);

  return (
    <>
      <div className="App">
        <button onClick={openModal}>Add New Point</button>
        <select onChange={(e) => setFilterTime(parseInt(e.target.value))}>
          <option value={10 * 60 * 1000}>Last 10 Minutes</option>
          <option value={60 * 60 * 1000}>Last 1 Hour</option>
          <option value={5000}>Last 5 Sec</option>
          <option value={1000}>Last 1 Sec</option>
        </select>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
          <input
            type="number"
            placeholder="Enter a value"
            value={newPoint}
            onChange={(e) => setNewPoint(e.target.value)}
          />
          <button onClick={addNewPoint}>Add</button>
        </Modal>
      </div>
      <div className="App">
        <div style={{ width: 700 }}>
          <LineChart chartData={userData} />
        </div>
      </div>
    </>
  );
}

export default App;
