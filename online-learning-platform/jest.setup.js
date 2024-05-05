const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
document.head.appendChild(styleSheet);
styleSheet.sheet.insertRule(".some-problematic-css { display: none; }", 0);
