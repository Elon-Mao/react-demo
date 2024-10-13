import React, { useState } from "react";
import useFormData from "./useFormData";
import "./styles.css";

const App: React.FC = () => {
  const [initData, setInitData] = useState({
    userName: "Elon Mao",
    age: 18,
    records: [
      {
        timestamp: Date.now(),
        content:
          "Add a record then delete the adding one",
      },
    ],
  });
  const [formData, updateFormData] = useFormData(initData);

  const isChanged = formData !== initData;

  const handleSave = () => setInitData(formData);

  return (
    <>
      <h2>
        The hook aims to efficiently determine whether the form data is changed,
        regardless how many times of modifications
      </h2>
      <div className="container">
        <button disabled={!isChanged} onClick={handleSave}>
          {isChanged ? "Save Available" : "Save Disabled"}
        </button>
        <span>User Name</span>
        <input
          value={formData.userName}
          onChange={(e) => {
            updateFormData((draft) => {
              draft.userName = e.target.value;
            });
          }}
        />
        <span>Age</span>
        <input
          value={formData.age}
          type="number"
          onChange={(e) => {
            updateFormData((draft) => {
              draft.age = Number(e.target.value);
            });
          }}
        />
        <button
          className="add-record-btn"
          onClick={() => {
            updateFormData((draft) => {
              draft.records.unshift({
                timestamp: Date.now(),
                content: "",
              });
            });
          }}
        >
          Add Record
        </button>
        {formData.records.map((record) => {
          return (
            <div key={record.timestamp} className="record">
              <span>{`Timestamp: ${record.timestamp}`}</span>
              <span>Content: </span>
              <input
                value={record.content}
                onChange={(e) => {
                  updateFormData((draft) => {
                    draft.records.find(
                      (r) => record.timestamp === r.timestamp
                    )!.content = e.target.value;
                  });
                }}
              />
              <button
                onClick={() => {
                  updateFormData((draft) => {
                    const index = draft.records.findIndex(
                      (r) => record.timestamp === r.timestamp
                    );
                    draft.records.splice(index, 1);
                  });
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
