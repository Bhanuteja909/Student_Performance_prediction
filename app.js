const express = require('express');
const cors = require('cors');
const { InferenceSession, Tensor } = require('onnxruntime-node');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let session;

// Load ONNX model
(async () => {
  try {
    session = await InferenceSession.create('./LinearRegression_pipeline.onnx');
    console.log('✅ ONNX model loaded successfully');
  } catch (err) {
    console.error('❌ Failed to load ONNX model:', err);
  }
})();

app.post('/predict', async (req, res) => {
  try {
    const inputData = req.body;

    const {
      gender,
      race_ethnicity,
      parental_level_of_education,
      lunch,
      test_preparation_course,
      reading_score,
      writing_score
    } = inputData;

    const inputs = {
      gender: new Tensor('string', [gender], [1, 1]),
      race_ethnicity: new Tensor('string', [race_ethnicity], [1, 1]),
      parental_level_of_education: new Tensor('string', [parental_level_of_education], [1, 1]),
      lunch: new Tensor('string', [lunch], [1, 1]),
      test_preparation_course: new Tensor('string', [test_preparation_course], [1, 1]),
      reading_score: new Tensor('float32', [parseFloat(reading_score)], [1, 1]),
      writing_score: new Tensor('float32', [parseFloat(writing_score)], [1, 1]),
    };

    const output = await session.run(inputs);
    const outputName = Object.keys(output)[0]; // Get dynamic key
    const prediction = output[outputName].data[0];

    res.json({ prediction: prediction.toFixed(2) });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
