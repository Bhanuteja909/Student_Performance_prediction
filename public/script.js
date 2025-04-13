document.getElementById('predict-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    document.getElementById('result').textContent = "📊 Predicted Math Score: " + result.prediction;
  } catch (error) {
    document.getElementById('result').textContent = "⚠️ Error predicting score.";
    console.error('Error:', error);
  }
});
