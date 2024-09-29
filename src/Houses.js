import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Persons.css'; // Reusing the same CSS for styling

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [families, setFamilies] = useState([]);
  const [persons, setPersons] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null); // To track the house being edited
  const [newHouse, setNewHouse] = useState({
    HouseNumber: '',
    Address: '',
    NeighborhoodId: ''
  });

  // Fetch houses, families, persons, needs, and neighborhoods data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/houses')
      .then(response => setHouses(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/families')
      .then(response => setFamilies(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/persons')
      .then(response => setPersons(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/needs')
      .then(response => setNeeds(response.data))
      .catch(error => console.error(error));

      axios.get('http://localhost:5000/neighborhoods') // Fetch neighborhoods for the dropdown
      .then(response => {
        console.log('Neighborhoods:', response.data); // Log neighborhoods to check
        setNeighborhoods(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredHouses = houses.filter(house => house.Address.toLowerCase().includes(searchQuery.toLowerCase()));

  const getHouseMembers = (houseId) => {
    // Get persons who belong to this house but are not part of a family
    return persons.filter(person => person.HouseId === houseId && person.FamilyId === null);
  };

  const getHouseFamilies = (houseId) => {
    // Get families that belong to this house
    return families.filter(family => family.HouseId === houseId);
  };

  const getHouseNeeds = (houseId) => {
    return needs.filter(need => need.HouseId === houseId);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHouse(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle neighborhood selection from dropdown
  const handleNeighborhoodChange = (e) => {
    const selectedNeighborhood = neighborhoods.find(n => n.Name === e.target.value);
    if (selectedNeighborhood) {
      setNewHouse(prevState => ({ ...prevState, NeighborhoodId: selectedNeighborhood.NeighborhoodId }));
    }
  };

  // Add a new house
  const handleAddHouse = () => {
    axios.post('http://localhost:5000/houses', newHouse)
      .then(() => {
        fetchData();
        setNewHouse({
          HouseNumber: '',
          Address: '',
          NeighborhoodId: ''
        });
      })
      .catch(error => console.error('Error adding house:', error));
  };

  // Edit an existing house
  const handleEditHouse = (house) => {
    setIsEditing(house.HouseId);
    setNewHouse({
      HouseNumber: house.HouseNumber,
      Address: house.Address,
      NeighborhoodId: house.NeighborhoodId
    });
  };

  // Save edited house
  const handleSaveHouse = (houseId) => {
    axios.put(`http://localhost:5000/houses/${houseId}`, newHouse)
      .then(() => {
        fetchData();
        setIsEditing(null);
        setNewHouse({
          HouseNumber: '',
          Address: '',
          NeighborhoodId: ''
        });
      })
      .catch(error => console.error('Error editing house:', error));
  };

  // Delete a house
  const handleDeleteHouse = (houseId) => {
    axios.delete(`http://localhost:5000/houses/${houseId}`)
      .then(() => fetchData())
      .catch(error => console.error('Error deleting house:', error));
  };

  return (
    <div className="persons-container"> {/* Reuse the same container class */}
      <h1>بيوت</h1>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="ابحث عن المنازل بالعنوان"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input" 
      />

      {/* Add new house form */}
      <h2>إضافة منزل جديد</h2>
      <form className="person-form"> {/* Reuse form styling */}
        <input
          type="number"
          name="HouseNumber"
          placeholder="رقم المنزل"
          value={newHouse.HouseNumber}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="text"
          name="Address"
          placeholder="العنوان"
          value={newHouse.Address}
          onChange={handleInputChange}
          className="form-input"
        />

        {/* Neighborhood dropdown */}
        <select
          name="NeighborhoodId"
          onChange={handleNeighborhoodChange}
          className="form-input"
        >
          <option value="">اختر الحي</option>
          {neighborhoods.map(neighborhood => (
            <option key={neighborhood.NeighborhoodId} value={neighborhood.Name}>
              {neighborhood.Name}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleAddHouse} className="form-button">إضافة منزل</button> {/* Reuse button styling */}
      </form>

      {/* Houses table */}
      <h2>قائمة المنازل</h2>
      <table className="persons-table"> {/* Reuse table class */}
        <thead>
          <tr>
            <th>رقم المنزل</th>
            <th>العنوان</th>
            <th>الحي</th>
            <th>الأسر</th>
            <th>الأفراد</th>
            <th>الاحتياجات</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredHouses.map(house => (
            <tr key={house.HouseId}>
              {isEditing === house.HouseId ? (
                <>
                  <td>
                    <input
                      type="number"
                      name="HouseNumber"
                      value={newHouse.HouseNumber}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="Address"
                      value={newHouse.Address}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <select
                      name="NeighborhoodId"
                      onChange={handleNeighborhoodChange}
                      value={newHouse.NeighborhoodId}
                      className="form-input"
                    >
                      <option value="">اختر الحي</option>
                      {neighborhoods.map(neighborhood => (
                        <option key={neighborhood.NeighborhoodId} value={neighborhood.NeighborhoodId}>
                          {neighborhood.Name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {getHouseFamilies(house.HouseId).map(family => (
                      <p key={family.FamilyId}>{family.familyName}</p> 
                    ))}
                  </td>
                  <td>
                    {getHouseMembers(house.HouseId).map(member => (
                      <p key={member.PersonId}>{member.Name}</p>
                    ))}
                  </td>
                  <td>
                    {getHouseNeeds(house.HouseId).map(need => (
                      <p key={need.NeedId}>{need.NeedDescription}</p>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleSaveHouse(house.HouseId)}>حفظ</button>
                    <button onClick={() => setIsEditing(null)}>إلغاء</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{house.HouseNumber}</td>
                  <td>{house.Address}</td>
                  <td>{house.Neighborhood}</td>
                  <td>
                    {getHouseFamilies(house.HouseId).map(family => (
                      <p key={family.FamilyId}>{family.familyName}</p> 
                    ))}
                  </td>
                  <td>
                    {getHouseMembers(house.HouseId).map(member => (
                      <p key={member.PersonId}>{member.Name}</p>
                    ))}
                  </td>
                  <td>
                    {getHouseNeeds(house.HouseId).map(need => (
                      <p key={need.NeedId}>{need.NeedDescription}</p>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleEditHouse(house)}>تعديل</button>
                    <button onClick={() => handleDeleteHouse(house.HouseId)}>حذف</button>
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

export default Houses;
