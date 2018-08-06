var input = document.getElementById('localFile');
var button = document.getElementById('importClick');

input.addEventListener('change', function() {
  console.log(input.value);
  document.getElementById('labelImport').innerHTML = input.value;
})

button.addEventListener('click', function() {
  readXlsxFile(input.files[0], { dateFormat: 'MM/DD/YY' }).then(function(data) {
    // `data` is an array of rows
    // each row being an array of cells.
    //document.getElementById('result').innerText = JSON.stringify(data, null, 2)
    console.log(data);
    document.getElementById('tbData').innerHTML = "" ;
    document.getElementById('errorImport').innerHTML = "";
    var tblHtml = '<table class="table table-bordered data-table">';
    for(var i=0; i < data.length; i++) {
      tblHtml += '<tr class="dataRows">';
      for (j=0; j < data[0].length; j++) {
        if (i == 0) {
          if (j == 0)
            tblHtml += '<th class="dataCols">Y</th>';
          else
            tblHtml += '<th class="dataCols">X<sub>' + j + '</sub></th>';
        } else {
          if (data[i][j] != null) {
            tblHtml += '<td><input type="number" class="form-control dataCell" value="' + data[i][j] + '"></td>';
          }
        }
      }
      tblHtml += '</tr>';
    }
    tblHtml += '</table>';
    document.getElementById('tbData').innerHTML = tblHtml;

    $('#importModal').modal('hide');
    document.getElementById('caculator').classList.add("show-btn");
  }, (error) => {
    console.error(error)
    document.getElementById('errorImport').innerHTML = "NOTE: ERROR.......";
    //alert("Error while parsing Excel file. See console output for the error stack trace.")
  })
})

function createDataTable() {
  document.getElementById('tbData').innerHTML = "" ;
  var rows  = document.getElementById('noDataX').value;
  var cols  = document.getElementById('noX').value;

  if ((rows/10 + 1) <= (cols/10 + 1)) {
    document.getElementById('error').innerHTML = "NOTE: ERROR.......";
  } else {
    document.getElementById('error').innerHTML = "";
    var tblHtml = '<table class="table table-bordered data-table">';
    for(var i=0; i <=rows; i +=1) {
      tblHtml += '<tr class="dataRows">';
      for (j=0; j <=cols; j +=1) {
        if (i == 0) {
          if (j == 0)
            tblHtml += '<th class="dataCols">Y</th>';
          else
            tblHtml += '<th class="dataCols">X<sub>' + j + '</sub></th>';
        } else {
          tblHtml += '<td><input type="number" class="form-control dataCell"></td>';
        }
      }
      tblHtml += '</tr>';
    }
    tblHtml += '</table>';
    document.getElementById('tbData').innerHTML = tblHtml;

    /*document.getElementById('tbData').innerHTML = '<table class="table table-bordered data-table"><tbody><tr><th>Y</th><th>X<sub>1</sub></th><th>X<sub>2</sub></th><th>X<sub>3</sub></th><th>X<sub>4</sub></th></tr><tr><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="4" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="4" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td></tr><tr><td><input value="4" type="number" class="form-control dataCell"></td><td><input value="4" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="3" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td></tr><tr><td><input value="9" type="number" class="form-control dataCell"></td><td><input value="4" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td><td><input value="8" type="number" class="form-control dataCell"></td><td><input value="12" type="number" class="form-control dataCell"></td></tr><tr><td><input value="3" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="8" type="number" class="form-control dataCell"></td><td><input value="7" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td></tr><tr><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td><td><input value="4" type="number" class="form-control dataCell"></td></tr><tr><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="8" type="number" class="form-control dataCell"></td><td><input value="10" type="number" class="form-control dataCell"></td><td><input value="8" type="number" class="form-control dataCell"></td><td><input value="12" type="number" class="form-control dataCell"></td></tr><tr><td><input value="8" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td><td><input value="7" type="number" class="form-control dataCell"></td><td><input value="13" type="number" class="form-control dataCell"></td><td><input value="7" type="number" class="form-control dataCell"></td></tr><tr><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="14" type="number" class="form-control dataCell"></td><td><input value="14" type="number" class="form-control dataCell"></td><td><input value="8" type="number" class="form-control dataCell"></td></tr><tr><td><input value="5" type="number" class="form-control dataCell"></td><td><input value="14" type="number" class="form-control dataCell"></td><td><input value="6" type="number" class="form-control dataCell"></td><td><input value="12" type="number" class="form-control dataCell"></td><td><input value="5" type="number" class="form-control dataCell"></td></tr><tr><td><input value="12" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td><td><input value="9" type="number" class="form-control dataCell"></td><td><input value="8" type="number" class="form-control dataCell"></td></tr></tbody></table>';*/
    $('#manualModal').modal('hide');
    document.getElementById('caculator').classList.add("show-btn");
  }
}
