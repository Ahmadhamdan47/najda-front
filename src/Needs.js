import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Persons.css'; // Reuse the same CSS for consistency

const Needs = () => {
  const [needs, setNeeds] = useState([]);
  const [persons, setPersons] = useState([]);
  const [families, setFamilies] = useState([]);
  const [houses, setHouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null); // To track the need being edited
  const [newNeed, setNewNeed] = useState({
    NeedDescription: '',
    DateSecured: '',
    PersonId: null,
    FamilyId: null,
    HouseId: null
  });

  // Fetch needs, persons, families, and houses data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/needs')
      .then(response => setNeeds(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/persons')
      .then(response => setPersons(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/families')
      .then(response => setFamilies(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/houses')
      .then(response => setHouses(response.data))
      .catch(error => console.error(error));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNeeds = needs.filter(need => need.NeedDescription.toLowerCase().includes(searchQuery.toLowerCase()));

  const getPersonName = (personId) => {
    const person = persons.find(p => p.PersonId === personId);
    return person ? person.Name : 'N/A';
  };

  const getFamilyName = (familyId) => {
    const family = families.find(f => f.FamilyId === familyId);
    return family ? family.familyName : 'N/A'; // Display the family name directly
  };

  const getHouseAddress = (houseId) => {
    const house = houses.find(h => h.HouseId === houseId);
    return house ? `${house.HouseNumber} - ${house.Address}` : 'N/A';
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNeed(prevState => ({ ...prevState, [name]: value }));
  };

  // Add a new need
  const handleAddNeed = () => {
    axios.post('http://localhost:5000/needs', newNeed)
      .then(() => {
        fetchData();
        setNewNeed({
          NeedDescription: '',
          DateSecured: '',
          PersonId: null,
          FamilyId: null,
          HouseId: null
        });
      })
      .catch(error => console.error('Error adding need:', error));
  };

  // Edit an existing need
  const handleEditNeed = (need) => {
    setIsEditing(need.NeedId);
    setNewNeed({
      NeedDescription: need.NeedDescription,
      DateSecured: need.DateSecured,
      PersonId: need.PersonId || null,
      FamilyId: need.FamilyId || null,
      HouseId: need.HouseId || null
    });
  };

  // Save edited need
  const handleSaveNeed = (needId) => {
    axios.put(`http://localhost:5000/needs/${needId}`, newNeed)
      .then(() => {
        fetchData();
        setIsEditing(null);
        setNewNeed({
          NeedDescription: '',
          DateSecured: '',
          PersonId: null,
          FamilyId: null,
          HouseId: null
        });
      })
      .catch(error => console.error('Error editing need:', error));
  };

  // Delete a need
  const handleDeleteNeed = (needId) => {
    axios.delete(`http://localhost:5000/needs/${needId}`)
      .then(() => fetchData())
      .catch(error => console.error('Error deleting need:', error));
  };

  return (
    <div className="persons-container"> {/* Reuse the same container class */}
      <h1>الاحتياجات</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="ابحث عن الاحتياجات بالوصف"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Add new need form */}
      <h2>إضافة احتياج جديد</h2>
      <form className="person-form">
        <input
          type="text"
          name="NeedDescription"
          placeholder="وصف الاحتياج"
          value={newNeed.NeedDescription}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="date"
          name="DateSecured"
          value={newNeed.DateSecured}
          onChange={handleInputChange}
          className="form-input"
        />
        <select
          name="PersonId"
          value={newNeed.PersonId || ''}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">اختر شخصاً</option>
          {persons.map(person => (
            <option key={person.PersonId} value={person.PersonId}>
              {person.Name}
            </option>
          ))}
        </select>
        <select
          name="FamilyId"
          value={newNeed.FamilyId || ''}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">اختر عائلة</option>
          {families.map(family => (
            <option key={family.FamilyId} value={family.FamilyId}>
              {getFamilyName(family.FamilyId)}
            </option>
          ))}
        </select>
        <select
          name="HouseId"
          value={newNeed.HouseId || ''}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">اختر منزلاً</option>
          {houses.map(house => (
            <option key={house.HouseId} value={house.HouseId}>
              {getHouseAddress(house.HouseId)}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleAddNeed} className="form-button">إضافة احتياج</button>
      </form>

      {/* Needs table */}
      <h2>قائمة الاحتياجات</h2>
      <table className="persons-table">
        <thead>
          <tr>
            <th>وصف الاحتياج</th>
            <th>تاريخ التأمين</th>
            <th>المستفيد</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredNeeds.map(need => (
            <tr key={need.NeedId}>
              {isEditing === need.NeedId ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="NeedDescription"
                      value={newNeed.NeedDescription}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name="DateSecured"
                      value={newNeed.DateSecured}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <select
                      name="PersonId"
                      value={newNeed.PersonId || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">اختر شخصاً</option>
                      {persons.map(person => (
                        <option key={person.PersonId} value={person.PersonId}>
                          {person.Name}
                        </option>
                      ))}
                    </select>
                    <select
                      name="FamilyId"
                      value={newNeed.FamilyId || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">اختر عائلة</option>
                      {families.map(family => (
                        <option key={family.FamilyId} value={family.FamilyId}>
                          {getFamilyName(family.FamilyId)}
                        </option>
                      ))}
                    </select>
                    <select
                      name="HouseId"
                      value={newNeed.HouseId || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">اختر منزلاً</option>
                      {houses.map(house => (
                        <option key={house.HouseId} value={house.HouseId}>
                          {getHouseAddress(house.HouseId)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleSaveNeed(need.NeedId)}>حفظ</button>
                    <button onClick={() => setIsEditing(null)}>إلغاء</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{need.NeedDescription}</td>
                  <td>{need.DateSecured}</td>
                  <td>
                    {need.PersonId ? getPersonName(need.PersonId) :
                      need.FamilyId ? `عائلة: ${getFamilyName(need.FamilyId)}` :
                      need.HouseId ? `منزل: ${getHouseAddress(need.HouseId)}` : 'N/A'}
                  </td>
                  <td>
                    <button onClick={() => handleEditNeed(need)}>تعديل</button>
                    <button onClick={() => handleDeleteNeed(need.NeedId)}>حذف</button>
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

export default Needs;
