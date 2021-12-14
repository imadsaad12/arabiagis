import React, { Fragment, useEffect, useState } from "react";
import {
  Table,
  Pagination,
  Button,
  Message,
  Icon,
  Container,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import cookies from "js-cookies";
import Error from "./Error";
import ReactToExcel from "react-html-table-to-excel";

const Home = () => {
  const [accidendts, setaccidents] = useState([]);
  const [Keys, setKeys] = useState([]);
  const [searchby, setsearchby] = useState("");
  const [input, setinput] = useState("");
  const [filtered, setfiltered] = useState([]);
  const [totalPages, settotalPages] = useState(0);
  const [Err, setErr] = useState(false);
  const [loading, setloading] = useState(false);
  const [open, setopen] = useState(false);

  const navigate = useNavigate();
  const [date, setdate] = useState({ from: "", to: "" });

  const handleSearch = () => {
    if (searchby === "Date") {
      const updatedlist = accidendts.filter(
        (i) => i[searchby] >= date.from && i[searchby] <= date.to
      );
      if (date.from === "" || date.to === "") {
        setfiltered(accidendts);
      } else {
        setfiltered(updatedlist);
      }
    } else {
      const updatedlist = accidendts.filter((i) =>
        i[searchby].startsWith(input)
      );

      if (input === "") {
        setfiltered(accidendts);
      } else {
        setfiltered(updatedlist);
      }
    }
  };

  const handleLogout = () => {
    cookies.removeItem("token");
    axios
      .delete("http://localhost:4000/logout")
      .then((res) => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record ?")) {
      axios
        .delete(`http://localhost:4000/${id}`)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const fetchdata = (page, size) => {
      setloading(true);
      const token = cookies.getItem("token");
      const payload = { headers: { Authorization: token } };
      axios
        .get(`http://localhost:4000/home?page=${page}&size=${size}`, payload)
        .then((res) => {
          setfiltered(res.data.accidentsArray);
          setaccidents(res.data.accidentsArray);
          const temp = Object.keys(res.data.accidentsArray[0]);
          setKeys(temp);
          setloading(false);
          settotalPages(res.data.totalPages);
        })
        .catch((err) => setErr(true));
    };
    fetchdata(1, 10);
  }, []);

  return (
    <>
      {loading === true ? (
        <Container style={{ marginTop: "10%" }}>
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Just one second</Message.Header>
              We are fetching that content for you.
            </Message.Content>
          </Message>
        </Container>
      ) : (
        <div>
          {!Err ? (
            <div style={{ width: 1200, marginLeft: 200, marginTop: 100 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button content="logout" onClick={handleLogout} />

                {open ? (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <input
                      type="text"
                      style={{
                        width: 300,
                        height: 40,
                        backgroundColor: "white",
                        textAlign: "center",
                      }}
                      placeholder="from . . . "
                      onChange={(e) => {
                        setdate((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                      name="from"
                    />
                    <input
                      type="text"
                      style={{
                        width: 300,
                        height: 40,
                        backgroundColor: "white",
                        textAlign: "center",
                      }}
                      placeholder="To . .  "
                      onChange={(e) => {
                        setdate((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value,
                        }));
                      }}
                      name="to"
                    />
                    <Button
                      icon="search"
                      onClick={handleSearch}
                      style={{ marginRight: "30%", height: 40 }}
                    />
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <input
                      type="text"
                      style={{
                        width: 400,
                        height: 40,
                        backgroundColor: "white",
                        textAlign: "center",
                      }}
                      placeholder="Search . . "
                      onChange={(e) => {
                        setinput(e.target.value);
                      }}
                      value={input}
                      name="search"
                    />
                    <Button
                      icon="search"
                      onClick={handleSearch}
                      style={{ marginRight: "30%", height: 40 }}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "20%",
                    marginLeft: "3%",
                    height: 50,
                    marginBottom: "1%",
                  }}
                >
                  <label style={{ fontWeight: "bold", fontSize: 15 }}>
                    Filter by :
                  </label>
                  <select
                    onChange={(e) => {
                      setsearchby(e.target.value);
                      e.target.value === "Date"
                        ? setopen(true)
                        : setopen(false);
                    }}
                    style={{
                      textAlign: "center",
                      width: "100%",
                      height: 30,
                    }}
                  >
                    {Keys.map((k, index) => {
                      return (
                        <Fragment key={index}>
                          {k !== "_id" ? <option value={k}>{k}</option> : null}
                        </Fragment>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div
                style={{
                  overflowY: "scroll",
                  overflowX: "scroll",
                  display: "block",
                  height: 390,
                }}
              >
                <Table celled compact collapsing id="accidents-table">
                  <Table.Header>
                    <Table.Row>
                      {Keys.map((key, index) => {
                        return (
                          <Table.HeaderCell key={index}>{key}</Table.HeaderCell>
                        );
                      })}
                      <Table.HeaderCell />
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {filtered.map((accidendt, index) => {
                      return (
                        <Table.Row key={index}>
                          {Object.keys(accidendt).map(function (key, index2) {
                            return (
                              <Table.Cell key={index2}>
                                {accidendt[key]}
                              </Table.Cell>
                            );
                          })}
                          <Table.Cell>
                            <Link to={`/update/${accidendt._id}`}>
                              <Button content="update" color="blue" />
                            </Link>
                          </Table.Cell>
                          <Table.Cell>
                            <Button
                              content="delete"
                              color="red"
                              onClick={() => handleDelete(accidendt._id)}
                            />
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
              <div
                style={{
                  marginLeft: "25%",
                  marginTop: "5%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Pagination
                  defaultActivePage={1}
                  totalPages={totalPages}
                  onPageChange={(e, data) => {
                    navigate(`/home?page=${data.activePage}&size=10`);
                    const token = cookies.getItem("token");
                    const payload = { headers: { Authorization: token } };
                    axios
                      .get(
                        `http://localhost:4000/home?page=${data.activePage}&size=10`,
                        payload
                      )
                      .then((res) => {
                        setfiltered(res.data.accidentsArray);
                        setaccidents(res.data.accidentsArray);
                        const temp = Object.keys(res.data.accidentsArray[0]);
                        setKeys(temp);
                        setloading(false);
                        settotalPages(res.data.totalPages);
                      })
                      .catch((err) => console.log(err));
                  }}
                />
                <ReactToExcel
                  table="accidents-table"
                  filename="Accidents details "
                  sheet="Sheet"
                  buttonText="Export To Excel"
                  className="ui primary button"
                />
              </div>
            </div>
          ) : (
            <Error />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
