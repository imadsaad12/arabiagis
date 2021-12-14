import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Button } from "semantic-ui-react";

const Update = () => {
  const [accident, setaccident] = useState({});
  const [keys, setkeys] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/update/${id}`)
      .then((res) => {
        const temp = Object.keys(res.data);
        const temp2 = temp.filter((i) => i !== "_id");
        setaccident(res.data);
        setkeys(temp2);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setaccident((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    axios
      .put("http://localhost:4000/update", accident)
      .then((res) => {
        navigate("/home");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          overflowX: "scroll",
          display: "block",
          height: 120,
          width: "70%",
          marginTop: "10%",
          marginBottom: "3%",
        }}
      >
        <Table celled compact collapsing>
          <Table.Header>
            <Table.Row>
              {keys.map((key) => {
                return <Table.HeaderCell>{key}</Table.HeaderCell>;
              })}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              {Object.keys(accident).map(function (key, index) {
                return (
                  <>
                    {key !== "_id" ? (
                      <Table.Cell>
                        <input
                          name={key}
                          value={accident[key]}
                          onChange={handleChange}
                        />
                      </Table.Cell>
                    ) : null}
                  </>
                );
              })}
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
      <Button color="blue" content="update" onClick={handleSubmit} />
    </div>
  );
};

export default Update;
