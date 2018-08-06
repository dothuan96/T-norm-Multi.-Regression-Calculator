//-------------------------------EXPORT TABLE TO EXCEL FILE--------------------------------------------------------
$('#exp-btn').click(function() {
  var wb = XLSX.utils.book_new();
  //wb.SheetNames.push("Test Sheet");

  var ws1 = XLSX.utils.table_to_sheet(document.getElementById('tnorm-table'));
  wb.SheetNames.push("T norm");
  wb.Sheets["T norm"] = ws1;

  var ws2 = XLSX.utils.table_to_sheet(document.getElementById('tableAnal'));
  wb.SheetNames.push("Anova");
  wb.Sheets["Anova"] = ws2;

  var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

  function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
  }

  console.log('clicked');
  saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "Reg.xlsx");
});
