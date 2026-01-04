// ตัวแปรเก็บเลขไทย
var thaiNumber = ["๐","๑","๒","๓","๔","๕","๖","๗","๘","๙"];
// สถานะปัจจุบัน: true = อารบิก -> ไทย, false = ไทย -> อารบิก
var isArabicToThai = true;

// ฟังก์ชันหลักในการแปลงเลข
function convertNumber() {
    var inputText = document.getElementById("inputBox").value;
    var resultText = inputText;

    if (isArabicToThai) {
        // --- แปลง อารบิก -> ไทย ---
        for (var i = 0; i < 10; i++) {
            resultText = resultText.replace(new RegExp(i, 'g'), thaiNumber[i]);
        }
    } else {
        // --- แปลง ไทย -> อารบิก ---
        for (var i = 0; i < 10; i++) {
            resultText = resultText.replace(new RegExp(thaiNumber[i], 'g'), i);
        }
    }

    document.getElementById("outputBox").value = resultText;
}

// ฟังก์ชันสลับโหมด (Swap)
function swapMode() {
    // 1. กลับค่าสถานะ
    isArabicToThai = !isArabicToThai;

    // 2. เปลี่ยนข้อความ Label และ Title
    var labelLeft = document.getElementById("labelLeft");
    var labelRight = document.getElementById("labelRight");
    var mainTitle = document.getElementById("mainTitle");

    if (isArabicToThai) {
        labelLeft.innerText = "เลขอารบิก (Arabic)";
        labelRight.innerText = "เลขไทย (Thai)";
        mainTitle.innerText = "แปลงเลขอารบิกเป็นเลขไทย";
    } else {
        labelLeft.innerText = "เลขไทย (Thai)";
        labelRight.innerText = "เลขอารบิก (Arabic)";
        mainTitle.innerText = "แปลงเลขไทยเป็นเลขอารบิก";
    }

    // 3. ย้ายข้อความจาก Output กลับไป Input เพื่อให้ user แก้ไขต่อได้
    var inputBox = document.getElementById("inputBox");
    var outputBox = document.getElementById("outputBox");
    
    inputBox.value = outputBox.value; 
    
    // 4. สั่งแปลงค่าใหม่ทันที
    convertNumber();
}

// ฟังก์ชันปุ่ม Copy
function copyToClipboard() {
    var outputBox = document.getElementById("outputBox");
    var textToCopy = outputBox.value;

    // ตรวจสอบว่ามีข้อความให้ copy ไหม
    if (!textToCopy) return;

    // ใช้ Clipboard API (วิธีสมัยใหม่)
    navigator.clipboard.writeText(textToCopy).then(function() {
        // เปลี่ยนข้อความปุ่มชั่วคราวเพื่อให้รู้ว่าทำการ copy แล้ว
        var btn = document.querySelector(".copy-btn");
        var originalText = btn.innerHTML;
        
        btn.innerHTML = "<span>✅</span> เรียบร้อย!";
        setTimeout(function() {
            btn.innerHTML = originalText;
        }, 1500); // คืนค่าเดิมใน 1.5 วินาที
    }).catch(function(err) {
        alert("Copy ไม่สำเร็จ: " + err);
    });
}