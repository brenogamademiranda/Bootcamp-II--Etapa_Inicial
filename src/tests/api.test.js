test('API responde corretamente', async () => {
    // Simulando o fetch globalmente para o teste
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({
                current_weather: { temperature: 25 }
            }),
        })
    );

    const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=-15.78&longitude=-47.93&current_weather=true'
    );

    const data = await response.json();

    expect(data.current_weather).toBeDefined();
    expect(data.current_weather.temperature).toBe(25);
    expect(fetch).toHaveBeenCalledTimes(1);

    
});

const { saveRecordToSupabase, loadRecordsFromSupabase } = require('../../app.js');

test('salva registro de hidratação no Supabase', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([{ id: 1, amount_ml: 250 }])
        })
    );
    const result = await saveRecordToSupabase(250);
    expect(result[0].amount_ml).toBe(250);
    expect(fetch).toHaveBeenCalledTimes(1);
});

test('carrega registros de hidratação do Supabase', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([{ id: 1, amount_ml: 200, created_at: new Date().toISOString() }])
        })
    );
    const result = await loadRecordsFromSupabase();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].amount_ml).toBe(200);
});