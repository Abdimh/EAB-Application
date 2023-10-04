import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import instanceAxios from "../../../utils/AxiosSetup";
import Select from "react-select";
import { Row, Col, Button } from "reactstrap";
import Icon from "../../../components/icon/Icon";
let nextId = 0;

export default function List() {
  const [id, setId] = useState("");
  const [artists, setArtists] = useState([]);
  const [selected, setSelected] = useState([]);
  const [customers, setCustomers] = useState([]);

  //   const options = [
  //     { label: "Grapes 🍇", value: "grapes" },
  //   { label: "Mango 🥭", value: "mango" },
  //   { label: "Strawberry 🍓", value: "strawberry", disabled: true },
  // ];

  const getCustomers = async () => {
    try {
      const data = await instanceAxios.get("Customer");
      console.log(data.data);
      setCustomers(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const selectedHandler = (id) => {
    let newSelected = [...selected];

    if (selected.find((e) => e.id === id)) {
      newSelected = selected.filter((p) => p.id !== id);
    } else {
      var find = customers.find((e) => e.id === id);
      newSelected.push(find);
    }

    setSelected(newSelected);
  };

  useEffect(() => {
    getCustomers();

    /*   const id = match.params.id;
    if (id !== undefined || null || "") {
      let spUser = data.find((item) => item.id === Number(id));
      setUser(spUser);
    } else {
      setUser(data[0]);
    }
    */
  }, []);

  return (
    <>
      <div>
        <h1>Select Fruits</h1>
        <pre>{JSON.stringify(selected)}</pre>
        {/* <MultiSelect options={[customers]} value={selected} onChange={setSelected} labelledBy="Select" /> */}

        <select
          onChange={(e) => {
            var value = Number(e.target.value);

            selectedHandler(value);
          }}
        >
          {customers.map((employee, index) => {
            return <option value={employee.id}>{employee.name}</option>;
          })}
        </select>
        <br></br>
        <br></br>
        {selected.map((item) => {
          return (
            <ul>
              <li style={{ padding: 4 }}>
                <Button color="primary">
                  <span>{item.name}</span>
                  <Icon name="setting" />
                </Button>
              </li>
            </ul>
          );
        })}
      </div>
    </>
  );
}
