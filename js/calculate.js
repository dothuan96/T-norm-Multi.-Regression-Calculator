var dataInput = document.getElementsByClassName('dataCell');
var checkData, tnormCondition;

var matrixBeta = [];
var arrayX = [], arrayY = [], arrayRotatedX = [], inverseXrX = [];
var arrayMeanX = [], arrayMeanY = [], arrayYhat = [];

var SSreg, SSres, SSt;
var MSreg, MSres, MSt, Fvalue;
var Rsqrt, Radj, stdErr;
var stdErrBeta = [], arrayTstat = [], arrayPvalue = [];

//--------------------EXPLAIN PANEL----------------------------//
function writeMatrix(array, matrixName) {
  var step1 = matrixName + '\\begin{pmatrix} ';
  for (var i = 0; i < array.length; i++) {
    if (i >= 4) {
      i = array.length - 1;
      step1 += '\\vdots \\\\';
    }
    for (var j = 0; j < array[0].length; j++) {
      if (j >= 4) {
        j = array[0].length - 1;
        step1 += '\\cdots';
      }
      step1 += array[i][j] + " ";
      if (j < array[0].length-1)
        step1 += '& ';
      else
        step1 += '\\\\';

    }
  }
  step1 += '\\end{pmatrix} $$';
  return step1;
}

function explainStepByStep() {
  var matrixY = document.getElementById('arrayY');
  matrixY.innerHTML = writeMatrix(arrayY, '$$ Y = ');

  var matrixX = document.getElementById('arrayX');
  matrixX.innerHTML = writeMatrix(arrayX, '$$ X = ');

  var matrixInverseX = document.getElementById('arrayRotatedX');
  matrixInverseX.innerHTML = writeMatrix(arrayRotatedX, '$$ X\' = ');

  document.getElementById('numK').innerHTML = '<span>&#9864;</span> Observations: ' + arrayY.length + ' <sub>(rows)</sub><br>';
  document.getElementById('numK').innerHTML += '<span>&#9864;</span> No. independent variables: ' + (arrayX[0].length-1) + ' <sub>(columns)</sub>';

  var matrixCoe = document.getElementById('matrixBeta');
  matrixCoe.innerHTML = writeMatrix(matrixBeta, '$$ \\beta = [X\'X]^{-1}.[X\'Y] = ');
  yHat.innerHTML = '$$ \\bar{y} = \\frac{\\sum y}{Observations} = \\frac{\\sum y}{' + arrayY.length + '} = ' + arrayMeanY[0][0] + ' $$ <br> ';
  yHat.innerHTML += writeMatrix(arrayYhat, '$$ \\hat{y} = \\beta_0 + \\beta_1.X_1 + \\beta_2.X_2 + ... + \\beta_n.X_n = ');

  MathJax.Hub.Queue(["Typeset", MathJax.Hub, matrixY]);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, matrixX]);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, matrixInverseX]);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, matrixCoe]);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, yHat]);
}

//create Tnorm combination table
function tnormTable(dataCellInfo, r) {
  var arrayNum = [];
  for (var i = 0; i <= dataCellInfo.cols; i++) {
    arrayNum.push(i);
  }
  var arrNumComb = findCombination(arrayNum, r);
  console.log(arrNumComb);

  var tblHtml = '<table class="table table-bordered data-table">';
  for(var k = 0; k < arrayX.length+1; k++) {      //rows
    tblHtml += '<tr>';
    for (j = 0; j < arrayX[0].length; j++) {      //cols
      if (k == 0) {
        if (j == 0)
          tblHtml += '<th>Y</th>';
        else {
          if (j > arrayNum.length-1) {
            tblHtml += '<th>';
            for (var m = 0; m < arrNumComb[j-arrayNum.length].length; m++) {
              tblHtml += 'X<sub>' + arrNumComb[j-arrayNum.length][m] + '</sub>';
            }
            tblHtml += '</th>';
          } else
            tblHtml += '<th>X<sub>' + j + '</sub></th>';
        }
      } else {
        if (j == 0)
          tblHtml += '<td>' + arrayY[k-1][j] + '</td>';
        else
          tblHtml += '<td>' + arrayX[k-1][j] + '</td>';
      }
    }
    tblHtml += '</tr>';
  }
  tblHtml += '</table>';
  document.getElementById('tnorm-table').innerHTML = tblHtml;
}

//create ANOVA table
function ANOVAtable(dataCellInfo) {
  document.getElementsByClassName('resultTables')[0].classList.add('show-result-table');
  //regression table
  document.getElementById('Rsquare').innerHTML = Math.round(Rsqrt*100000000)/100000000;
  document.getElementById('mulR').innerHTML = Math.round(Math.sqrt(Rsqrt)*100000000)/100000000;
  document.getElementById('adjR').innerHTML = Math.round(Radj*100000000)/100000000;
  document.getElementById('stdErr').innerHTML = Math.round(stdErr*100000000)/100000000;
  document.getElementById('obser').innerHTML = dataCellInfo.rows;
  //ANOVA table
  document.getElementById('dfReg').innerHTML = dataCellInfo.cols;
  document.getElementById('dfRes').innerHTML = dataCellInfo.rows - dataCellInfo.cols -1;
  document.getElementById('dfT').innerHTML  = dataCellInfo.rows -1;
  document.getElementById('ssReg').innerHTML = Math.round(SSreg*100000000)/100000000;
  document.getElementById('ssRes').innerHTML = Math.round(SSres*100000000)/100000000;
  document.getElementById('ssT').innerHTML = Math.round(SSt*100000000)/100000000;
  document.getElementById('msReg').innerHTML = Math.round(MSreg*100000000)/100000000;
  document.getElementById('msRes').innerHTML = Math.round(MSres*100000000)/100000000;
  document.getElementById('msT').innerHTML = Math.round(MSt*100000000)/100000000;
  document.getElementById('F').innerHTML = Math.round(Fvalue*100000000)/100000000;
  //data analyze table
  var analyzeTable = '<div class="col-sm-10"><table class="anova table table-bordered"><tr><td></td><td class="symbol">Coefficents</td><td class="symbol">Standard Error</td><td class="symbol">t Stat</td><td class="symbol">P-value</td></tr>';
    for (var i = 0; i < matrixBeta.length; i++) {
      analyzeTable += '<tr>';
      for (var j = 0; j < 2; j++) {
        if (j == 0) {
          if (i == 0)
            analyzeTable += '<td>Intercept</td>';
          else
            analyzeTable += '<td>X<sub>' + i + '</sub></td>';
        }
        else {
          analyzeTable += '<td>' + Math.round(matrixBeta[i][0]*100000000)/100000000 + '</td>';
          analyzeTable += '<td>' + Math.round(stdErrBeta[i][0]*100000000)/100000000 + '</td>';
          analyzeTable += '<td>' + Math.round(arrayTstat[i][0]*100000000)/100000000 + '</td>';
          analyzeTable += '<td>' + Math.round(arrayPvalue[i][0]*100000000)/100000000 + '</td>';
        }
      }
      analyzeTable += '</tr>';
    }
    analyzeTable += '</table>';
    document.getElementById('tableAnal').innerHTML = analyzeTable;
    var anovaAreaHeight = document.getElementsByClassName('anova-wrap')[0];
    anovaAreaHeight.style.height = document.getElementsByClassName('result-panel')[0].offsetHeight + 36 + 'px';
}

//check all data cell tin data table have value or not
function checkValue() {
  var emptyCell = 0;
  for (var i = 0; i < dataInput.length; i++) {
    if (dataInput[i].value && dataInput[i]) {
      if (dataInput[i].classList.contains('empty-cell')) {
        dataInput[i].classList.remove('empty-cell');
      }
    } else {
      dataInput[i].classList.add('empty-cell');
      emptyCell++;
    }
  }

  //return boolean value to check
  if (emptyCell > 0)
    return checkData = false;
  else
    return checkData = true;
}

//get Tnorm and the quantity X
function chooseTnorm() {
  var typeTnorm = document.getElementById('tnorm').value;
  var equation = '';
  switch (parseInt(typeTnorm)) {
    case 0:
      equation = '';
      break;
    case 1:
      equation = '$$x\\otimes y = xy$$';
      break;
    case 2:
      equation = '$$x\\otimes y = min(x, y)$$';
      break;
    case 3:
      equation = '$$x\\otimes y = \\begin{Bmatrix} x, & y = 1 \\\\ y, & x = 1 \\\\ 0, & otherwise \\\\ \\end{Bmatrix}$$';
      break;
    case 4:
      equation = '$$x\\otimes y = \\frac{xy}{max(x, y, \\lambda)}$$ $$with: \\lambda = 0.6$$';
      break;
    case 5:
      equation = '$$x\\otimes y = 1-[(1-x)^p+(1-y)^p-(1-x)^p(1-y)^p]^\\frac{1}{p}$$ $$with: p \\gt 0, p = 0.8$$';
      break;
    case 6:
      equation = '$$x\\otimes y = \\frac{1}{1+\\bigl((\\frac{1}{x}-1)^\\lambda+(\\frac{1}{y}-1)^\\lambda\\bigr)^\\frac{1}{\\lambda}}$$ $$with: \\lambda \\ge 0, \\lambda = 4$$';
      break;
    case 7:
      equation = '$$x\\otimes y = (\\frac{1}{x^p}+\\frac{1}{y^p})^\\frac{-1}{p}$$ $$with: p\\ge 1, p = 2$$';
      break;
    case 8:
      equation = '$$x\\otimes y = \\frac{xy}{x+y+\\lambda}$$ $$with: \\lambda \\gt 0, \\lambda = 2$$';
      break;
    default:
      console.log('ERROR... choose tnorm again!');
  }
  console.log(equation);
  var el = document.getElementById('tnorm-equation');
  el.innerHTML = equation;
  MathJax.Hub.Queue(["Typeset", MathJax.Hub, el]);
}

function createMatrixArray (rows, cols, data, step) {
  var arrayMatrix = [];
  for (var i=0; i < rows; i++) {
    if (cols == 1) {
      var n = i;
      // create number of empty row for matrix
      arrayMatrix.push( [] );
    } else {
      var n = i+1;
      arrayMatrix.push( [1] );
    }
    // create number of empty column for matrix
    for (var j=0; j < cols; j++) {
      var a = parseFloat(data[step*i + n + j].value);
      arrayMatrix[i].push(a);
    }
  }
  return arrayMatrix;
}

function rotateX(rows, cols, matrix) {
  var arrayRotated = [];
  //when rotate matrix, rows become cols and cols become rows
  for (var i = 0; i < cols; i++) {
    arrayRotated.push( [] );
    for (var j = 0; j < rows; j++) {
      var a = matrix[j][i];
      arrayRotated[i].push(a);
    }
  }
  return arrayRotated;
}

function multiplyMatrix(matrixA, matrixB) {
  var aNumRows = matrixA.length, aNumCols = matrixA[0].length;
  var bNumRows = matrixB.length, bNumCols = matrixB[0].length;
  var arrayMultipled = new Array(aNumRows);  // initialize array of rows
  for (var row = 0; row < aNumRows; row++) {
    arrayMultipled[row] = new Array(bNumCols); // initialize the current row
    for (var col = 0; col < bNumCols; col++) {
      arrayMultipled[row][col] = 0;             // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        arrayMultipled[row][col] += matrixA[row][i] * matrixB[i][col];
      }
    }
  }
  return arrayMultipled;
}

function findBeta(dataCellInfo) {
  //create matrix X' rotated of X
  arrayRotatedX = rotateX(dataCellInfo.rows, dataCellInfo.cols + 1, arrayX);
  console.log(arrayRotatedX);
  //caculate Beta and alpha
  inverseXrX = math.inv(multiplyMatrix(arrayRotatedX, arrayX));   //multiply X rotated and X then inverse
  console.log(inverseXrX);
  var multiplyXrY = multiplyMatrix(arrayRotatedX, arrayY);    //multiply X rotated and Y
  matrixBeta = multiplyMatrix(inverseXrX, multiplyXrY);
  console.log(matrixBeta);
}

function makeMatrixForX(rows, cols, data) {
  var arrayMatrix = [];
  var n = 0;
  for (var i=0; i < cols; i++) {
    arrayMatrix.push( [] );
    // create number of empty column for matrix
    for (var j=0; j < rows; j++) {
      var a = data[n++];
      arrayMatrix[i].push(a);
    }
  }
  var newArrayMatrix = rotateX(cols, rows, arrayMatrix);
  return newArrayMatrix;
}

function minusNsumOsqure(a, b, method) {    //method: just minus OR minus then squre
  var arraySum = [];
  var z;
  for (var i=0; i < b.length; i++) {
    for (var j=0; j < a.length; j++) {
      (a.length > b.length) ? z=i : z=j;
      if (method == "none")
        arraySum.push(a[j][i] - b[z][0]);
      else
        arraySum.push(Math.pow(a[j][i] - b[z][0], 2));
    }
  }
  var arrayReturn = makeMatrixForX(a.length, a[0].length, arraySum);
  return arrayReturn;
}

function sumAll(matrixArray) {
  var sum = 0;
  for (var i = 0; i < matrixArray.length; i++) {
    sum += matrixArray[i][0];
  }
  return sum;
}

function makeMtrix1Line(rows, matrix) {
  var arrayTemp = [];
  for (var i = 0; i < rows; i++) {
    arrayTemp.push( [] );
    arrayTemp[i].push(matrix[i]);
  }
  return arrayTemp;
}

function basicParameters(dataCellInfo) {
  //find mean X
  var meanX = [];
  for (var n = 0; n <= dataCellInfo.cols; n++) {
    var sumX = 0;
    for (var i = 0; i < arrayX.length; i++) {
      sumX += arrayX[i][n];
    }
    meanX.push(sumX/dataCellInfo.rows);
  }
  arrayMeanX = makeMtrix1Line(meanX.length, meanX);
  //find mean Y
  var meanY = [];
  var sumY = 0;
  for (var i = 0; i < arrayY.length; i++) {
    sumY += arrayY[i][0];
  }
  meanY.push(sumY/dataCellInfo.rows);
  arrayMeanY = makeMtrix1Line(meanY.length, meanY);   console.log(arrayMeanY);
  //find Y hat
  var Yhat = [];
  for (var i = 0; i < arrayX.length; i++) {
    var sumYhat = 0;
    for (var j = 0; j < arrayX[0].length; j++) {
      sumYhat += arrayX[i][j] * matrixBeta[j][0];
    }
    Yhat.push(sumYhat);
  }
  arrayYhat = makeMtrix1Line(Yhat.length, Yhat);
}

function calcStandardErrorBeta() {
  var arrayStdTemp = [];
  var arrayTstatTemp = [];
    for (var i = 0; i < inverseXrX.length; i++) {
      var stdE = Math.sqrt(inverseXrX[i][i] *  MSres);
      var tstat = matrixBeta[i][0] / stdE;
      arrayStdTemp.push(stdE);
      arrayTstatTemp.push(tstat);
    }
  stdErrBeta = makeMtrix1Line(inverseXrX.length, arrayStdTemp);
  arrayTstat = makeMtrix1Line(inverseXrX.length, arrayTstatTemp);
}

function LogGamma(z) {
	with (Math) {
		var s = 1 + 76.18009173/z - 86.50532033/(z+1) + 24.01409822/(z+2) - 1.231739516/(z+3)
            + .00120858003/(z+4) - .00000536382/(z+5);
		var lg = (z-.5)*log(z+4.5) - (z+4.5)+log(s*2.50662827465);
	}
	return lg;
}

function Betinc(x, a, b) {
	var a0 = 0;
	var b0 = 1;
	var a1 = 1;
	var b1 = 1;
	var m9 = 0;
	var a2 = 0;
	var c9;
	while (Math.abs((a1-a2)/a1) > .00001) {
		a2 = a1;
		c9 = -(a+m9)*(a+b+m9)*x/(a+2*m9)/(a+2*m9+1);
		a0 = a1 + c9*a0;
		b0 = b1 + c9*b0;
		m9 = m9 + 1;
		c9 = m9*(b-m9)*x/(a+2*m9-1)/(a+2*m9);
		a1 = a0 + c9*a1;
		b1 = b0 + c9*b1;
		a0 = a0/b1;
		b0 = b0/b1;
		a1 = a1/b1;
		b1 = 1;
	}
	return a1/a;
}

function computePvalue(tstat, dfRes) {
    x = eval(tstat);       //x: t Stat
    df = eval(dfRes);     //df: df of Residual
    with(Math) {
		if(df <= 0) {
			alert("Degrees of freedom must be positive");
		} else {
			a = df/2;
			s = a + .5;
			z = df/(df + x*x);
			bt = exp(LogGamma(s) - LogGamma(.5) - LogGamma(a) + a*log(z) + .5*log(1-z));
			if (z < (a+1)/(s+2)) {
				betacdf = bt*Betinc(z, a, .5);
			} else {
				betacdf = 1 - bt*Betinc(1-z, .5, a);
			}
			if (x < 0) {
				tcdf = betacdf/2;
			} else {
				tcdf = 1-betacdf/2;
			}
		}
		//tcdf = round(tcdf*100000)/100000;
	}
    var pValue = 2 - 2*tcdf;
    return pValue;
}

function findPvalue(dfRes) {
  var arrayPTemp = [];
  console.log(dfRes);
  for (var i = 0; i < arrayTstat.length; i++) {
    //dfRes = Math.abs(dfRes);
    var a = computePvalue(Math.abs(arrayTstat[i][0]), dfRes);
    arrayPTemp.push(a);
  }
  arrayPvalue = makeMtrix1Line(arrayTstat.length, arrayPTemp);
}

function calculateANOVA(dataCellInfo) {
  //var XMinusXmean = minusNsumOsqure(arrayX, arrayMeanX, "none");
  //var YMinusYmean = minusNsumOsqure(arrayY, arrayMeanY, "none");
  //var YMinusYhat = minusNsumOsqure(arrayY, arrayYhat, "none");
  var YhatMinusYmeanPow = minusNsumOsqure(arrayYhat, arrayMeanY, "sqrt")
  SSreg = sumAll(YhatMinusYmeanPow);
  MSreg = SSreg / dataCellInfo.cols;
  var YMinusYhatPow = minusNsumOsqure(arrayY, arrayYhat, "sqrt")
  SSres = sumAll(YMinusYhatPow);
  MSres = SSres / (dataCellInfo.rows-dataCellInfo.cols-1);
  //console.log(YMinusYhatPow);
  var YMinusYmeanPow = minusNsumOsqure(arrayY, arrayMeanY, "sqrt")
  SSt = sumAll(YMinusYmeanPow);
  MSt = SSt / (dataCellInfo.rows-1);
  //console.log(YMinusYmeanPow);
  Fvalue = MSreg / MSres;
  Rsqrt = SSreg / SSt;
  Radj = 1 - (MSres/MSt);
  stdErr = Math.sqrt(MSres);
  calcStandardErrorBeta();
  findPvalue(dataCellInfo.rows-dataCellInfo.cols-1);
}

function factorial(n) {
  var f = [];
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n-1) * n;
}

function findCombination(array, r) {
  var combArray = [];

  for (var ez = 2; ez <= r; ez++) {
    //console.log(ez);
    if (ez <= 3 ) {
      var tempComb = TnormUnder3(array, ez);
    }  else {
      var tempComb = TnormAbove3(array, ez);
    }
    //console.log(tempComb);
    combArray = combArray.concat(tempComb);
  }  //console.log(combArray);
  return combArray;
}

function TnormUnder3 (array, r) {
  var combArray = [];
  for (var i = 1; i < array.length-r+1; i++) {
    var tempArray = [];

    var a = array[i];
    for (var x = 1; x < array.length; x++) {
      if (x != i && x > i)
        tempArray.push(array[x]);
    } //console.log(tempArray);


    var stop = true;
    for (var y = 0; stop; y++) {
      var newArray = [];
      var abc = true;
      for (var z = y; z < y+r-1; z++) {
        var countArr = z;
        if (tempArray[countArr] === undefined) {
          //countArr = 0;
          stop = false;
          abc = false;
          newArray = [];
        } else {
          newArray.push(tempArray[countArr]);
        }

      }
      if (newArray.length > 1 || abc) {
        newArray.unshift(a);
        combArray.push(newArray);
      }

      //for the case 2 input
      if (newArray.length == tempArray.length+1)
        stop = false;
      //for the case more than 3 input, then it'll have exception case
      if (tempArray.length >= 3 && stop == false && r > 2) {
        var stopNew = true;
        for (var w = 0; stopNew; w++) {
          var newArray = [];
          var newTempArr = [];
          for (var t = 0; t < tempArray.length; t++) {
            if (t >= w)
              newTempArr.push(tempArray[t]);
          }  //console.log(newTempArr);

          if (newTempArr.length >= r) {
            for (var q = 1; q <= newTempArr.length - 2; q++) {
              newArray = [];
              for (var p = 0; p < newTempArr.length; p++) {
                if (newArray.length < r-1) {
                  newArray.push(newTempArr[p]);
                  p += q;
                }
              }  //console.log(newArray);
              newArray.unshift(a);
              combArray.push(newArray);
            }
          }  else {
            stopNew = false;
            //console.log("STOP!!!");
          }

        }
      }

    }

  } //console.log(combArray);
  return combArray;
}

function TnormAbove3(array, r) {
  var combArray = [];
  var tempArray = [];
  var num = combArray.length;
  for (var j = 1; j < array.length; j++) {
    tempArray.push(array[j]);
  }

  for (var i = 1; i < array.length-r+1; i++) {
    //console.log(tempArray);
    for (var c = 1; r-2-c > 0; c++) {
      var conditional = true;

      for (var a = 0; conditional; a++) {
        var newTempArr = [];
        for (var l = 0; l < tempArray.length; l++) {
          newTempArr.push(tempArray[l])
        }  //console.log(newTempArr);

        //if (newTempArr.length > r) {
        //console.log(c);
        newTempArr.splice(r-2-c, a);
        if (c > 1) {
          newTempArr.splice(r-2-c, c-1);
        }
        //console.log(newTempArr);

        if (newTempArr.length >= r) {
          for (var h = 0; newTempArr.length >= r; h++) {
            var newArray = [];
            var step = 0;
            for (var k = 0; k < r-1; k++) {
              newArray.push(newTempArr[k]);
              step++;
            }

            for (var n = 0; step != 0; n++) {
              if (step < newTempArr.length) {
                if (newArray.length = r) {
                  newArray.pop();
                }

                while (newArray.length < r) {
                  newArray.push(newTempArr[step]);
                  step++;
                }  //console.log(newArray);
                combArray.push( [] );
                for (var g = 0; g < newArray.length; g++) {
                  combArray[num].push(newArray[g]);
                }  num++;

              }  else {
                step = 0;
                newTempArr.splice(r-2, 1);
                //console.log("Final combination...");
              }
            }
          }
        }  else {
          conditional = false;
          //console.log("conditional false...");
        }
      }
    }
    tempArray.splice(0,1);
  } //console.log(combArray);
  return combArray;
}

function Algebraic(array) {
  //multiply
  var alg = 1;
  for (var a = 0; a < array.length; a++) {
    alg *= array[a];
  } return alg;
}

function Logical(array) {
  //get min
  var logi = array[0];
  for (var a = 0; a < array.length; a++) {
    if (array[a] < logi)
      logi = array[a];
  } return logi;
}

function Dubois(array) {
  //follow equation
  var multi = 1, max = 0.6, dub;
  for (var a = 0; a < array.length; a++) {
    multi *= array[a];
    if (array[a] > max)
      max = array[a];
  } return dub = multi/max;
}

function Sklars(array) {
  //follow equation
  var plus = 0, multi = 1, skla;
  var p = 0.8;
  for (var a = 0; a < array.length; a++) {
    var pow;
    if (1-array[a] < 0)
      pow = Math.pow(Math.abs(1-array[a]), p) * -1;
    else
      pow = Math.pow(1-array[a], p);

    plus += pow;
    multi *= pow;
  }
  var minus;
  if (plus-multi < 0)
    minus = Math.pow(Math.abs(plus-multi), (1/p)) * -1;
  else
    minus = Math.pow(plus-multi, (1/p));
  skla = 1 - minus;
  return Math.round(skla*10000)/10000;
}

function Dombis(array) {
  //follow equation
  var plus = 0, domb;
  var lambda = 4;
  for (var a = 0; a < array.length; a++) {
    var pow;
    if ((1/array[a])-1 < 0)
      pow = Math.pow(Math.abs(1/array[a])-1, lambda) * -1;
    else
      pow = Math.pow((1/array[a])-1, lambda);
    plus += pow;
  }
  var positive;
  if (plus < 0)
    positive = Math.pow(Math.abs(plus), (1/lambda)) * -1;
  else
    positive = Math.pow(plus, (1/lambda));
  domb = 1 / (1+positive);
  return Math.round(domb*10000)/10000;
}

function Miyamoto(array) {
  //follow equation
  var plus = 0, miya;
  var p = 2;
  for (var a = 0; a < array.length; a++) {
    var pow;
    if (array[a] < 0)
      pow = Math.pow(Math.abs(array[a]), p) * -1;
    else
      pow = Math.pow(array[a], p);
    plus += 1/pow;
  }
  if (plus < 0)
    miya = Math.pow(Math.abs(plus), (-1/p)) * -1;
  else
    miya = Math.pow(plus, (-1/p));

  return Math.round(miya*10000)/10000;
}

function Sugeno(array) {
  //follow equation
  var lambda = 2;
  var multi = 1, plus = lambda, suge;
  for (var a = 0; a < array.length; a++) {
    multi *= array[a];
    plus += array[a];
  }
  suge = multi / plus;
  return Math.round(suge*10000)/10000
}

function Tnorm(dataCellInfo) {
  var n = parseInt(dataCellInfo.cols);
  var r = parseInt(document.getElementById('num-comb').value);      //option for user
  var tnormChoosen = parseInt(document.getElementById('tnorm').value);
  var comb = 0;
  for (var d = 2; d <= r; d++) {
    comb += factorial(n) / (factorial(d)*factorial(n-d));
  }
  console.log(comb);

  //create matrix X
  arrayX = createMatrixArray(dataCellInfo.rows, dataCellInfo.cols, dataCellInfo.data, dataCellInfo.cols);
  //create matrix Y, just 1 column
  arrayY = createMatrixArray(dataCellInfo.rows, 1, dataCellInfo.data, dataCellInfo.cols);
  console.log(tnormChoosen);
  if ((r <= 1 || r > n) && tnormChoosen > 0) {
    tnormCondition = false;
    document.getElementsByClassName('resultTables')[0].classList.remove('show-result-table');
    var ev = document.getElementById('inputErr');
    ev.innerHTML = 'Number of combination should be from $$2 \\le n \\le ' + n + '$$';
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, ev]);
  } else {
    tnormCondition = true;
    document.getElementById('inputErr').innerHTML = '';
    if (tnormChoosen > 0) {
      if (comb+n >= parseInt(dataCellInfo.rows)-1) {
        tnormCondition = false;
        var sum = comb+n;
        document.getElementsByClassName('resultTables')[0].classList.remove('show-result-table');
        var ev = document.getElementById('inputErr');
        ev.innerHTML = '<span data-localize="errTnorm.part1">No. new independent variables must to be</span> $$ \\lt $$ <span data-localize="errTnorm.part2">no. data points - 1</span> <br>';
        ev.innerHTML += '<span data-localize="errTnorm.rows">No. data points (rows):</span> ' + parseInt(dataCellInfo.rows) + '<br>';
        ev.innerHTML += '<span data-localize="errTnorm.newCols">No. new independent variables:</span> ' + comb + '<sub data-localize="errTnorm.subComb">(combination)</sub> + ' + n + '<sub data-localize="errTnorm.subCols">(column)</sub> = ' + sum;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, ev]);
      } else {
        //find all t-norm with constant r
        for (var i = 0; i < arrayX.length; i++) {
          var combEle = findCombination(arrayX[i], r);
          var resultArr = [];
          for (var j = 0; j < combEle.length; j++) {
            var tresult;
            switch (tnormChoosen) {
              case 1:
                tresult = Algebraic(combEle[j]);
                break;
              case 2:
                tresult = Logical(combEle[j]);
                break;
              case 3:
                tresult = 0;      //STILL NOT UNDERSTAND...
                break;
              case 4:
                tresult = Dubois(combEle[j]);
                break;
              case 5:
                tresult = Sklars(combEle[j]);
                break;
              case 6:
                tresult = Dombis(combEle[j]);
                break;
              case 7:
                tresult = Miyamoto(combEle[j]);
                break;
              case 8:
                tresult = Sugeno(combEle[j]);
                break;
              default:
                console.log('ERROR... choose tnorm again!');
            }
            arrayX[i].push(tresult);
          }
        } console.log(arrayX);
        //create tnorm table
        tnormTable(dataCellInfo, r);
        document.getElementsByClassName('tnorm-area')[0].classList.add('show-tnorm');
        document.getElementsByClassName('tnorm-wrap')[0].style.display = 'block';
      }
    } else {
      document.getElementsByClassName('tnorm-area')[0].classList.remove('show-tnorm');
      document.getElementsByClassName('tnorm-wrap')[0].style.display = 'none';
      console.log("No Tnorm's choosen!");
    } console.log(arrayX);
  } console.log(tnormCondition);

}

function Calculate() {
  checkValue();

  if (checkData) {    //all data is added
    //data for matrix X and Y
    var dataCellInfo = {
      rows: document.getElementsByClassName('dataRows').length - 1,
      cols: document.getElementsByClassName('dataCols').length - 1,
      data: document.getElementsByClassName('dataCell')
    }

    //find T-norm
    Tnorm(dataCellInfo);
    var newDataCellInfo = {
      rows: document.getElementsByClassName('dataRows').length - 1,
      cols: arrayX[0].length - 1
    }

    if (tnormCondition) {
      //calculate ANOVA
      findBeta(newDataCellInfo);
      basicParameters(newDataCellInfo);
      calculateANOVA(newDataCellInfo);
      ANOVAtable(newDataCellInfo);
    } else
      console.log('T-norm condition is wrong...');

  } else {
    console.log('error - empty cell');
  }

  explainStepByStep();
}
