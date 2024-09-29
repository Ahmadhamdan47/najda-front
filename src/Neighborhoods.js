import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Neighborhoods = () => {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [houses, setHouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null); // To track the neighborhood being edited
  const [newNeighborhood, setNewNeighborhood] = useState({
    Name: ''
  });

  // Fetch neighborhoods and houses data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/neighborhoods')
      .then(response => setNeighborhoods(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/houses')
      .then(response => {
        console.log('Houses response:', response.data); // Log the response data for houses
        setHouses(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNeighborhoodHouses = (neighborhoodName) => {
    return houses.filter(house => house.Neighborhood === neighborhoodName);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNeighborhood(prevState => ({ ...prevState, [name]: value }));
  };

  // Add a new neighborhood
  const handleAddNeighborhood = () => {
    axios.post('http://localhost:5000/neighborhoods', newNeighborhood)
      .then(() => {
        fetchData();
        setNewNeighborhood({ Name: '' });
      })
      .catch(error => console.error('Error adding neighborhood:', error));
  };

  // Edit an existing neighborhood
  const handleEditNeighborhood = (neighborhood) => {
    setIsEditing(neighborhood.NeighborhoodId);
    setNewNeighborhood({
      Name: neighborhood.Name
    });
  };

  // Save edited neighborhood
  const handleSaveNeighborhood = (neighborhoodId) => {
    axios.put(`http://localhost:5000/neighborhoods/${neighborhoodId}`, newNeighborhood)
      .then(() => {
        fetchData();
        setIsEditing(null);
        setNewNeighborhood({ Name: '' });
      })
      .catch(error => console.error('Error editing neighborhood:', error));
  };

  // Delete a neighborhood
  const handleDeleteNeighborhood = (neighborhoodId) => {
    axios.delete(`http://localhost:5000/neighborhoods/${neighborhoodId}`)
      .then(() => fetchData())
      .catch(error => console.error('Error deleting neighborhood:', error));
  };

  return (
    <div className="persons-container"> {/* Reuse the same container class */}
      <h1>الأحياء</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="ابحث عن الأحياء بالاسم"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Add new neighborhood form */}
      <h2>إضافة حي جديد</h2>
      <form className="person-form">
        <input
          type="text"
          name="Name"
          placeholder="اسم الحي"
          value={newNeighborhood.Name}
          onChange={handleInputChange}
          className="form-input"
        />
        <button type="button" onClick={handleAddNeighborhood} className="form-button">إضافة حي</button>
      </form>

      {/* Neighborhoods table */}
      <h2>قائمة الأحياء</h2>
      <table className="persons-table"> {/* Reuse table class */}
        <thead>
          <tr>
            <th>الحي</th>
            <th>رقم البيت</th> {/* Changed from "البيوت" to "رقم البيت" */}
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredNeighborhoods.map(neighborhood => (
            <tr key={neighborhood.NeighborhoodId}>
              {isEditing === neighborhood.NeighborhoodId ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="Name"
                      value={newNeighborhood.Name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </td>
                  <td>
                    {getNeighborhoodHouses(neighborhood.Name).map(house => (
                      <p key={house.HouseId}>{house.HouseNumber}</p> 
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleSaveNeighborhood(neighborhood.NeighborhoodId)}>حفظ</button>
                    <button onClick={() => setIsEditing(null)}>إلغاء</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{neighborhood.Name}</td>
                  <td>
                    {getNeighborhoodHouses(neighborhood.Name).map(house => (
                      <p key={house.HouseId}>{house.HouseNumber}</p>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleEditNeighborhood(neighborhood)}>تعديل</button>
                    <button onClick={() => handleDeleteNeighborhood(neighborhood.NeighborhoodId)}>حذف</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Neighborhoods;
