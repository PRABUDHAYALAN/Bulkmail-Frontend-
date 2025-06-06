import './index.css';
import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handleMsg(evt) {
    setMsg(evt.target.value);
  }

  function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const emailData = XLSX.utils.sheet_to_json(sheet, { header: "A" });
      const emails = emailData.map((row) => row.A).filter(Boolean);
      setEmailList(emails);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    if (emailList.length === 0 || msg.trim() === "") {
      alert("Please enter a message and upload a valid email file.");
      return;
    }

    setStatus(true);

    axios
      .post("https://bulkmail-backend-zk30.onrender.com/sendmail", {
        msg: msg,
        emailList: emailList,
      })
      .then(function (res) {
        if (res.data === true) {
          alert("✅ Email Sent Successfully");
          setMsg("");
          setEmailList([]);
        } else {
          alert("❌ Email Sending Failed");
        }
        setStatus(false);
      })
      .catch(function (error) {
        console.error("Error:", error);
        alert("Something went wrong.");
        setStatus(false);
      });
  }

  return (
    <div>
    <div className="bg-blue-950 text-white text-center">
      <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
    </div>
  
    <div className="bg-blue-800 text-white text-center">
      <h1 className="font-medium px-5 py-3">
        We can help your business with sending multiple emails at once
      </h1>
    </div>
  
    <div className="bg-blue-600 text-white text-center">
      <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
    </div>
  
    <div className="bg-blue-400 flex flex-col items-center text-center text-black px-4 sm:px-10 md:px-20 lg:px-40 xl:px-80 py-5">
      <textarea
        onChange={handleMsg}
        value={msg}
        className="w-full h-32 py-2 outline-none px-2 border border-black rounded-md"
        placeholder="Enter your email ..."
      ></textarea>
  
      <div className="w-full">
        <input
          type="file"
          onChange={handleFile}
          className="w-full border-4 border-dashed py-4 px-4 mt-5 mb-5"
        />
      </div>
  
      <p className="text-sm sm:text-base mb-2">Total Emails in the file: {emailList.length}</p>
  
      <button
        onClick={send}
        className="mt-3 bg-blue-950 py-2 px-6 text-white font-medium rounded-md"
      >
        {status ? "Sending..." : "Send"}
      </button>
    </div>
    <div className="bg-blue-300 text-white text-center p-8">
   
  </div>
  <div className="bg-blue-200 text-white text-center p-8">
  
</div>
  </div>
  
  );
}

export default App;
