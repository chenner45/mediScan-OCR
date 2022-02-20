import { useState, useRef } from 'react';
import preprocessImage from './preprocess';
import activate_nlp from './nlp';
import Tesseract from 'tesseract.js';
import './App.css';


function App() {
  const [drugName, setDrugName] = useState("");
  const [tabletCount, setTabletCount] = useState("");
  const [interval, setInterval] = useState("");
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  var img = document.createElement('img');
  img.src = image;
  img.onload = function () {
    setWidth(img.width);
    setHeight(img.height);
  }

  const handleChange = (event) => {
    console.log("width", event.target.files[0].width)
    setImage(URL.createObjectURL(event.target.files[0]))
  }

  const handleClick = () => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageRef.current, 0, 0);
    ctx.putImageData(preprocessImage(canvas), 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

    Tesseract.recognize(
      dataUrl, 'eng',
      {
        logger: m => console.log(m)
      }
    )
      .catch(err => {
        console.error(err);
      })
      .then(({ data: { text } }) => {
        setText(text);
        setCorrectedText(text)
        console.log(text);
      })
  }

  const handleClickNLP = () => {
    const values = activate_nlp(correctedText)
    setDrugName(values[0])
    setInterval(values[1])
    setTabletCount(values[2])
    console.log("res", values)
  }

  return (
    <div className="App">
      <main className="App-main">
        <div className="float-container">
          <div className="float-child">

            <h3>Actual Image Uploaded</h3>
            <img
              src={image}
              ref={imageRef}
            />
          </div>
          <div className="float-child">


            <h3>Processed Image</h3>
            <div className='App'>
              <canvas ref={canvasRef} width={width} height={height}></canvas>
            </div>
          </div>
        </div>
        <br></br>
        <div>
          <label className="custom-file-upload">
            <input type="file" onChange={handleChange} />
            Choose File
          </label>
          <label className="custom-file-upload">
            <button onClick={handleClick} />
            Convert to text
          </label>
        </div>

        <div className="float-container">

          <div className="float-child">

            <h3>Extracted Text</h3>
            <p className='text'> {text} </p>
          </div>

          <div className="float-child">

            <h3>Processed Text</h3>
            <p className='text'> {correctedText} </p>
          </div>
        </div>
        <br></br>
        <div>
          <span>
            <label className="custom-file-upload">
              <button onClick={handleClickNLP} />
              Analyze text
            </label>
          </span>
        </div>
        <br></br>
        <div>
          <h3>Drug Name: <span style={{ 'color': "#E2B35A" }} > {drugName}</span></h3>
          <h3>Number of times a day: <span style={{ 'color': "#E2B35A" }} >{interval}</span></h3>
          <h3>Number of pills per time: <span style={{ 'color': "#E2B35A" }} >{tabletCount}</span></h3>
        </div>
        <br></br>
      </main>
    </div >
  );
}

export default App