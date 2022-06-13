let instr_values = {
    IR: '0x' + binaryToHex(IR),
    AC: '0x' + binaryToHex(AC),
    DR: '0x' + binaryToHex(DR),
    PC: '0x' + binaryToHex(PC),
    AR: '0x' + binaryToHex(AR),
    Memory: '0x' + binaryToHex(AR),
    E: '0x' + E
}


const fetchBtn = document.getElementById('fetchBtn');
const decodeBtn = document.getElementById('decodeBtn');
const executeBtn = document.getElementById('executeBtn');
const endprogramBtn = document.getElementById('endprogramBtn');
const msgBox = document.getElementById('situation');
const end_notif_box = document.getElementById('endProgram_notif');
const rules = document.getElementById("help");

function disableBtn(button) {
    button.disabled = true;
}

function enableBtn(button) {
    button.disabled = false;
}

enableBtn(executeBtn);

function fetch_instruction() {
    instr_values["PC"] = '0x' + binaryToHex(PC);
    AR = PC; // T0
    let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
    instr_values['Memory'] = '0x' + data ? '0x' + data : '0x' + 0;

    instr_values["AR"] = '0x' + binaryToHex(AR);
    IR = contentToAddress(data);

    instr_values["IR"] = '0x' + binaryToHex(IR);
    PC = addBinary(PC, '1', 12);
    instr_values["PC"] = '0x' + binaryToHex(PC);
    disableBtn(fetchBtn);
    enableBtn(decodeBtn);

}

function decode_instruction() {
    I = IR[0];
    opcode_operation = IR.substr(1, 3);
    AR = IR.substr(4, 16);
    operation_code = AR.indexOf('1');
    instr_values["AR"] = '0x' + binaryToHex(AR);
    let data = memory_table_contents['0' + parseInt(AR, 2).toString(16)];
    instr_values['Memory'] = data ? '0x' + data : '0x' + 0;
    disableBtn(decodeBtn);
    enableBtn(executeBtn);
}

function execute_instruction() {
    fetchBtn.click();
    decodeBtn.click();
    let opcode = parseInt(opcode_operation, 2);
    let operation = operation_code;

    if (opcode == 7) {
        if (I == 0) {
            if (operation == 11) {
                disableBtn(fetchBtn);
                disableBtn(decodeBtn);
                disableBtn(executeBtn);
                messageBox.style.color = "#ff0303";
                messageBox.value = 'program ended!'
                return 0;
            } else if (operation == 10) {
                if (E == 0) {
                    console.log('if E was zero: jump', E, typeof (E));
                    PC = addBinary(PC, '1', 12);
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 9) {
                if (AC === '0000000000000000') {
                    PC = addBinary(PC, '1', 12);
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 8) {
                if (AC[0] === '1') {
                    PC = addBinary(PC, '1', 12);
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 7) {
                if (AC[15] === '0') {
                    PC = addBinary(PC, '1', 12);
                    instr_values['PC'] = '0x' + binaryToHex(PC);
                }
            } else if (operation == 6) {
                if (AC == '1111111111111111') {
                    AC = '0000000000000000';
                } else {
                    AC = addBinary(AC, '1', 16);
                }
                instr_values['AC'] = '0x' + binaryToHex(AC);
            } else if (operation == 5) {
                let temp = AC[0];
                let ans = '';
                ans = AC.substr(1, AC.length) + E;
                AC = ans;
                E = temp;
                instr_values['AC'] = '0x' + binaryToHex(AC);
                instr_values['E'] = '0x' + E;
            } else if (operation == 4) {
                let temp = AC[15];
                let ans = '';
                ans = E + AC.substr(0, AC.length - 1);
                AC = ans;
                E = temp;
                instr_values['AC'] = '0x' + binaryToHex(AC);
                instr_values['E'] = '0x' + E;
            } else if (operation == 3) {
                E = complementOne(E);
                instr_values['E'] = '0x' + E;
            } else if (operation == 2) {
                AC = complementOne(AC);
                instr_values['AC'] = '0x' + binaryToHex(AC);
            } else if (operation == 1) {
                E = 0;
                instr_values['E'] = '0x' + E;
            } else if (operation == 0) {
                AC = '0000000000000000';
                instr_values['AC'] = '0x' + binaryToHex(AC);
            }
        } else { // IO
            if (operation == 5) {
                IEN = 0;
            } else if (operation == 4) {
                IEN = 1;
            } else if (operation == 3) {
                if (FGO == 1) {
                    PC = addBinary(PC, '1', 12);
                }
            } else if (operation == 2) {
                if (FGI == 0) {
                    PC = addBinary(PC, '1', 12);
                }
            } else if (operation == 1) {
                OUTR = AC.substr(8, 15);
                FGO = 0;
            } else if (operation == 0) {
                AC = AC.substr(0, 8) + INPR;
                FGI = 0;
            }
        }
    } else {
        if (I == 1) {
            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            AR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['AR'] = '0x' + data;
            instr_values['Memory'] = '0x' + memory_table_contents['0' + data];
        }
        if (opcode == 0) {
            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['DR'] = '0x' + binaryToHex(DR);
            AC = andTwoNumbers(AC, DR);
            instr_values['AC'] = '0x' + binaryToHex(AC);
        } else if (opcode == 1) {
            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['DR'] = '0x' + binaryToHex(DR);
            if (AC == '1111111111111111') {
                AC = '0000000000000000';
            } else {
                AC = addBinary(AC, DR, 16);
            }
            E = Cout;
            instr_values['AC'] = '0x' + binaryToHex(AC);
            instr_values['E'] = '0x' + E;

        } else if (opcode == 2) {
            // current_instruction.innerText = 'LDA';
            let data = memory_table_contents['0' + parseInt(AR, 2).toString(16).toUpperCase()];
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['DR'] = '0x' + binaryToHex(DR);
            AC = DR; //T5
            instr_values['AC'] = '0x' + binaryToHex(AC);
        } else if (opcode == 3) {
            let address = '0' + parseInt(AR, 2).toString(16).toUpperCase();
            memory_table_contents[address] = binaryToHex(AC); //T4 convert address to content
            update_memory_table(address);
            instr_values['Memory'] = '0x' + memory_table_contents[address];
        } else if (opcode == 4) {
            // current_instruction.innerText = 'BUN';
            PC = AR;
            instr_values['PC'] = '0x' + binaryToHex(PC);
        } else if (opcode == 5) {
            // current_instruction.innerText = 'BSA';
            let address = '0' + parseInt(AR, 2).toString(16).toUpperCase();
            memory_table_contents[address] = binaryToHex(PC);
            update_memory_table(address);
            AR = addBinary(AR, '1', 12); //T4
            instr_values['AR'] = '0x' + binaryToHex(AR);
            instr_values['Memory'] = '0x' + memory_table_contents[address];
            PC = AR; //T5
            instr_values['PC'] = '0x' + binaryToHex(PC);
        } else if (opcode == 6) {
            let address = '0' + parseInt(AR, 2).toString(16).toUpperCase();
            let data = memory_table_contents[address];
            DR = isNegative(data) ? hexToBinary_signed(data, 16) : hexToBinary(data, 16);
            instr_values['DR'] = '0x' + binaryToHex(DR);
            if (DR == '1111111111111111') {
                DR = '0000000000000000';
            } else {
                DR = addBinary(DR, '1', 16); //T5
            }
            instr_values['DR'] = '0x' + binaryToHex(DR);

            memory_table_contents[address] = binaryToHex(DR);
            update_memory_table(address);
            data = memory_table_contents[address];
            instr_values['Memory'] = '0x' + data;
            if (DR == 0) {
                PC = addBinary(PC, '1', 12); //T6
                instr_values['PC'] = '0x' + binaryToHex(PC);
            }
        }
    }
    updateInstruction();
    disableBtn(executeBtn);
    enableBtn(fetchBtn);
    // enableBtn(decodeBtn);
    operations_line++;
}


function contentToAddress(content) {
    console.log(content);
    let bit1 = content[0];
    bit1 = hexToBinary(bit1, 4); //convert bit 1 from hex to binary (4 bits)
    let hexcode = content.substr(1, 3); //bit 1,2,3
    let address = hexToBinary(hexcode, 12);
    return bit1 + address;
}

function and(a, b) { return a == 1 && b == 1 ? 1 : 0; }

function andTwoNumbers(num1, num2) {
    let result = '';
    for (let i = 0; i < num1.length; i++) {
        result += and(num1[i], num2[i]);
    }
    return result;
}
const addBinary = (str1, str2, size) => {
    let carry = 0;
    const res = [];
    let l1 = str1.length;
    let l2 = str2.length;
    for (let i = l1 - 1, j = l2 - 1; 0 <= i || 0 <= j; --i, --j) {
        let a = 0 <= i ? Number(str1[i]) : 0,
            b = 0 <= j ? Number(str2[j]) : 0;
        res.push((a + b + carry) % 2);
        carry = 1 < a + b + carry;
    };
    if (carry) {
        res.push(1);
        Cout = 1;

    }
    if (res.length > size) {
        console.log('******res.length in addbinary******', res.length);
        return res.reverse().splice(res.length - size).join('');
    } else {
        console.log('********else of add binary****** res: ', res);
        return res.reverse().join('');
    }
};


function complementOne(number) {
    if (typeof (number) == "string") {
        let ans = '';
        for (let i = 0; i < number.length; i++) {
            if (number[i] === '1') {
                ans += '0';
            } else {
                ans += '1';
            }
        }
        return ans;
    } else {
        if (number === 0) {
            return 1;
        } else {
            return 0
        }
    }
}


function binaryToHex(number) {
    return parseInt(number, 2).toString(16).toUpperCase();
}

// number should be in string formS
function hexToBinary(number, size_number) {
    number = parseInt(number, 16);
    let zero_added = '';
    // If that returns a nonzero value, you know it is negative.
    if ((number & 0x8000) > 0) {
        number = number - 0x10000;
    }

    if (number.toString(2).length < size_number) {
        for (let i = 0; i < size_number - number.toString(2).length; i++) {
            zero_added += '0';
        }
        number = zero_added + number.toString(2);
    } else {
        number = number.toString(2);
    }
    return number;
}

function hexToBinary_signed(hex_number, size_number) {
    let answer = hexToBinary(hex_number);
    let finalAns;
    let zero_added = '';
    if (answer[0] == '-') { //if negative number
        answer = answer.substr(1, answer.length - 1);
        if (answer.length < size_number) {
            for (let i = 0; i < size_number - answer.length; i++) {
                zero_added += '0';
            }
            answer = zero_added + answer; //'00000001010101' ex
            finalAns = complementOne(answer);
            finalAns = addBinary(finalAns, '1');
            console.log('final answer in hextobinary_signed func: ', finalAns);
            return finalAns;
        } else {
            console.log('in negative hextobinary func: answer: ', answer);
        }
        console.log('in negative hextobinary func: answer: ', answer);
    }
}

function isNegative(data) {
    if (hexToBinary(data)[0] == '-') {
        return 1;
    } else {
        return 0;
    }
}

function resetProgram() {
    location.reload();
}

fetchBtn.addEventListener('click', fetch_instruction);
decodeBtn.addEventListener('click', decode_instruction);
executeBtn.addEventListener('click', execute_instruction);

endprogramBtn.addEventListener('click', () => {
    msgBox.value = 'program ended'
})
