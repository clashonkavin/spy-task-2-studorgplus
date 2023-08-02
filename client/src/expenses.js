import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const Expenses = () => {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 5);
  currentDate.setMinutes(currentDate.getMinutes() + 30);
  const defaultDateTime = currentDate.toISOString().slice(0, 16);

  const [limit, setlimit] = useState(0);

  const navigate = useNavigate();
  const [catList, setcatList] = useState([]);
  const [transac, settransac] = useState([]);
  const [updateCat, setupdateCat] = useState("Misc");
  const [enterAmount, setenterAmount] = useState(false);

  //transaction adding states
  const [spentOn, setspentOn] = useState(defaultDateTime);
  const [amount, setamount] = useState(0);
  const [categ, setcateg] = useState("Misc");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    axios
      .get("http://localhost:5000/expenses", { withCredentials: true })
      .then((res) => {
        if (res.data == "error") {
          navigate("/");
        } else {
          setcatList(res.data.cat_list);
          settransac(res.data.transac);
        }
      });
  };

  const handleAddTransac = async (e) => {
    e.preventDefault();
    if (amount == "") {
      setenterAmount(true);
    } else {
      setenterAmount(false);
      await axios
        .post(
          "http://localhost:5000/expenses/add",
          { amount, categ, spentOn },
          { withCredentials: true }
        )
        .then((res) => {
          getData();
        });
    }
  };

  const updateLimit = async () => {
    if (limit == "") {
      setenterAmount(true);
    } else {
      setenterAmount(false);
      await axios
        .post(
          "http://localhost:5000/expenses/update",
          { limit, updateCat },
          { withCredentials: true }
        )
        .then((res) => {
          getData();
        });
    }
  };

  const ClearData = async () => {
    await axios
      .post(
        "http://localhost:5000/expenses/clear",
        {},
        { withCredentials: true }
      )
      .then(() => {
        getData();
      });
  };

  return (
    <div className="overall">
      <Navbar />
      <div className="pageoutline">
        <div className="expensePage">
          <div className="sidechild">
            <div className="transactions">
              <h1>Transaction history</h1>
              <hr></hr>
              <div className="actualtransac">
                {transac.length == 0 && (
                  <h3 className="noContenttext">No transaction history</h3>
                )}
                {transac.length != 0 && transac.length > 0 && (
                  <>
                    {transac.map((transaction, index) => (
                      <div className="tranprev" key={index}>
                        <p style={{ fontSize: "4vh", color: "red" }}>
                          &#8377; {transaction[0]}
                        </p>
                        <p style={{ fontSize: "2vh" }}>
                          Date: {transaction[2].slice(11, 16)}--
                          {transaction[2].slice(0, 10)}
                        </p>
                        <p style={{ fontSize: "2vh" }}>
                          Category: {transaction[1]}
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="addingT">
                <form>
                  <div className="compare">
                    <label>Amount: &#8377;</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setamount(e.target.value);
                      }}
                    />
                  </div>
                  <div className="compare">
                    <label>Category: </label>
                    <select
                      name="category"
                      defaultValue={"Misc"}
                      id="cat"
                      onChange={(e) => {
                        setcateg(e.target.value);
                      }}
                    >
                      <option value="Tuition">Tuition</option>
                      <option value="Accomodation">Accomodation</option>
                      <option value="Food">Food</option>
                      <option value="Stationry">Stationary</option>
                      <option value="Clothes">Clothes</option>
                      <option value="Health">Health</option>
                      <option value="Phone">Phone</option>
                      <option value="Travel">Travel</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Misc">Misc</option>
                    </select>
                  </div>
                  <br />
                  <div className="compare">
                    <label>Date: </label>
                    <input
                      type="datetime-local"
                      value={spentOn}
                      onChange={(event) => {
                        setspentOn(event.target.value);
                      }}
                    />
                  </div>
                  <button onClick={handleAddTransac}>Add</button>
                  <button onClick={ClearData}>Clear History</button>
                </form>
              </div>
            </div>

            {enterAmount && (
              <h4 style={{ textAlign: "center" }}>Please Enter Amount</h4>
            )}
          </div>
          <div className="sidechild">
            <div className="categorywise">
              <h1>Category-Wise</h1>

              {catList.length == 0 && <>Loading</>}
              {catList.length !== 0 && (
                <>
                  <div className="categories">
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Tuition[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Tuition[1] /
                                  catList[0].Tuition[0]) *
                                255
                              },${
                                (1 -
                                  catList[0].Tuition[1] /
                                    catList[0].Tuition[0]) *
                                255
                              },0,1)`,
                        color: catList[0].Tuition[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Tuition</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Tuition[0]}</p>
                        <p>Spent: {catList[0].Tuition[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Accomodation[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Accomodation[1] /
                                  catList[0].Accomodation[0]) *
                                300
                              },${
                                (1 -
                                  catList[0].Accomodation[1] /
                                    catList[0].Accomodation[0]) *
                                255
                              },0,1)`,
                        color:
                          catList[0].Accomodation[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Accomodation</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Accomodation[0]}</p>
                        <p>Spent: {catList[0].Accomodation[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Food[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Food[1] / catList[0].Food[0]) * 255
                              },${
                                (1 - catList[0].Food[1] / catList[0].Food[0]) *
                                255
                              },0,1)`,
                        color: catList[0].Food[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Food</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Food[0]}</p>
                        <p>Spent: {catList[0].Food[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Stationary[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Stationary[1] /
                                  catList[0].Stationary[0]) *
                                255
                              },${
                                (1 -
                                  catList[0].Stationary[1] /
                                    catList[0].Stationary[0]) *
                                255
                              },0,1)`,
                        color:
                          catList[0].Stationary[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Stationary</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Stationary[0]}</p>
                        <p>Spent: {catList[0].Stationary[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Clothes[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Clothes[1] /
                                  catList[0].Clothes[0]) *
                                255
                              },${
                                (1 -
                                  catList[0].Clothes[1] /
                                    catList[0].Clothes[0]) *
                                255
                              },0,1)`,
                        color: catList[0].Clothes[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Clothes</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Clothes[0]}</p>
                        <p>Spent: {catList[0].Clothes[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Health[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Health[1] / catList[0].Health[0]) *
                                255
                              },${
                                (1 -
                                  catList[0].Health[1] / catList[0].Health[0]) *
                                255
                              },0,1)`,
                        color: catList[0].Health[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Health</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Health[0]}</p>
                        <p>Spent: {catList[0].Health[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Phone[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Phone[1] / catList[0].Phone[0]) *
                                255
                              },${
                                (1 -
                                  catList[0].Phone[1] / catList[0].Phone[0]) *
                                255
                              },0,1)`,
                        color: catList[0].Phone[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Phone</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Phone[0]}</p>
                        <p>Spent: {catList[0].Phone[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Travel[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Travel[1] / catList[0].Travel[0]) *
                                255
                              },${
                                (1 -
                                  catList[0].Travel[1] / catList[0].Travel[0]) *
                                255
                              },0,1)`,
                        color: catList[0].Travel[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Travel</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Travel[0]}</p>
                        <p>Spent: {catList[0].Travel[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Entertainment[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Entertainment[1] /
                                  catList[0].Entertainment[0]) *
                                255
                              },${
                                (1 -
                                  catList[0].Entertainment[1] /
                                    catList[0].Entertainment[0]) *
                                255
                              },0,1)`,
                        color:
                          catList[0].Entertainment[0] == 0
                            ? "black"
                            : "#F5F5F5",
                      }}
                    >
                      <h4>Entertainment</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Entertainment[0]}</p>
                        <p>Spent: {catList[0].Entertainment[1]}</p>
                      </div>
                    </div>
                    <div
                      className="categ"
                      style={{
                        backgroundColor:
                          catList[0].Misc[0] == 0
                            ? "white"
                            : `rgba(${
                                (catList[0].Misc[1] / catList[0].Misc[0]) * 255
                              },${
                                (1 - catList[0].Misc[1] / catList[0].Misc[0]) *
                                255
                              },0,1)`,
                        color: catList[0].Misc[0] == 0 ? "black" : "#F5F5F5",
                      }}
                    >
                      <h4>Misc</h4>
                      <div className="compare" style={{ fontSize: "2vh" }}>
                        <p>Limit: {catList[0].Misc[0]}</p>
                        <p>Spent: {catList[0].Misc[1]}</p>
                      </div>
                    </div>
                  </div>
                  <div className="updater">
                    <div className="compare">
                      <label style={{ fontSize: "3vh" }}> &#8377;</label>
                      <input
                        type="number"
                        value={limit}
                        onChange={(e) => {
                          setlimit(e.target.value);
                        }}
                      />
                      <select
                        name="category"
                        defaultValue={"Misc"}
                        id="cat"
                        onChange={(e) => {
                          setupdateCat(e.target.value);
                        }}
                      >
                        <option value="Tuition">Tuition</option>
                        <option value="Accomodation">Accomodation</option>
                        <option value="Food">Food</option>
                        <option value="Stationry">Stationary</option>
                        <option value="Clothes">Clothes</option>
                        <option value="Health">Health</option>
                        <option value="Phone">Phone</option>
                        <option value="Travel">Travel</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Misc">Misc</option>
                      </select>
                      <button onClick={updateLimit}>Update Limit</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
