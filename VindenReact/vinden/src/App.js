import './App.css';
import {useState, useEffect} from 'react';

function App() {

  /*
  Skriv sök funktion så man kan söka på vara, (sätta upp i api eller app)
  man måste kunna tabort vara.
  ändra design av hur annonser visas
  uppdatera annons
  */
  
  // Set state from Fetch
  const [firebaseTrade, setFirebaseTrade] = useState([]);
  // Show / hide sections
  const [showAdd, setShowAdd] = useState(false);
  const [showCreateAdd, setShowCreateAdd] = useState(false);
  const [showUpdateAdd, setShowUpdateAdd] = useState(false);
  // Handle inputs
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Search for item
  const [searchItem, SetSearchItem] = useState("");
    // Fetch from DB api
  useEffect( () => {
    fetch(firebaseURL)
    .then(res => res.json())
    .then(data => setFirebaseTrade(data))
  },[showAdd])


  const requestBody = {
    item: item,
    description: description,
    lookingFor: lookingFor,
    name: name,
    email: email,
  };

  const firebaseURL = "https://us-central1-testfirebase-f3201.cloudfunctions.net/trade";
  
  const submitForm = (event) => {
    event.preventDefault();
    
    fetch(firebaseURL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then((res) => {
    if(res.status === 404) {
      alert("Something went wrong" + res.status)
    }
    alert("Annons publicerad")
    console.log(requestBody + " Status message: " + res.status)
  })
}

const deleteAdd = (id) => {
  fetch(firebaseURL + "/" + id, {
    method: "DELETE",
  })
}


return (
  <div className="App">
    <header className="App-header">
      <button className="button" onClick={() => setShowCreateAdd(!showCreateAdd)}> Create Add</button>
      <button className="button" onClick={() => setShowAdd(!showAdd)}> See adds</button>
      <button className="button" onClick={() => setShowUpdateAdd(!showUpdateAdd)}>Update add</button>
    </header>
  <div className="Page-body">
    <div className="CreateAdd">
      {showCreateAdd && 
        <div className="form">
        <form id="form-create" onSubmit={(event) => submitForm(event)}>
          <h3>Pryl</h3>
          <input
            className="small-textarea"
            type="text"
            id="item"
            required
            placeholder="Vad vill du byta bort..."
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <h3>Beskrivning</h3>
          <input
            className="small-textarea"
            type="textarea"
            id="description"
            required
            placeholder="Beskriv din vara..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <h3>Vill byta mot</h3>
          <input
            className="small-textarea"
            type="textarea"
            id="lookingFor"
            placeholder="Vad du vill ha..."
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
          />
          <h3>Namn</h3>
          <input
            className="small-textarea"
            type="textarea"
            id="name"
            required
            placeholder="Ditt namn..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label for="email"><h3>Epost</h3></label>
          <input
            className="small-textarea"
            type="email"
            id="email"
            name="email"
            required
            placeholder="epost@adress.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />                               
          <br/>
          <input
            type="submit"
            value="Publicera"  
          />
        </form>
        </div>
      }
      </div>
      <div className="Show-Adds">
        {showAdd &&
          <>
          <input
            className="Search-Bar"
            type="text"
            id="searchbar"
            placeholder="Sök..."
            value={searchItem}
            onChange={(e) => SetSearchItem(e.target.value)}
          />
          <button for="searchbar">Sök</button>
          {firebaseTrade.filter(adds => adds.item.toLowerCase().includes(searchItem)).map(filterAdds => (
            <div className="Items" key={filterAdds.id}>
              Pryl: {filterAdds.item} <br/>
              Beskrivning: {filterAdds.description} <br/>
              Vill ha: {filterAdds.lookingFor} <br/>
              Namn: {filterAdds.name} <br/>
              Email: {filterAdds.email} <br/>
              <button className="" onClick={() => deleteAdd(filterAdds.id)}>Ta bort annons</button>
            </div>))}
          </>
        }
      </div>
      <div className="Update-Add">
        {showUpdateAdd &&
          <>
          <div>Update here</div>
          </>
        }
      </div>
    </div>
  </div>
  );
}

export default App;
