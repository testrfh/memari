// create a table to show instructions:
const row_items = ['Elements', 'Initial Values', 'T0: AR <- PC', 'T1: IR <- M[AR], PC <-PC+1', 'T2: AR <- IR[0:11]', 'T3', 'T4', 'T5', 'T6', 'After Execution'];
const column_items = ['statements', 'IR', 'AC', 'DR', 'PC', 'AR', 'M[AR]', 'E'];

const memoryTable = document.querySelector('.container').querySelector('tbody');
for (let i = -1; i < 4097; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < 3; j++) {
        let column = document.createElement('td');
        if (j == 0)
            column.innerText = i;
        else if (j == 1)
            column.innerText = DecToHex_address(i);
        row.appendChild(column);
    }
    memoryTable.appendChild(row);
}

const table = document.querySelector('.memory-table table');
const rows = table.getElementsByTagName('tr');
const columns = table.getElementsByTagName('td');

function updateContentsColumn() {
    let counter = startAddress;
    for (let i = parseInt('0x' + startAddress) + 1; i < parseInt('0x' + startAddress) + numberOfAddress + 1; i++) {
        columns[i * 3 + 2].innerText = memory_table_contents[counter];
        counter = addHexNumbers(counter, '1');
    }
    scrollToRow(parseInt('0x' + startAddress) + 1);
}

function update_memory_table(address) {
    let index = parseInt('0x' + address) + 1;
    columns[index * 3 + 2].innerText = writeHexNum(memory_table_contents[address]);
    columns[index * 3 + 2].classList.add('appear-content');
}

function scrollToRow(number) {
    const table = document.querySelector('.memory-table table');
    const rows = table.getElementsByTagName('tr');
    table.scrollTop = rows[number - 2].offsetTop;
}



let ir = document.querySelector('.IR');
let pc = document.querySelector('.PC');
let ac = document.querySelector('.AC');
let dr = document.querySelector('.DR');
let ar = document.querySelector('.AR');
let m = document.querySelector('.M');
let e = document.querySelector('.E');

function updateInstruction() {
    console.log(instr_values, instr_values[E]);
    e.innerText = instr_values['E'];
    ir.innerText = instr_values['IR'];
    ac.innerText = instr_values['AC'];
    dr.innerText = instr_values['DR'];
    pc.innerText = instr_values['PC'];
    ar.innerText = instr_values['AR'];
    m.innerText = instr_values['Memory'];
}
