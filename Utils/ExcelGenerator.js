var xl = require('excel4node');

exports.generateLeaveReport = (arrayOfObjects) => {

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Leaves');

    //ws.row(1).freeze();

    var headerStyle = wb.createStyle({
        font: {
          color: '#dee2e6',
          size: 12,
          bold: true
        },
        fill: { 
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#00266b'
        }
    });

    var valueStyle = wb.createStyle({
        font: {
          size: 12
        }
    });

    if(arrayOfObjects && arrayOfObjects.length) {
        // headers
        let headerCount = 1;
        for( let prop in arrayOfObjects[0]) {
            ws.cell(1, headerCount).string(prop).style(headerStyle);
            ws.column(headerCount).setWidth(20);
            headerCount++;
        }
        // values
        for(let i = 0; i < arrayOfObjects.length; i++ ) {
            let valueCounter = 1;
            for( let prop in arrayOfObjects[i]) {
                let obj = arrayOfObjects[i];
                ws.cell(i + 2, valueCounter).string('' + obj[prop]).style(valueStyle);
                valueCounter++;
            }
        }
    }
    return wb;
};