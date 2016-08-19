

/*
 * This file is part of HTML Barcode SDK.
 *
 *
 * ConnectCode provides its HTML Barcode SDK under a dual license model designed 
 * to meet the development and distribution needs of both commercial application 
 * distributors and open source projects.
 *
 * For open source projects, please see the GNU GPL notice below. 
 *
 * For Commercial Application Distributors (OEMs, ISVs and VARs), 
 * please see <http://www.barcoderesource.com/duallicense.shtml> for more information.
 *
 *
 *
 *
 * GNU GPL v3.0 License 
 *
 * HTML Barcode SDK is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * HTML Barcode SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

export const pr = function(filtereddata) {

    var data = code128(filtereddata)

    var asiiStr = ""
    for(var i=0; i<data.length; i++){
        asiiStr += data.charCodeAt(i)+" "
    }
    return asiiStr;

}

export default function code128(filtereddata) {

    if (detectAllNumbers(filtereddata) ) {
        return digitCode(filtereddata)
    }
    return nonDigitCode(filtereddata)


}

// const START_CODEA = 208
const START_CODEB = 209
const START_CODEC = 210
const END_CODE = 211
const END_CODE_CHARCTER = String.fromCharCode(END_CODE)

function nonDigitCode(filtereddata) {
    filtereddata = addShift(filtereddata);
    let cd = generateCheckDigit_Code128ABAuto(filtereddata);

    filtereddata = getAutoSwitchingAB(filtereddata);

    filtereddata = filtereddata + cd;
    let Result = filtereddata;

    var startc = START_CODEB;
    Result = String.fromCharCode(startc) + Result + END_CODE_CHARCTER
    return Result
}

function digitCode(filtereddata) {
    let cd = generateCheckDigit_Code128CAuto(filtereddata);
    let lenFiltered = filtereddata.length;
    let Result = ""
    for (x = 0; x < lenFiltered; x = x + 2) {
        var tstr = filtereddata.substr(x, 2);
        num = parseInt(tstr, 10);
        Result = Result + getCode128CCharacterAuto(num);
    }


    Result = Result + cd;
    startc = START_CODEC;
    Result = String.fromCharCode(startc) + Result + END_CODE_CHARCTER

    return Result;
}

function getCode128ABValueAuto(inputchar) {

    var returnvalue = 0;

    if ((inputchar <= 31) && (inputchar >= 0))
        returnvalue = (inputchar + 64);
    else if ((inputchar <= 127) && (inputchar >= 32))
        returnvalue = (inputchar - 32);
    else if (inputchar == 230)
        returnvalue = 98;
    else
        returnvalue = -1;

    return returnvalue;

}


function getCode128ABCharacterAuto(inputvalue) {
    if ((inputvalue <= 94) && (inputvalue >= 0))
        inputvalue = inputvalue + 32;
    else if ((inputvalue <= 106) && (inputvalue >= 95))
        inputvalue = inputvalue + 100 + 32;
    else
        inputvalue = -1;


    return String.fromCharCode(inputvalue);

}

function getCode128CCharacterAuto(inputvalue) {

    if ((inputvalue <= 94) && (inputvalue >= 0))
        inputvalue = inputvalue + 32;
    else if ((inputvalue <= 106) && (inputvalue >= 95))
        inputvalue = inputvalue + 32 + 100;
    else
        inputvalue = -1;


    return String.fromCharCode(inputvalue);

}


function generateCheckDigit_Code128ABAuto(data) {
    var datalength = 0;
    var Sum = 104;
    var Result = -1;
    var strResult = "";

    datalength = data.length;

    var num = 0;
    var Weight = 1;

    var x = 0;
    while (x < data.length) {
        num = ScanAhead_8orMore_Numbers(data, x);
        if (num >= 8) {
            endpoint = x + num;

            var BtoC = 99;
            Sum = Sum + (BtoC * (Weight));
            Weight = Weight + 1;

            while (x < endpoint) {
                num = parseInt(data.substr(x, 2), 10);
                Sum = Sum + (num * (Weight));
                x = x + 2;
                Weight = Weight + 1;

            }
            var CtoB = 100;
            Sum = Sum + (CtoB * (Weight));
            Weight = Weight + 1;

        }
        else {
            num = data.charCodeAt(x);
            Sum = Sum + (getCode128ABValueAuto(num) * (Weight));
            x = x + 1;
            Weight = Weight + 1;

        }
    }
    Result = Sum % 103;
    strResult = getCode128ABCharacterAuto(Result);
    return strResult;
}

function getCode128CCharacter(inputvalue) {
    if ((inputvalue <= 94) && (inputvalue >= 0))
        inputvalue = inputvalue + 32;
    else if (inputvalue >= 95)
        // inputvalue = inputvalue + 32 + 100;//original 인데
        inputvalue = inputvalue + 105;
    // else
    //     inputvalue = -1;

    return String.fromCharCode(inputvalue);


}

function generateCheckDigit_Code128CAuto(data) {
    var Sum = 105;
    var Result = -1;
    var strResult = "";

    var datalength = data.length;

    var x = 0;
    var Weight = 1;
    var num = 0;

    for (x = 0; x < datalength; x = x + 2) {
        num = parseInt(data.substr(x, 2), 10);
        Sum = Sum + (num * Weight);
        Weight = Weight + 1;
    }

    Result = Sum % 103;
    strResult = getCode128CCharacter(Result);
    return strResult;
}

function OptimizeNumbers(data, x, strResult, num) {

    var BtoC = String.fromCharCode(204);
    var strResult = strResult + BtoC;

    var endpoint = x + num;
    while (x < endpoint) {
        var twonum = parseInt(data.substr(x, 2), 10);
        strResult = strResult + getCode128CCharacterAuto(twonum);
        x = x + 2;
    }

    var CtoB = String.fromCharCode(205);
    strResult = strResult + CtoB;
    return strResult;
}

function ScanAhead_8orMore_Numbers(data, x) {
    var numNumbers = 0;
    var exitx = 0;
    while ((x < data.length) && (exitx == 0)) {
        var barcodechar = data.substr(x, 1);
        var barcodevalue = barcodechar.charCodeAt(0);
        if (barcodevalue >= 48 && barcodevalue <= 57)
            numNumbers = numNumbers + 1;
        else
            exitx = 1;

        x = x + 1;

    }
    if (numNumbers > 8) {
        if (numNumbers % 2 == 1)
            numNumbers = numNumbers - 1;
    }
    return numNumbers;

}

function getAutoSwitchingAB(data) {

    var datalength = 0;
    var strResult = "";
    var shiftchar = String.fromCharCode(230);

    datalength = data.length;
    var barcodechar = "";
    var x = 0;

    for (x = 0; x < datalength; x++) {
        barcodechar = data.substr(x, 1);
        var barcodevalue = barcodechar.charCodeAt(0);

        if (barcodevalue == 31) {
            barcodechar = String.fromCharCode(barcodechar.charCodeAt(0) + 96 + 100);
            strResult = strResult + barcodechar;
        }
        else if (barcodevalue == 127) {
            barcodechar = String.fromCharCode(barcodechar.charCodeAt(0) + 100);
            strResult = strResult + barcodechar;
        }
        else {
            var num = ScanAhead_8orMore_Numbers(data, x);

            if (num >= 8) {
                strResult = OptimizeNumbers(data, x, strResult, num);
                x = x + num;
                x = x - 1;
            }
            else
                strResult = strResult + barcodechar;
        }

    }
    return strResult;

}


function detectAllNumbers(data) {

    var datalength = data.length;

    if (datalength % 2 == 1) {
        return false;
    }

    for (x = 0; x < datalength; x++) {
        var barcodechar = data.charCodeAt(x);
        if (barcodechar > 57 || barcodechar < 48) {
            return false
        }
    }

    return true;

}


function addShift(data) {
    var datalength = 0;
    var strResult = "";
    var shiftchar = String.fromCharCode(230);

    datalength = data.length;

    for (var x = 0; x < datalength; x++) {
        var barcodechar = data.substr(x, 1);
        var barcodevalue = barcodechar.charCodeAt(0);
        if ((barcodevalue <= 31) && (barcodevalue >= 0)) {

            strResult = strResult + shiftchar;
            barcodechar = String.fromCharCode(barcodechar.charCodeAt(0) + 96);
            strResult = strResult + barcodechar;
        }
        else
            strResult = strResult + barcodechar;



    }

    return strResult;
}