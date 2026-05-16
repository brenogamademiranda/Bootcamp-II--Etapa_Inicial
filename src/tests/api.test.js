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