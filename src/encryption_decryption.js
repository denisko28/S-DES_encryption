export default function sDES(inputString, keyVal, encrypt) {
    var keysArray = prepareKeysArray(keyVal);

    var tempString = ip(inputString);
    
    var {leftString, rightString} = splitString(tempString);
    var objectHolder;

    for (var i = 0; i < 2; i++)
	{
		if (encrypt)
		{
			objectHolder = roundFunction(leftString, rightString, keysArray[i]);
		}
		else
		{
			objectHolder = roundFunction(leftString, rightString, keysArray[1 - i]);
		}

		if (i < 1)
		{
			objectHolder = switchFunction(objectHolder.leftString, objectHolder.rightString);
			leftString = objectHolder.leftString;
			rightString = objectHolder.rightString;
		}
	}

    tempString = leftString.concat(rightString);
    return ipInverse(tempString);
}

function prepareKeysArray(keyVal) {
    var tempVal = p10(keyVal);
    var {leftString, rightString} = splitString(tempVal);
    leftString = leftShift(leftString, 1);
    rightString = leftShift(rightString, 1);
    let k1 = p8(leftString.concat(rightString));
    tempVal = leftShift(leftString, 2).concat(leftShift(rightString, 2));
    let k2 = p8(tempVal);

    return [k1, k2]
}

function roundFunction(leftString, rightString, key)
{
    
	var keyLength = 4;
	var mappingFunctionResult;

	mappingFunctionResult = mappingFunction(rightString, key);

	for (var i = 0; i < keyLength; i++)
	{
		leftString[i] = leftString[i] ^ mappingFunctionResult[i];
	}

	return {
		leftString,
		rightString
	};
}

function mappingFunction(inputString, key)
{
	var keyLength = key.length;

	var postEPString = expandPermutation(inputString);

	for (var i = 0; i < keyLength; i++)
	{
		postEPString[i] = postEPString[i] ^ key[i];
	}

	var {leftString, rightString} = splitString(postEPString);

	var sboxLeft = sMatrix(leftString, 0);
	var sboxRight = sMatrix(rightString, 1);

	var tempString = sboxLeft.concat(sboxRight);
	
	return p4(tempString);
}

function p10(keyVal)
{
	var outputKey = [];
	var permutation = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
	var i = 0;
	var keyLength = 10;

	for (i = 0; i < keyLength; i++)
	{
		outputKey.push(keyVal[permutation[i] - 1]);
	}

	return outputKey;
}

function p8(keyVal)
{
	var outputKey = [];
	var permutation = [6, 3, 7, 4, 8, 5, 10, 9];
	var i = 0;
	var keyValLength = 10;
	var outputKeyLength = 8;

	if (keyVal.length != keyValLength)
	{
		return -1;
	}

	for (i = 0; i < outputKeyLength; i++)
	{
		outputKey.push(keyVal[permutation[i] - 1]);
	}

	return outputKey;
}

function splitString(inputString)
{
	var leftString = [];
	var rightString = [];
	var stringLength = inputString.length;
	var midPoint;

	midPoint = stringLength / 2;
	leftString = inputString.slice(0, midPoint);
	rightString = inputString.slice(midPoint, stringLength);

	return {
		leftString,
		rightString
	};
}

function leftShift(keyVal, shiftLength)
{
	var outputKey = [];
	var i = 0;
	var keyLength = keyVal.length;

	if (keyLength < 1)
	{
		return -1;
	}

	for (i = 0; i < keyLength; i++)
	{
		outputKey.push(keyVal[((i + shiftLength) % keyLength)]);
	}

	return outputKey;
}

function ip(inputString)
{
	var outputString = [];
	var permutation = [2, 6, 3, 1, 4, 8, 5, 7];
	var i = 0;
	var stringLength = 8;

	if (inputString.length != stringLength)
	{
		return -1;
	}

	for (i = 0; i < stringLength; i++)
	{
		outputString.push(inputString[permutation[i] - 1]);
	}

	return outputString;
}

function ipInverse(inputString)
{
	var outputString = [];
	var permutation = [4, 1, 3, 5, 7, 2, 8, 6];
	var i = 0;
	var stringLength = 8;

	if (inputString.length != stringLength)
	{
		return -1;
	}

	for (i = 0; i < stringLength; i++)
	{
		outputString.push(inputString[permutation[i] - 1]);
	}

	return outputString;
}

function expandPermutation(inputString)
{
	var outputString = [];
	var permutation = [4, 1, 2, 3, 2, 3, 4, 1];
	var i = 0;
	var inputStringLength = 4;
	var outputStringLength = 8;	

	if (inputString.length != inputStringLength)
	{
		return -1;
	}

	for (i = 0; i < outputStringLength; i++)
	{
		outputString.push(inputString[permutation[i] - 1]);
	}

	return outputString;
}

function p4(inputString)
{
	var outputString = [];
	var permutation = [2, 4, 3, 1];
	var i = 0;
	var stringLength = 4;

	if (inputString.length != stringLength)
	{
		return -1;
	}

	for (i = 0; i < stringLength; i++)
	{
		outputString.push(inputString[permutation[i] - 1]);
	}

	return outputString;
}

function xor(inputString, key)
{
	var outputString = [];
	var i = 0;
	var stringLength = inputString.length;

	if (stringLength < 1 || stringLength != key.length)
	{
		return -1;
	}

	for (i = 0; i < stringLength; i++)
	{
		outputString.push(inputString[i] ^ key[i]);
	}

	return outputString;
}

function sMatrix(inputString, sboxIndex)
{
	var sboxDefinition = [
        [
            [[[0],[1]], [[0],[0]], [[1],[1]], [[1],[0]]],
            [[[1],[1]], [[1],[0]], [[0],[1]], [[0],[0]]],
            [[[0],[0]], [[1],[0]], [[0],[1]], [[1],[1]]],
            [[[1],[1]], [[0],[1]], [[1],[1]], [[1],[0]]]
        ],
        [
            [[[0],[0]], [[0],[1]], [[1],[0]], [[1],[1]]],
            [[[1],[0]], [[0],[0]], [[0],[1]], [[1],[1]]],
            [[[1],[1]], [[0],[0]], [[0],[1]], [[0],[0]]],
            [[[1],[0]], [[0],[1]], [[0],[0]], [[1],[1]]]
        ]
	];

	if (inputString.length != 4)
	{
		return -1;
	}

	var row = (inputString[0] << 1) + inputString[3];
	var col = (inputString[1] << 1) + inputString[2];

	return sboxDefinition[sboxIndex][row][col];
}

function switchFunction(leftString, rightString)
{
	return {
		leftString: rightString,
		rightString: leftString
	};
}
