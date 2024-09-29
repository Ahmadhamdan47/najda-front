import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Persons.css'; // Adding CSS for styling

const Persons = () => {
  const [persons, setPersons] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(null); // To track the person being edited
  const [newPerson, setNewPerson] = useState({
    Name: '',
    AgeCategory: '',
    IsHeadOfFamily: false,
    FamilyId: '',
    HouseId: '',
    Notes: ''
  });
  const [families, setFamilies] = useState([]); // Add this line to initialize the families state


  // Fetch persons and needs data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/persons')
      .then(response => {
        setPersons(response.data); // No need to fetch families separately
      })
      .catch(error => console.error(error));

    axios.get('http://localhost:5000/needs')
      .then(response => setNeeds(response.data))
      .catch(error => console.error(error));
      axios.get('http://localhost:5000/families')  // Fetch families for the dropdown
      .then(response => setFamilies(response.data))  // Set families data
      .catch(error => console.error(error));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPersons = persons.filter(person => person.Name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getPersonNeeds = (personId) => {
    return needs.filter(need => need.PersonId === personId);
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPerson(prevState => ({ ...prevState, [name]: value }));
  };

  // Add a new person
  const handleAddPerson = () => {
    axios.post('http://localhost:5000/persons', newPerson)
      .then(() => {
        fetchData();
        setNewPerson({
          Name: '',
          AgeCategory: '',
          IsHeadOfFamily: false,
          FamilyId: '',
          HouseId: '',
          Notes: ''
        });
      })
      .catch(error => console.error('Error adding person:', error));
  };

  // Edit an existing person
  const handleEditPerson = (person) => {
    setIsEditing(person.PersonId);
    setNewPerson({
      Name: person.Name,
      AgeCategory: person.AgeCategory,
      IsHeadOfFamily: person.IsHeadOfFamily,
      FamilyId: person.FamilyId,
      HouseId: person.HouseId,
      Notes: person.Notes
    });
  };

  // Save edited person
  const handleSavePerson = (personId) => {
    axios.put(`http://localhost:5000/persons/${personId}`, newPerson)
      .then(() => {
        fetchData();
        setIsEditing(null);
        setNewPerson({
          Name: '',
          AgeCategory: '',
          IsHeadOfFamily: false,
          FamilyId: '',
          HouseId: '',
          Notes: ''
        });
      })
      .catch(error => console.error('Error editing person:', error));
  };

  // Delete a person
  const handleDeletePerson = (personId) => {
    axios.delete(`http://localhost:5000/persons/${personId}`)
      .then(() => fetchData())
      .catch(error => console.error('Error deleting person:', error));
  };

  return (
    <div className="persons-container">
      <h3>الأفراد</h3>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="ابحث عن الأفراد بالاسم"
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
      />

      {/* Add new person form */}
      <h2>إضافة فرد جديد</h2>
      <form className="person-form">
  <input
    type="text"
    name="Name"
    placeholder="الاسم"
    value={newPerson.Name}
    onChange={handleInputChange}
    className="form-input"
  />
  <input
    type="text"
    name="AgeCategory"
    placeholder="الفئة العمرية"
    value={newPerson.AgeCategory}
    onChange={handleInputChange}
    className="form-input"
  />
  <label>
    <input
      type="checkbox"
      name="IsHeadOfFamily"
      checked={newPerson.IsHeadOfFamily}
      onChange={(e) => setNewPerson(prevState => ({ ...prevState, IsHeadOfFamily: e.target.checked }))}
    />
    رب الأسرة
  </label>

  {/* Family Dropdown */}
  <select
    name="FamilyId"
    value={newPerson.FamilyId}
    onChange={(e) => setNewPerson({ ...newPerson, FamilyId: e.target.value })}
    className="form-input"
  >
    <option value="">اختر الأسرة</option>
    {families.map(family => (
      <option key={family.FamilyId} value={family.FamilyId}>
        {family.familyName}
      </option>
    ))}
  </select>

  <input
    type="number"
    name="HouseId"
    placeholder="رقم المنزل"
    value={newPerson.HouseId}
    onChange={handleInputChange}
    className="form-input"
  />
  <textarea
    name="Notes"
    placeholder="ملاحظات"
    value={newPerson.Notes}
    onChange={handleInputChange}
    className="form-textarea"
  />
  <button type="button" onClick={handleAddPerson} className="form-button">إضافة فرد</button>
</form>

      {/* Persons table */}
      <h2>قائمة الأفراد</h2>
      <table className="persons-table">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الفئة العمرية</th>
            <th>رب الأسرة</th>
            <th>الأسرة</th>
            <th>رقم المنزل</th>
            <th>الاحتياجات</th>
            <th>ملاحظات</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredPersons.map(person => (
            <tr key={person.PersonId}>
              {isEditing === person.PersonId ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="Name"
                      value={newPerson.Name}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="AgeCategory"
                      value={newPerson.AgeCategory}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="IsHeadOfFamily"
                      checked={newPerson.IsHeadOfFamily}
                      onChange={(e) => setNewPerson(prevState => ({ ...prevState, IsHeadOfFamily: e.target.checked }))}
                    />
                  </td>
                  <td>{newPerson.familyName}</td> {/* No need to fetch familyName separately */}
                  <td>
                    <input
                      type="number"
                      name="HouseId"
                      value={newPerson.HouseId}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    {getPersonNeeds(person.PersonId).map(need => (
                      <p key={need.NeedId}>{need.NeedDescription}</p>
                    ))}
                  </td>
                  <td>
                    <textarea
                      name="Notes"
                      value={newPerson.Notes}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSavePerson(person.PersonId)}>حفظ</button>
                    <button onClick={() => setIsEditing(null)}>إلغاء</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{person.Name}</td>
                  <td>{person.AgeCategory}</td>
                  <td>{person.IsHeadOfFamily ? 'نعم' : 'لا'}</td>
                  <td>{person.familyName}</td> {/* Render familyName directly */}
                  <td>{person.HouseNumber}</td>
                  <td>
                    {getPersonNeeds(person.PersonId).map(need => (
                      <p key={need.NeedId}>{need.NeedDescription}</p>
                    ))}
                  </td>
                  <td>{person.Notes}</td>
                  <td>
                    <button onClick={() => handleEditPerson(person)}>تعديل</button>
                    <button onClick={() => handleDeletePerson(person.PersonId)}>حذف</button>
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

export default Persons;
