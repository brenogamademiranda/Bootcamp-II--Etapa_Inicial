const { getTotal, getIntervalText } = require('../app.js');

test('soma total de água', () => {
    const logs = [
        { amount: 200 },
        { amount: 300 },
        { amount: 500 }
    ];

    const total = getTotal(logs);

    expect(total).toBe(1000);
});

test('intervalo em minutos', () => {
    const t1 = 0;
    const t2 = 600000;

    const result = getIntervalText(t1, t2);

    expect(result).toBe('+10m');
});

test('intervalo em horas', () => {
    const t1 = 0;
    const t2 = 7200000;

    const result = getIntervalText(t1, t2);

    expect(result).toBe('+2h');
});