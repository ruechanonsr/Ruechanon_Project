# Thai Number Converter (Web Application) | โปรแกรมแปลงเลขไทย-อารบิก

A lightweight, web-based utility designed to facilitate the bi-directional conversion between **Western Arabic numerals (0-9)** and **Thai numerals (๐-๙)**. This tool is developed to streamline document preparation, particularly for official Thai government documents or formal correspondence.

เว็บแอปพลิเคชันสำหรับอำนวยความสะดวกในการแปลงตัวเลขระหว่างเลขอารบิก (0-9) และ เลขไทย (๐-๙) แบบไป-กลับ เครื่องมือนี้ถูกพัฒนาขึ้นเพื่อช่วยลดขั้นตอนในการจัดเตรียมเอกสาร โดยเฉพาะเอกสารราชการไทยหรือหนังสือที่เป็นทางการที่จำเป็นต้องใช้เลขไทย

---

## 📌 Features / คุณสมบัติเด่น

* **Bi-Directional Conversion:** Seamlessly convert from Arabic numerals to Thai numerals and vice versa.
    * **แปลงค่าได้สองทิศทาง:** สามารถแปลงจากเลขอารบิกเป็นเลขไทย หรือจากเลขไทยกลับเป็นเลขอารบิกได้อย่างถูกต้อง
* **Real-Time Processing:** Text is converted instantly as the user types, ensuring an efficient workflow.
    * **ประมวลผลทันที:** ระบบจะทำการแปลงตัวเลขให้ทันทีในขณะที่พิมพ์ ไม่ต้องกดปุ่ม Submit
* **Swap Functionality:** Easily toggle between modes with a single click.
    * **สลับโหมดง่ายดาย:** มีปุ่มสลับโหมดการทำงานระหว่าง "อารบิก -> ไทย" และ "ไทย -> อารบิก"
* **One-Click Copy:** Integrated "Copy to Clipboard" feature for quick data transfer.
    * **คัดลอกในคลิกเดียว:** มีปุ่มสำหรับคัดลอกผลลัพธ์เพื่อนำไปวางในโปรแกรมอื่น (เช่น Word, Excel) ได้ทันที
* **Clean User Interface:** Designed for usability and readability.
    * **ใช้งานง่าย:** หน้าจอออกแบบมาให้สะอาดตา เน้นการใช้งานที่สะดวกรวดเร็ว

---

## 🛠 Technologies Used / เทคโนโลยีที่ใช้

* **HTML5:** Structure and semantic markup (โครงสร้างหน้าเว็บ)
* **CSS3:** Styling, Flexbox layout, and responsive design (การจัดรูปแบบและเลย์เอาต์)
* **JavaScript (ES6):** Core logic for string manipulation and event handling (การประมวลผลและฟังก์ชันการทำงาน)

---

## 📂 Project Structure / โครงสร้างไฟล์

```text
/project-root
│
├── index.html      # Main user interface file (หน้าจอหลัก)
├── script.js       # Application logic (โค้ดควบคุมการทำงาน)
└── README.md       # Documentation (เอกสารประกอบ)