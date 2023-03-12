import logo from "./logo.svg";
import "./App.css";
import { Alert, Button, Form } from "react-bootstrap";
import { useState } from "react";
import sDES from "./encryption_decryption"

function validateInputs(inputString, keyVal) {
  // debugger;
  if(inputString == null || inputString.length != 8 || isNaN(inputString)) {
    alert("Перевірте правильність введеного 8-ми бітного рядку!");
    return false;
  }
  
  if(keyVal == null || keyVal.length != 10 || isNaN(keyVal)) {
    alert("Перевірте правильність введеного 10-ти бітного ключа!");
    return false;
  }

  return true;
}

function App() {
  const [inputString, setSourceText] = useState("");
  const [keyVal, setKeyVal] = useState("");
  const [encrypt, setEncrypt] = useState(true);
  const [result, setResult] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    let valid = validateInputs(inputString, keyVal);
    if(valid) {
      setResult(sDES(inputString, keyVal, encrypt));
    }
  }

  return (
    <div className="form-container">
      <Form>
        <h3>Шифрування та дешифрування методом S-DES</h3>
        <Form.Group className="mb-3" id="text-input">
          <Form.Label>8-ми бітний рядок</Form.Label>
          <Form.Control type="text" placeholder="10011100" maxLength={8} 
            onChange={(e) => setSourceText(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mb-3" id="key-input">
          <Form.Label>10-ти бітний ключ</Form.Label>
          <Form.Control type="text" placeholder="1011000011" maxLength={10}
            onChange={(e) => setKeyVal(e.target.value)}/>
        </Form.Group>
        <div key={"inline-radio"} className="mb-3">
          <Form.Check
            inline
            label="Зашифрувати"
            name="group1"
            type="radio"
            checked={encrypt}
            onChange={(e) => setEncrypt(true)}
          />
          <Form.Check
            inline
            label="Розшифрувати"
            name="group1"
            type="radio"
            checked={!encrypt}
            onChange={(e) => setEncrypt(false)}
          />
        </div>
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" onClick={onSubmit}>
            Відправити
          </Button>
          <Button variant="secondary" type="submit">
            Очистити
          </Button>
        </div>
        {
          result != "" ?
            <Alert className="mt-3" variant="success">
              <h5>Результат:</h5>
              {result}
            </Alert>
          : 
            null
        }
      </Form>
    </div>
  );
}

export default App;
