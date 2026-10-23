const {generateSecret,validateGuess,countBullsAndCows} = require('../task4/script.js');
describe('Быки и коровы: реальная игровая логика',() => {
 test('смешанный случай',() => expect(countBullsAndCows('1234','1356')).toEqual({bulls:1,cows:1}));
 test('полное совпадение',() => expect(countBullsAndCows('1234','1234')).toEqual({bulls:4,cows:0}));
 test('нет совпадений',() => expect(countBullsAndCows('1234','5678')).toEqual({bulls:0,cows:0}));
 test('все цифры на других местах',() => expect(countBullsAndCows('1234','4321')).toEqual({bulls:0,cows:4}));
 test('ведущий ноль учитывается',() => expect(countBullsAndCows('0123','0312')).toEqual({bulls:1,cows:3}));
 test.each(['','123','12345','1123','12a4',' 1234',1234,null])('невалидный ввод %s отклоняется',value => { expect(validateGuess(value)).toBe(false); expect(() => countBullsAndCows('1234',value)).toThrow(TypeError); });
 test('невалидный секрет отклоняется',() => expect(() => countBullsAndCows('1111','1234')).toThrow(TypeError));
 test('генератор возвращает ровно четыре уникальные цифры',() => { for(let i=0;i<1000;i++) expect(validateGuess(generateSecret())).toBe(true); });
});
