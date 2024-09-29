import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Persons.css'; // Reuse the same CSS for styling

const Families = () => {
  const [families, setFamilies] = useState([]);
  const [persons, setPersons] = useState([]);
  const [houses, setHouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null); // To track the family being edited
  const [newFamily, setNewFamily] = useState({
    HeadOfFamily: '',
    FamilySize: '',
    PhoneNumber: '',
    Notes: '',
    HouseId: ''
  });

  // Fetch families, persons, and houses data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/families')
      .then(response => setFamilies(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/persons')
      .then(response => setPersons(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/houses')
      .then(response => setHouses(response.data))
      .catch(error => console.error(error));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredFamilies = families.filter(family => family.PhoneNumber.includes(searchQuery));

  const getFamilyMembers = (familyId) => {
    return persons.filter(person => person.FamilyId === familyId);
  };

  const getFamilyHouse = (houseId) => {
    return houses.find(house => house.HouseId === houseId);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamily(prevState => ({ ...prevState, [name]: value }));
  };

  // Add a new family
  const handleAddFamily = () => {
    axios.post('http://localhost:5000/families', newFamily)
      .then(() => {
        fetchData();
        setNewFamily({
          HeadOfFamily: '',
          FamilySize: '',
          PhoneNumber: '',
          Notes: '',
          HouseId: ''
        });
      })
      .catch(error => console.error('Error adding family:', error));
  };

  // Edit an existing family
  const handleEditFamily = (family) => {
    setIsEditing(family.FamilyId);
    setNewFamily({
      HeadOfFamily: family.HeadOfFamily || '',
      FamilySize: family.FamilySize || '',
      PhoneNumber: family.PhoneNumber || '',
      Notes: family.Notes || '',
      HouseId: family.HouseId || ''
    });
  };

  // Save edited family
  const handleSaveFamily = (familyId) => {
    axios.put(`http://localhost:5000/families/${familyId}`, newFamily)
      .then(() => {
        fetchData();
        setIsEditing(null);
        setNewFamily({
          HeadOfFamily: '',
          FamilySize: '',
          PhoneNumber: '',
          Notes: '',
          HouseId: ''
        });
      })
      .catch(error => console.error('Error editing family:', error));
  };

  // Delete a family
  const handleDeleteFamily = (familyId) => {
    axios.delete(`http://localhost:5000/families/${familyId}`)
      .then(() => fetchData())
      .catch(error => console.error('Error deleting family:', error));
  };

  // Filter persons not already assigned as heads of other families
  const availableFamilyHeads = persons.filter(
    (person) => !families.some(family => family.HeadOfFamily === person.PersonId)
  );

  return (
    <div className="persons-container"> {/* Reuse the same container class */}
      <h1>عائلات</h1>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="ابحث عن العائلات برقم الهاتف"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input" 
      />

      {/* Add new family form */}
      <h2>إضافة عائلة جديدة</h2>
      <form className="person-form"> {/* Reuse form styling */}

        {/* Head of Family dropdown */}
        <select
          name="HeadOfFamily"
          value={newFamily.HeadOfFamily}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">اختر رب الأسرة</option>
          {availableFamilyHeads.map(person => (
            <option key={person.PersonId} value={person.PersonId}>
              {person.Name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="FamilySize"
          placeholder="عدد أفراد الأسرة"
          value={newFamily.FamilySize}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="text"
          name="PhoneNumber"
          placeholder="رقم الهاتف"
          value={newFamily.PhoneNumber}
          onChange={handleInputChange}
          className="form-input"
        />
        <textarea
          name="Notes"
          placeholder="ملاحظات"
          value={newFamily.Notes}
          onChange={handleInputChange}
          className="form-textarea"
        />

        {/* House dropdown (using house number) */}
        <select
          name="HouseId"
          value={newFamily.HouseId}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">اختر رقم المنزل</option>
          {houses.map(house => (
            <option key={house.HouseId} value={house.HouseId}>
              {house.HouseNumber}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleAddFamily} className="form-button">إضافة عائلة</button>
      </form>

      {/* Families table */}
      <h2>قائمة العائلات</h2>
      <table className="persons-table"> {/* Reuse table class */}
        <thead>
          <tr>
            <th>رب الأسرة</th>
            <th>عدد أفراد الأسرة</th>
            <th>رقم الهاتف</th>
            <th>ملاحظات</th>
            <th>رقم المنزل</th>
            <th>الأعضاء</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredFamilies.map(family => (
            <tr key={family.FamilyId}>
              {isEditing === family.FamilyId ? (
                <>
                  <td>
                    <select
                      name="HeadOfFamily"
                      value={newFamily.HeadOfFamily}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">اختر رب الأسرة</option>
                      {availableFamilyHeads.map(person => (
                        <option key={person.PersonId} value={person.PersonId}>
                          {person.Name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="FamilySize"
                      value={newFamily.FamilySize}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="PhoneNumber"
                      value={newFamily.PhoneNumber}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <textarea
                      name="Notes"
                      value={newFamily.Notes}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <select
                      name="HouseId"
                      value={newFamily.HouseId}
                      onChange={handleInputChange}
                    >
                      <option value="">اختر رقم المنزل</option>
                      {houses.map(house => (
                        <option key={house.HouseId} value={house.HouseId}>
                          {house.HouseNumber}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {getFamilyMembers(family.FamilyId).map(member => (
                      <p key={member.PersonId}>{member.Name}</p>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleSaveFamily(family.FamilyId)}>حفظ</button>
                    <button onClick={() => setIsEditing(null)}>إلغاء</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{family.HeadOfFamily}</td>
                  <td>{family.FamilySize}</td>
                  <td>{family.PhoneNumber}</td>
                  <td>{family.Notes}</td>
                  <td>{getFamilyHouse(family.HouseId)?.HouseNumber || 'N/A'}</td>
                  <td>
                    {getFamilyMembers(family.FamilyId).map(member => (
                      <p key={member.PersonId}>{member.Name}</p>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => handleEditFamily(family)}>تعديل</button>
                    <button onClick={() => handleDeleteFamily(family.FamilyId)}>حذف</button>
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

export default Families;
