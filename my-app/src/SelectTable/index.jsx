import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Row, Col, Button, Table } from "react-bootstrap";

const TABLE_COUNT = 10;
const CHAIRS_PER_TABLE = 4;

export default () => {
  const [selectedTables, setSelectedTables] = useState([]);
  const [reservationStatus, setReservationStatus] = useState("");
  const [tableCount, setTableCount] = useState(10);
  const [tables, setTables] = useState(generateTables(tableCount));

  // const [tables, setTables] = useState(
  //   [...Array(TABLE_COUNT).keys()].map((index) => ({
  //     id: index + 1,
  //     chairs: [...Array(CHAIRS_PER_TABLE).keys()].map((chairIndex) => ({
  //       id: index * CHAIRS_PER_TABLE + chairIndex + 1,
  //       occupied: false,
  //       selected: false,
  //     })),
  //   }))
  // );

  const [adminMode, setAdminMode] = useState(false);

  const toggleAdminMode = () => {
    setAdminMode(!adminMode);
  };

  const handleChairSelection = (tableId, chairId) => {
    const updatedTables = tables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          chairs: table.chairs.map((chair) =>
            chair.id === chairId
              ? { ...chair, selected: !chair.selected }
              : chair
          ),
        };
      }
      return table;
    });
    setTables(updatedTables);
  };

  const handleTableSelection = (tableId) => {
    if (!adminMode) {
      const isSelected = selectedTables.includes(tableId);
      if (isSelected) {
        setSelectedTables(selectedTables.filter((id) => id !== tableId));
      } else {
        setSelectedTables([...selectedTables, tableId]);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (adminMode) {
        // Handle admin actions here
        // For example, marking tables as occupied
        // This part should be implemented based on your backend logic
      } else {
        const reservations = selectedTables.map((tableId) => {
          const selectedChairs = tables[tableId - 1].chairs.filter(
            (chair) => chair.selected
          );
          return {
            tableNumber: tableId,
            chairs: selectedChairs.map((chair) => chair.id),
          };
        });

        const response = await axios.post(
          "http://localhost:8000/api/reserve",
          reservations
        );
        setReservationStatus(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setReservationStatus("Failed to reserve tables. Please try again later.");
    }
  };

  const isAdminModeAvailable = () => {
    // Check if any tables are available for admin mode
    return tables.some((table) =>
      table.chairs.every((chair) => !chair.occupied)
    );
  };

  // Function to generate tables based on count
  function generateTables(count) {
    return [...Array(count).keys()].map((index) => ({
      id: index + 1,
      chairs: [...Array(CHAIRS_PER_TABLE).keys()].map((chairIndex) => ({
        id: index * CHAIRS_PER_TABLE + chairIndex + 1,
        occupied: false,
        selected: false,
      })),
    }));
  }
  // Handler for changing table count
  const handleTableCountChange = (event) => {
    const count = parseInt(event.target.value);
    setTableCount(count);
    setTables(generateTables(count));
  };
  return (
    <div className="py-5">
      <Container>
        <h1>Table Reservation</h1>
        <Row className="align-items-center">
          <Col lg={6}>
            <Form.Group className="py-5 text-start">
              <Form.Label>Number of Tables:</Form.Label>
              <Form.Control
                type="number"
                value={tableCount}
                onChange={handleTableCountChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <h3>Only Admin can Select</h3>
          </Col>
        </Row>
        <Row>
          {tables.map((table) => (
            <Col key={table.id} lg={2} xs={4} className="text-start py-2">
              <Button
                className="px-lg-5 px-3 mt-2 border-0 d-flex flex-row"
                style={{
                  backgroundColor: selectedTables.includes(table.id)
                    ? "green"
                    : "gray",
                }}
                onClick={() => handleTableSelection(table.id)}
                disabled={
                  adminMode && table.chairs.every((chair) => chair.occupied)
                }
              >
                Table {table.id}
              </Button>
            </Col>
          ))}
          {isAdminModeAvailable() && (
            <Col lg={2} xs={4} className="text-start py-2">
              <Button
                className="px-lg-5 px-3 mt-2 border-0 d-flex flex-row"
                onClick={toggleAdminMode}
              >
                {adminMode ? "Exit Admin Mode" : "Admin Mode"}
              </Button>
            </Col>
          )}
        </Row>
        <Row className="mt-3 d-flex">
          {selectedTables.map((selectedTableId) => (
            <Col key={selectedTableId} lg={6} xs={12}>
              <h1> {selectedTableId}</h1>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Chair Number</th>
                    <th>Occupied</th>
                    {!adminMode && <th>Select</th>}
                  </tr>
                </thead>
                <tbody>
                  {tables[selectedTableId - 1].chairs.map((chair) => (
                    <tr key={chair.id}>
                      <td>{chair.id}</td>
                      <td>{chair.selected ? "Selected" && "Yes" : "No"}</td>
                      {!adminMode && (
                        <td>
                          <Button
                            variant={chair.selected ? "success" : "secondary"}
                            onClick={() =>
                              handleChairSelection(selectedTableId, chair.id)
                            }
                            disabled={chair.occupied}
                          >
                            {chair.selected ? "Selected" : "Select"}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          ))}
        </Row>
        {!adminMode && (
          <Row className="mt-3">
            <Col>
              <Form onSubmit={handleSubmit}>
                <Button type="submit">Reserve Tables</Button>
              </Form>
              {reservationStatus && <p>{reservationStatus}</p>}
            </Col>
          </Row>
        )}
        
      </Container>
    </div>
  );
};
